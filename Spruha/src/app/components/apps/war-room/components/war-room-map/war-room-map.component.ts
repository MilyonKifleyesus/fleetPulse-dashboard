import { Component, input, output, AfterViewInit, OnDestroy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Node as WarRoomNode, CompanyData } from '../../../../../shared/models/war-room.interface';
import { WarRoomService } from '../../../../../shared/services/war-room.service';

declare global {
  interface Window {
    jsVectorMap: any;
  }
}

@Component({
  selector: 'app-war-room-map',
  imports: [CommonModule],
  templateUrl: './war-room-map.component.html',
  styleUrls: ['./war-room-map.component.scss'],
})
export class WarRoomMapComponent implements AfterViewInit, OnDestroy {
  // Inputs
  nodes = input<WarRoomNode[]>([]);
  selectedCompany = input<CompanyData | null>(null);

  // Outputs
  nodeSelected = output<WarRoomNode>();

  // ...



  // Services
  private warRoomService = inject(WarRoomService);

  // Private properties
  private mapInstance: any = null;
  private scriptsLoaded = false;
  private labelPositions = new Map<string, { x: number; y: number }>();
  private updateLabelsInterval: ReturnType<typeof setInterval> | null = null;
  private mapReadyRetryInterval: ReturnType<typeof setInterval> | null = null;
  private isFullscreen = false;
  private destroyed = false;
  private labelObserver: MutationObserver | null = null;
  private nodeObserver: MutationObserver | null = null;
  private boundFullscreenHandler: (() => void) | null = null;
  private zoomTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private updateMarkersTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private mapInitAttempts = 0;
  private readonly maxMapInitRetries = 10;
  /** Queued company id to zoom to when map becomes ready (avoids "map not available" race). */
  private pendingZoomCompanyId: string | null = null;

  constructor() {
    // Effect to zoom to selected company location when it changes
    effect(() => {
      const selected = this.selectedCompany();
      if (selected && this.mapInstance) {
        // Clear any existing timeout
        if (this.zoomTimeoutId) {
          clearTimeout(this.zoomTimeoutId);
        }
        this.zoomTimeoutId = setTimeout(() => {
          if (!this.destroyed) {
            this.zoomToCompany(selected.id);
          }
          this.zoomTimeoutId = null;
        }, 200);
      }
      // Cleanup function for effect
      return () => {
        if (this.zoomTimeoutId) {
          clearTimeout(this.zoomTimeoutId);
          this.zoomTimeoutId = null;
        }
      };
    });

    effect(() => {
      const nodes = this.nodes();
      if (this.mapInstance && nodes.length > 0 && this.scriptsLoaded) {
        // Clear any existing timeout
        if (this.updateMarkersTimeoutId) {
          clearTimeout(this.updateMarkersTimeoutId);
        }
        this.updateMarkersTimeoutId = setTimeout(() => {
          if (!this.destroyed) {
            this.updateMapMarkers();
          }
          this.updateMarkersTimeoutId = null;
        }, 500);
      }
      // Cleanup function for effect
      return () => {
        if (this.updateMarkersTimeoutId) {
          clearTimeout(this.updateMarkersTimeoutId);
          this.updateMarkersTimeoutId = null;
        }
      };
    });
  }

  ngAfterViewInit(): void {
    // Wait for view to be fully initialized
    setTimeout(() => {
      this.loadScripts()
        .then(() => {
          this.initializeMap();
        })
        .catch((error) => {
          console.error('Failed to load map scripts:', error);
        });
    }, 200);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.pendingZoomCompanyId = null;
    
    // Clear timeouts
    if (this.zoomTimeoutId) {
      clearTimeout(this.zoomTimeoutId);
      this.zoomTimeoutId = null;
    }
    if (this.updateMarkersTimeoutId) {
      clearTimeout(this.updateMarkersTimeoutId);
      this.updateMarkersTimeoutId = null;
    }
    
    // Clear intervals
    if (this.updateLabelsInterval) {
      clearInterval(this.updateLabelsInterval);
      this.updateLabelsInterval = null;
    }
    if (this.mapReadyRetryInterval) {
      clearInterval(this.mapReadyRetryInterval);
      this.mapReadyRetryInterval = null;
    }
    
    // Disconnect MutationObservers
    if (this.labelObserver) {
      this.labelObserver.disconnect();
      this.labelObserver = null;
    }
    if (this.nodeObserver) {
      this.nodeObserver.disconnect();
      this.nodeObserver = null;
    }
    
    // Remove event listeners
    if (this.boundFullscreenHandler) {
      document.removeEventListener('fullscreenchange', this.boundFullscreenHandler);
      document.removeEventListener('webkitfullscreenchange', this.boundFullscreenHandler);
      document.removeEventListener('msfullscreenchange', this.boundFullscreenHandler);
      this.boundFullscreenHandler = null;
    }
    
    if (this.isFullscreen) {
      this.exitFullscreen();
    }
    this.mapInstance = null;
  }

  private loadScripts(): Promise<void> {
    // Check if scripts are already loaded (via angular.json)
    if (this.scriptsLoaded || (window as any).jsVectorMap) {
      this.scriptsLoaded = true;
      // Wait longer for world map data to be available
      return new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Fallback: dynamically load scripts if not loaded via angular.json
    return new Promise((resolve, reject) => {
      // Load CSS specifically for jsVectorMap
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/libs/jsvectormap/css/jsvectormap.min.css';
      document.head.appendChild(link);

      // Load jsVectorMap library
      const script1 = document.createElement('script');
      script1.src = '/assets/libs/jsvectormap/js/jsvectormap.min.js';
      script1.onload = () => {
        if (this.destroyed) {
          reject(new Error('Component destroyed before scripts loaded'));
          return;
        }
        // Load world map data
        const script2 = document.createElement('script');
        script2.src = '/assets/libs/jsvectormap/maps/world.js';
        script2.onload = () => {
          if (this.destroyed) {
            reject(new Error('Component destroyed before scripts loaded'));
            return;
          }
          this.scriptsLoaded = true;
          // Wait a bit more for the map data to be fully processed
          setTimeout(() => {
            if (!this.destroyed) {
              resolve();
            }
          }, 300);
        };
        script2.onerror = () => reject(new Error('Failed to load world map data'));
        document.head.appendChild(script2);
      };
      script1.onerror = () => reject(new Error('Failed to load jsVectorMap library'));
      document.head.appendChild(script1);
    });
  }

  private initializeMap(): void {
    if (!window.jsVectorMap) {
      console.error('jsVectorMap library not loaded');
      return;
    }

    // Check if container exists
    const container = document.getElementById('war-room-map');
    if (!container) {
      console.error('Map container #war-room-map not found');
      this.mapInitAttempts++;
      if (this.mapInitAttempts < this.maxMapInitRetries) {
        setTimeout(() => {
          if (!this.destroyed) {
            this.initializeMap();
          }
        }, 200); // Retry after 200ms
      } else {
        console.error('Max retry attempts reached for map initialization');
      }
      return;
    }

    // Check if container has dimensions, if not set a minimum
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      console.warn('Map container has no dimensions, setting minimum...', rect);
      // Set explicit dimensions if parent doesn't provide them
      const parent = container.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        if (parentRect.height === 0 || rect.height === 0) {
          // Set explicit height on both container and parent if needed
          if (rect.height === 0) {
            container.style.height = '600px';
            console.log('Set container height to 600px');
          }
          if (parentRect.height === 0 && parent) {
            parent.style.height = '600px';
            console.log('Set parent height to 600px');
          }
        }
        if (parentRect.width === 0 || rect.width === 0) {
          container.style.width = '100%';
          if (parent) {
            parent.style.width = '100%';
          }
          console.log('Set container width to 100%');
        }
      }
      // Wait a bit for styles to apply, then retry
      this.mapInitAttempts++;
      if (this.mapInitAttempts < this.maxMapInitRetries) {
        setTimeout(() => {
          if (!this.destroyed) {
            this.initializeMap();
          }
        }, 150);
      } else {
        console.error('Max retry attempts reached for map dimension initialization');
      }
      return;
    }
    
    // Reset attempt counter on successful initialization
    this.mapInitAttempts = 0;

    console.log('Map container dimensions:', rect.width, 'x', rect.height);

    const nodes = this.nodes();
    if (nodes.length === 0) {
      console.warn('No nodes available for map initialization');
      return;
    }

    console.log('Initializing map with', nodes.length, 'nodes');

    // Clean up any existing map instance without removing the container.
    // Removing the container causes "Container disappeared before initialization" when
    // reinitializing (e.g. after adding a company) because the DOM node is gone.
    if (this.mapInstance) {
      try {
        const el = document.getElementById('war-room-map');
        if (el) {
          el.innerHTML = '';
        }
      } catch (e) {
        console.warn('Error cleaning up existing map:', e);
      }
      this.mapInstance = null;
    }

    setTimeout(() => {
      try {
        if (this.destroyed) return;
        const finalCheck = document.getElementById('war-room-map');
        if (!finalCheck) return;

        const finalRect = finalCheck.getBoundingClientRect();
        if (finalRect.width === 0 || finalRect.height === 0) {
          console.error('Container still has no dimensions:', finalRect);
          // Force dimensions
          finalCheck.style.width = '100%';
          finalCheck.style.height = '600px';
          console.log('Forced container dimensions');
        }

        // Convert nodes to jsVectorMap markers format
        // jsVectorMap typically expects [latitude, longitude] format for both coords and latLng
        const allMarkers = nodes.map((node) => ({
          name: node.name,
          coords: [node.coordinates.latitude, node.coordinates.longitude] as [number, number], // [lat, lng]
          latLng: [node.coordinates.latitude, node.coordinates.longitude] as [number, number], // [lat, lng]
        }));

        // Get transit routes from service
        const transitRoutes = this.warRoomService.transitRoutes();
        const lines = transitRoutes.map((route) => ({
          from: route.from,
          to: route.to,
        }));

        // Initialize the map with proper configuration
        const mapConfig: any = {
          selector: '#war-room-map',
          map: 'world',
          zoomButtons: false, // use custom zoom in/out in .map-controls
          backgroundColor: '#ffffff', // White background per mockup
          markers: allMarkers,
          markerStyle: {
            initial: {
              fill: '#00FF41', // Tactical green
              stroke: '#ffffff',
              strokeWidth: 2,
              r: 6,
            },
            hover: {
              fill: '#00FF41',
              stroke: '#ffffff',
              strokeWidth: 2,
              r: 8,
            },
          },
          regionStyle: {
            initial: {
              fill: '#d0d0d0', // Darker for visibility (was #e8e8e8)
              stroke: '#a0a0a0', // Darker stroke (was #d0d0d0)
              strokeWidth: 0.5,
            },
            hover: {
              fill: '#a0a0a0', // Darker hover state
            },
          },
        };

        // Add lines if supported
        if (lines.length > 0) {
          mapConfig.lines = lines;
          mapConfig.lineStyle = {
            stroke: '#00FF41', // Tactical green
            strokeWidth: 3,
            strokeDasharray: '0', // Solid lines
            strokeOpacity: 0.8,
          };
        }

        // Add tooltip handler
        mapConfig.onMarkerTipShow = (event: any, label: any, index: number) => {
          const node = nodes[index];
          if (label && label.html && node) {
            label.html(
              `<div style="font-weight: 600; margin-bottom: 4px;">${node.company}</div><div style="font-size: 12px; color: #6c757d;">${node.city}</div>`
            );
          }
        };

        // Add click handler with zoom functionality
        mapConfig.onMarkerClick = (event: any, index: number) => {
          const node = nodes[index];
          console.log('Marker clicked via jsVectorMap handler:', node);
          this.nodeSelected.emit(node);
        };

        // Add event handlers for zoom/pan to update label positions
        mapConfig.onViewportChange = () => {
          this.updateLabelPositions();
        };

        // Initialize the map
        console.log('Creating jsVectorMap instance with config:', mapConfig);
        console.log('Container element:', finalCheck);
        console.log('Container dimensions:', finalCheck.getBoundingClientRect());

        try {
          this.mapInstance = new window.jsVectorMap(mapConfig);
          console.log('Map instance created successfully:', this.mapInstance);

          setTimeout(() => {
            if (this.destroyed) return;
            this.updateLabelPositions();
            this.startLabelPositionUpdates();
            this.attachMarkerClickHandlers();
            const pending = this.pendingZoomCompanyId;
            this.pendingZoomCompanyId = null;
            if (pending) this.zoomToCompany(pending, 12);
          }, 1000);

          // Listen for fullscreen changes
          this.setupFullscreenListeners();

          // Verify map was created
          if (!this.mapInstance) {
            console.error('Map instance is null after creation');
          } else {
            // Verify SVG was created
            setTimeout(() => {
              const svg = finalCheck.querySelector('svg');
              if (svg) {
                console.log('Map SVG found:', svg);
                console.log('SVG dimensions:', svg.getBoundingClientRect());
                console.log('SVG viewBox:', svg.getAttribute('viewBox'));

                // Fix missing viewBox if needed (common issue)
                if (!svg.getAttribute('viewBox')) {
                  console.warn('SVG missing viewBox, forcing default...');
                  svg.setAttribute('viewBox', '0 0 950 550'); // Standard world map dimensions
                  svg.style.width = '100%';
                  svg.style.height = '100%';
                }

                // Check if SVG has content
                const hasContent = svg.children.length > 0;
                console.log('SVG has content:', hasContent, 'children:', svg.children.length);

                if (!hasContent) {
                  console.warn('SVG exists but has no content - map may not have rendered');
                } else {
                  // Log SVG structure
                  console.log('SVG children:', Array.from(svg.children).map((child: any) => ({
                    tagName: child.tagName,
                    id: child.id,
                    className: child.className,
                  })));
                }
              } else {
                console.error('Map SVG not found - map initialization may have failed');
                // Log container contents for debugging
                console.log('Container innerHTML length:', finalCheck.innerHTML.length);
                console.log('Container children:', Array.from(finalCheck.children).map((child: any) => ({
                  tagName: child.tagName,
                  id: child.id,
                  className: child.className,
                })));
              }

              // Check for regions
              const regions = finalCheck.querySelectorAll('#jvm-regions-group path');
              console.log('Number of region paths found:', regions.length);
              if (regions.length === 0) {
                console.warn('No region paths found - map regions may not have rendered');
              }

              // Check for markers
              const markers = finalCheck.querySelectorAll('.jvm-marker, circle[class*="marker"], circle[data-index]');
              console.log('Number of markers found:', markers.length);
              if (markers.length === 0) {
                console.warn('No markers found - map markers may not have rendered');
              } else {
                console.log('Markers:', Array.from(markers).map((m: any) => ({
                  cx: m.getAttribute('cx'),
                  cy: m.getAttribute('cy'),
                  fill: m.getAttribute('fill'),
                })));
              }
            }, 500);
          }
        } catch (initError) {
          console.error('Error during map initialization:', initError);
          throw initError;
        }

        // If lines need to be added after initialization, use addLines method
        if (this.mapInstance && this.mapInstance.addLines && lines.length > 0) {
          setTimeout(() => {
            try {
              this.mapInstance.addLines(lines.map((line: any) => ({
                ...line,
                style: {
                  stroke: '#00FF41', // Tactical green
                  strokeWidth: 3,
                  strokeDasharray: '0',
                  strokeOpacity: 0.8,
                },
              })));
              console.log('Lines added to map');
            } catch (error) {
              console.warn('Could not add lines via addLines method:', error);
            }
          }, 500);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        console.error('Error details:', error);
      }
    }, 300);
  }

  /**
   * Get node display name
   */
  getNodeDisplayName(node: WarRoomNode): string {
    return `${node.city.toUpperCase()} (${node.hubCode || node.company})`;
  }

  /**
   * Check if node is selected
   */
  isNodeSelected(node: WarRoomNode): boolean {
    const selected = this.selectedCompany();
    return selected?.id === node.companyId;
  }

  /**
   * Check if node is hub
   */
  isHub(node: WarRoomNode): boolean {
    return node.isHub || node.type === 'Hub';
  }

  /**
   * Convert latitude/longitude to pixel coordinates on the map
   * Uses Mercator projection similar to jsVectorMap
   */
  private latLngToPixel(lat: number, lng: number, containerWidth: number, containerHeight: number): { x: number; y: number } {
    // Try to use jsVectorMap's internal coordinate conversion if available
    if (this.mapInstance && this.mapInstance.latLngToPoint) {
      try {
        const point = this.mapInstance.latLngToPoint([lat, lng]);
        return { x: point.x, y: point.y };
      } catch (e) {
        console.warn('Could not use map instance coordinate conversion:', e);
      }
    }

    // Fallback: Manual Mercator projection
    // jsVectorMap typically uses a world map with these dimensions
    const mapWidth = 1000; // Base map width
    const mapHeight = 500; // Base map height

    // Convert longitude to x (0 to 360 degrees, centered at 0)
    const x = ((lng + 180) / 360) * mapWidth;

    // Convert latitude to y using Mercator projection
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = mapHeight / 2 - (mapWidth * mercN) / (2 * Math.PI);

    // Get actual SVG dimensions to account for zoom/pan
    const container = document.getElementById('war-room-map');
    if (container) {
      const svg = container.querySelector('svg');
      if (svg) {
        const svgRect = svg.getBoundingClientRect();
        const viewBox = svg.getAttribute('viewBox');

        if (viewBox) {
          const [vbX, vbY, vbWidth, vbHeight] = viewBox.split(' ').map(Number);
          const scaleX = svgRect.width / vbWidth;
          const scaleY = svgRect.height / vbHeight;

          // Adjust for viewBox offset
          const adjustedX = (x - vbX) * scaleX;
          const adjustedY = (y - vbY) * scaleY;

          return { x: adjustedX, y: adjustedY };
        }
      }
    }

    // Scale to container size (fallback)
    const scaleX = containerWidth / mapWidth;
    const scaleY = containerHeight / mapHeight;

    return {
      x: x * scaleX,
      y: y * scaleY
    };
  }

  /**
   * Update label positions based on current map state
   */
  private updateLabelPositions(): void {
    const container = document.getElementById('war-room-map');
    if (!container || !this.mapInstance) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const nodes = this.nodes();
    const svg = container.querySelector('svg');

    nodes.forEach((node) => {
      // Try to find the actual marker element in the SVG
      let pixelPos: { x: number; y: number } | null = null;

      if (svg) {
        // Look for marker circles or elements with the node's coordinates
        const markers = svg.querySelectorAll('circle.jvm-marker, circle[data-index], .jvm-marker');
        markers.forEach((marker: any, index: number) => {
          if (index < nodes.length && nodes[index].id === node.id) {
            const cx = parseFloat(marker.getAttribute('cx') || '0');
            const cy = parseFloat(marker.getAttribute('cy') || '0');

            // Get SVG transform to account for zoom/pan
            const svgRect = svg.getBoundingClientRect();
            const viewBox = svg.getAttribute('viewBox');

            if (viewBox) {
              const [vbX, vbY, vbWidth, vbHeight] = viewBox.split(' ').map(Number);
              const scaleX = svgRect.width / vbWidth;
              const scaleY = svgRect.height / vbHeight;

              // Convert SVG coordinates to container coordinates
              pixelPos = {
                x: (cx - vbX) * scaleX,
                y: (cy - vbY) * scaleY
              };
            } else {
              // No viewBox, use direct coordinates
              pixelPos = { x: cx, y: cy };
            }
          }
        });
      }

      // Fallback to coordinate conversion if marker not found
      if (!pixelPos) {
        pixelPos = this.latLngToPixel(
          node.coordinates.latitude,
          node.coordinates.longitude,
          rect.width,
          rect.height
        );
      }

      this.labelPositions.set(node.id, pixelPos);
    });
  }

  /**
   * Start updating label positions periodically and on map events
   */
  private startLabelPositionUpdates(): void {
    // Update positions periodically to handle zoom/pan
    this.updateLabelsInterval = setInterval(() => {
      this.updateLabelPositions();
    }, 100);

    // Also try to listen to map events if available
    if (this.mapInstance) {
      // Try to attach event listeners for zoom/pan
      try {
        const container = document.getElementById('war-room-map');
        if (container) {
          const svg = container.querySelector('svg');
          if (svg) {
            // Listen to transform changes on the SVG
            this.labelObserver = new MutationObserver(() => {
              if (!this.destroyed) {
                this.updateLabelPositions();
              }
            });
            this.labelObserver.observe(svg, {
              attributes: true,
              attributeFilter: ['transform', 'viewBox']
            });
          }
        }
      } catch (e) {
        console.warn('Could not set up map event listeners:', e);
      }
    }
  }

  /**
   * Update map markers when nodes change dynamically
   */
  private updateMapMarkers(): void {
    if (this.destroyed || !this.mapInstance) return;
    const container = document.getElementById('war-room-map');
    if (!container) return;
    const nodes = this.nodes();

    const svg = container.querySelector('svg');
    if (!svg) {
      console.warn('SVG not found for marker update');
      return;
    }

    // Get current markers from SVG
    const existingMarkers = svg.querySelectorAll('circle.jvm-marker, circle[data-index]');
    const existingMarkerCount = existingMarkers.length;
    console.log(`Existing markers: ${existingMarkerCount}, New nodes: ${nodes.length}`);

    if (nodes.length !== existingMarkerCount || nodes.length > existingMarkerCount) {
      const sel = this.selectedCompany();
      if (sel?.id) {
        this.pendingZoomCompanyId = sel.id;
      }
      this.initializeMap();
    } else {
      // Just update label positions if markers are already correct
      console.log('Node count unchanged, updating label positions only');
      this.updateLabelPositions();
      this.attachMarkerClickHandlers();
    }
  }

  /**
   * Attach explicit click handlers to SVG markers for better reliability
   * This ensures markers are clickable even if the jsVectorMap onMarkerClick handler fails
   */
  private attachMarkerClickHandlers(): void {
    const container = document.getElementById('war-room-map');
    if (!container) {
      console.warn('Container not found for attaching marker click handlers');
      return;
    }

    const nodes = this.nodes();
    if (nodes.length === 0) {
      console.warn('No nodes available for marker click handlers');
      return;
    }

    // Wait a bit for markers to be fully rendered
    setTimeout(() => {
      const svg = container.querySelector('svg');
      if (!svg) {
        console.warn('SVG not found for attaching marker click handlers');
        return;
      }

      // Find all marker circles in the SVG
      const markers = svg.querySelectorAll('circle.jvm-marker, circle[data-index], circle[class*="jvm-marker"]');
      console.log(`Found ${markers.length} markers to attach click handlers to`);

      markers.forEach((marker: any, index: number) => {
        if (index < nodes.length && !marker.hasAttribute('data-click-handler')) {
          const node = nodes[index];

          // Mark marker as having a click handler to prevent duplicates
          marker.setAttribute('data-click-handler', 'true');

          // Ensure marker is clickable
          marker.style.cursor = 'pointer';
          marker.style.pointerEvents = 'auto';

          // Add click handler
          marker.addEventListener('click', (event: MouseEvent) => {
            event.stopPropagation(); // Prevent event bubbling
            event.preventDefault(); // Prevent default behavior
            console.log(`Marker ${index} clicked directly:`, node);
            this.nodeSelected.emit(node);
          }, true); // Use capture phase for better reliability

          // Also add mousedown as backup
          marker.addEventListener('mousedown', (event: MouseEvent) => {
            event.stopPropagation();
          }, true);

          console.log(`Attached click handler to marker ${index} for node:`, node.city);
        }
      });

      // Also listen for new markers that might be added dynamically
      this.nodeObserver = new MutationObserver(() => {
        if (!this.destroyed) {
          // Re-attach handlers if new markers are added
          const newMarkers = svg.querySelectorAll('circle.jvm-marker:not([data-click-handler]), circle[data-index]:not([data-click-handler])');
          if (newMarkers.length > 0) {
            console.log(`Found ${newMarkers.length} new markers, attaching handlers`);
            this.attachMarkerClickHandlers();
          }
        }
      });

      this.nodeObserver.observe(svg, {
        childList: true,
        subtree: true
      });
    }, 500);
  }

  /**
   * Get node position in pixels for absolute positioning on the map
   */
  getNodePosition(node: WarRoomNode): { top: number; left: number } {
    const position = this.labelPositions.get(node.id);
    if (position) {
      return { top: position.y, left: position.x };
    }

    // Fallback to percentage-based positioning if coordinates not available yet
    const positions: Record<string, { top: number; left: number }> = {
      'winnipeg': { top: 30, left: 15 },
      'indianapolis': { top: 45, left: 25 },
      'st-eustache': { top: 35, left: 35 },
      'las-vegas': { top: 60, left: 20 },
      'paris-ontario': { top: 40, left: 50 },
      'turkey': { top: 55, left: 65 },
      'nanjing': { top: 45, left: 80 },
    };

    const fallback = positions[node.name] || { top: 50, left: 50 };
    // Convert percentage to pixels (approximate)
    const container = document.getElementById('war-room-map');
    if (container) {
      const rect = container.getBoundingClientRect();
      return {
        top: (fallback.top / 100) * rect.height,
        left: (fallback.left / 100) * rect.width
      };
    }

    return { top: 0, left: 0 };
  }

  /**
   * Zoom to a specific location on the map
   * @param latitude - Latitude coordinate
   * @param longitude - Longitude coordinate
   * @param scale - Zoom scale (higher = more zoomed in, typically 1-15)
   *                🔧 ZOOM LEVEL ADJUSTMENT: Change default value (5) here to adjust default zoom
   *                
   *                📊 ZOOM SCALE GUIDE - Try these values:
   *                ============================================
   *                Scale 1  = 1x zoom      (2^0)   - Very wide view, see entire world
   *                Scale 2  = 2x zoom      (2^1)   - Wide view, see continents
   *                Scale 3  = 4x zoom      (2^2)   - Country level view
   *                Scale 4  = 8x zoom      (2^3)   - Regional view
   *                Scale 5  = 16x zoom     (2^4)   - State/Province level (DEFAULT)
   *                Scale 6  = 32x zoom     (2^5)   - Large city area
   *                Scale 7  = 64x zoom     (2^6)   - City level
   *                Scale 8  = 128x zoom    (2^7)   - City district
   *                Scale 9  = 256x zoom    (2^8)   - Neighborhood level
   *                Scale 10 = 512x zoom    (2^9)   - Street level
   *                Scale 11 = 1024x zoom   (2^10)  - Very close street view
   *                Scale 12 = 2048x zoom   (2^11)  - Very high zoom (CURRENT)
   *                Scale 13 = 4096x zoom   (2^12)  - Extreme zoom
   *                Scale 14 = 8192x zoom   (2^13)  - Maximum practical zoom
   *                Scale 15 = 16384x zoom  (2^14)  - Maximum zoom (may be too close)
   *                
   *                💡 RECOMMENDED VALUES:
   *                - For activity log clicks: 10-12 (good balance)
   *                - For marker clicks: 10-12 (shows marker clearly)
   *                - For smooth experience: 8-10 (less jarring)
   *                - For maximum detail: 12-14 (very close)
   */
  zoomToLocation(latitude: number, longitude: number, scale: number = 5): void {
    console.log(`zoomToLocation called: lat=${latitude}, lng=${longitude}, scale=${scale}`);

    if (!this.mapInstance) {
      let retryCount = 0;
      const maxRetries = 25;
      // Clear any existing retry interval
      if (this.mapReadyRetryInterval) {
        clearInterval(this.mapReadyRetryInterval);
      }
      this.mapReadyRetryInterval = setInterval(() => {
        retryCount++;
        if (this.mapInstance) {
          clearInterval(this.mapReadyRetryInterval!);
          this.mapReadyRetryInterval = null;
          this.zoomToLocation(latitude, longitude, scale);
        } else if (retryCount >= maxRetries) {
          clearInterval(this.mapReadyRetryInterval!);
          this.mapReadyRetryInterval = null;
        }
      }, 200);
      return;
    }

    try {
      // jsVectorMap API methods - try multiple approaches
      // Method 1: Try setFocus (most common)
      if (typeof this.mapInstance.setFocus === 'function') {
        console.log('Using setFocus method');
        this.mapInstance.setFocus({
          animate: true,
          lat: latitude,
          lng: longitude,
          scale: scale,
        });
        console.log(`✓ Zoomed to location: ${latitude}, ${longitude} at scale ${scale}`);
        setTimeout(() => this.updateLabelPositions(), 500);
        return;
      }

      // Method 2: Try focusOn
      if (typeof this.mapInstance.focusOn === 'function') {
        console.log('Using focusOn method');
        this.mapInstance.focusOn({
          animate: true,
          latLng: [latitude, longitude],
          scale: scale,
        });
        console.log(`✓ Zoomed to location using focusOn: ${latitude}, ${longitude} at scale ${scale}`);
        setTimeout(() => this.updateLabelPositions(), 500);
        return;
      }

      // Method 3: Try setCenter + setZoom
      if (typeof this.mapInstance.setCenter === 'function') {
        console.log('Using setCenter + setZoom method');
        this.mapInstance.setCenter(latitude, longitude);
        if (typeof this.mapInstance.setZoom === 'function') {
          this.mapInstance.setZoom(scale);
        }
        console.log(`✓ Zoomed to location using setCenter: ${latitude}, ${longitude}`);
        setTimeout(() => this.updateLabelPositions(), 500);
        return;
      }

      // Method 4: Try internal map object and transform methods
      const mapInternal = (this.mapInstance as any).map;
      if (mapInternal) {
        if (typeof mapInternal.setFocus === 'function') {
          console.log('Using internal map.setFocus');
          mapInternal.setFocus({
            animate: true,
            lat: latitude,
            lng: longitude,
            scale: scale,
          });
          setTimeout(() => this.updateLabelPositions(), 500);
          return;
        }
        if (typeof mapInternal.focusOn === 'function') {
          console.log('Using internal map.focusOn');
          mapInternal.focusOn({
            animate: true,
            latLng: [latitude, longitude],
            scale: scale,
          });
          setTimeout(() => this.updateLabelPositions(), 500);
          return;
        }
        // Try transform methods if available
        if (mapInternal.setScale && mapInternal.setFocus) {
          console.log('Using internal map.setScale and setFocus');
          mapInternal.setFocus(latitude, longitude);
          mapInternal.setScale(scale);
          setTimeout(() => this.updateLabelPositions(), 500);
          return;
        }
      }

      // Method 4.5: Try accessing SVG transform directly via map instance
      const container = document.getElementById('war-room-map');
      if (container) {
        const svg = container.querySelector('svg');
        const mapGroup = svg?.querySelector('g#jvm-regions-group, g[class*="regions"]');
        if (mapGroup && this.mapInstance) {
          // Try to get current transform and modify it
          const currentTransform = mapGroup.getAttribute('transform');
          console.log('Current map transform:', currentTransform);
          // If we can manipulate transform, we can pan and scale
        }
      }

      // Method 5: Direct viewBox manipulation as fallback - find marker and center on it
      console.warn('No standard zoom method available, trying viewBox manipulation with marker position');
      // Reuse container variable from Method 4.5 above
      if (container) {
        const svg = container.querySelector('svg');
        if (svg) {
          // Get current viewBox
          const currentViewBox = svg.viewBox.baseVal;
          const currentWidth = currentViewBox.width || 950;
          const currentHeight = currentViewBox.height || 550;

          // Find the marker for this location by checking all markers
          const nodes = this.nodes();
          const targetNode = nodes.find(n =>
            Math.abs(n.coordinates.latitude - latitude) < 0.1 &&
            Math.abs(n.coordinates.longitude - longitude) < 0.1
          );

          if (targetNode) {
            // Find the marker element in the SVG
            const markers = svg.querySelectorAll('circle.jvm-marker, circle[data-index]');
            const nodeIndex = nodes.findIndex(n => n.id === targetNode.id);
            const marker = markers[nodeIndex] as SVGCircleElement;

            if (marker) {
              // Get marker's current position in SVG coordinates
              const markerX = parseFloat(marker.getAttribute('cx') || '0');
              const markerY = parseFloat(marker.getAttribute('cy') || '0');

              // Calculate zoom factor (scale 12 = very high zoom, scale 1 = low zoom)
              // 🔧 ZOOM LEVEL ADJUSTMENT: The zoom factor is calculated as 2^(scale-1)
              // See zoomToLocation() method documentation above for full zoom scale guide
              const zoomFactor = Math.pow(2, scale - 1);
              const newWidth = currentWidth / zoomFactor;
              const newHeight = currentHeight / zoomFactor;

              // Center viewBox on marker
              const newX = Math.max(0, Math.min(currentWidth - newWidth, markerX - newWidth / 2));
              const newY = Math.max(0, Math.min(currentHeight - newHeight, markerY - newHeight / 2));

              // Apply smooth transition
              svg.style.transition = 'viewBox 0.5s ease-in-out';
              svg.setAttribute('viewBox', `${newX} ${newY} ${newWidth} ${newHeight}`);
              console.log(`✓ Zoomed using viewBox manipulation to marker at (${markerX}, ${markerY}): ${latitude}, ${longitude}`);
              setTimeout(() => {
                this.updateLabelPositions();
                svg.style.transition = ''; // Remove transition after animation
              }, 500);
              return;
            }
          }

          // Fallback: Use Mercator projection calculation
          console.log('Marker not found, using Mercator projection calculation');
          const viewBoxWidth = currentWidth;
          const viewBoxHeight = currentHeight;
          // Convert lat/lng to SVG coordinates using Mercator projection approximation
          const centerX = ((longitude + 180) / 360) * viewBoxWidth;
          const centerY = ((90 - latitude) / 180) * viewBoxHeight;
          const zoomFactor = Math.pow(2, scale - 1);
          const newWidth = viewBoxWidth / zoomFactor;
          const newHeight = viewBoxHeight / zoomFactor;
          const newX = Math.max(0, Math.min(viewBoxWidth - newWidth, centerX - newWidth / 2));
          const newY = Math.max(0, Math.min(viewBoxHeight - newHeight, centerY - newHeight / 2));

          svg.style.transition = 'viewBox 0.5s ease-in-out';
          svg.setAttribute('viewBox', `${newX} ${newY} ${newWidth} ${newHeight}`);
          console.log(`✓ Zoomed using Mercator projection: ${latitude}, ${longitude}`);
          setTimeout(() => {
            this.updateLabelPositions();
            svg.style.transition = '';
          }, 500);
          return;
        }
      }

      console.error('No zoom method found on map instance and viewBox fallback failed');
    } catch (error) {
      console.error('Error zooming to location:', error);
      // Try alternative approach with direct coordinate manipulation
      try {
        const container = document.getElementById('war-room-map');
        if (container) {
          const svg = container.querySelector('svg');
          if (svg && svg.viewBox) {
            // This is a fallback - might not work perfectly but worth trying
            console.warn('Attempting fallback zoom method');
          }
        }
      } catch (fallbackError) {
        console.error('Fallback zoom method also failed:', fallbackError);
      }
    }
  }

  /**
   * Zoom to a specific node by node ID
   * @param nodeId - The ID of the node to zoom to
   */
  zoomToNode(nodeId: string): void {
    const nodes = this.nodes();
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      this.zoomToLocation(node.coordinates.latitude, node.coordinates.longitude, 4);
    } else {
      console.warn(`Node with ID ${nodeId} not found`);
    }
  }

  /**
   * Zoom to a specific company's location
   * @param companyId - The company ID to zoom to
   * @param zoomScale - Optional zoom scale (default: 12 for more prominent zoom to show marker clearly)
   *                    🔧 ZOOM LEVEL ADJUSTMENT: Change default value here to adjust default zoom
   *                    Higher number = more zoom (e.g., 10 = medium, 12 = high, 15 = very high)
   */
  zoomToCompany(companyId: string, zoomScale: number = 12): void {
    const nodes = this.nodes();

    if (nodes.length === 0) {
      this.pendingZoomCompanyId = companyId;
      return;
    }

    if (!this.mapInstance) {
      this.pendingZoomCompanyId = companyId;
      return;
    }

    const node = nodes.find((n) => n.companyId === companyId);
    if (node) {
      this.zoomToLocation(node.coordinates.latitude, node.coordinates.longitude, zoomScale);
      setTimeout(() => this.highlightMarker(node.id), 600);
    } else {
      this.pendingZoomCompanyId = companyId;
    }
  }

  /**
   * Highlight a marker by node ID
   * @param nodeId - The node ID to highlight
   */
  private highlightMarker(nodeId: string): void {
    const container = document.getElementById('war-room-map');
    if (!container) return;

    const svg = container.querySelector('svg');
    if (!svg) return;

    // Find the marker for this node
    const nodes = this.nodes();
    const nodeIndex = nodes.findIndex((n) => n.id === nodeId);
    if (nodeIndex === -1) {
      console.warn(`Node ${nodeId} not found for highlighting`);
      return;
    }

    const markers = svg.querySelectorAll('circle.jvm-marker, circle[data-index]');
    const marker = markers[nodeIndex] as SVGCircleElement;

    if (marker) {
      // Store original radius
      const originalRadius = marker.getAttribute('r') || '8';

      // Add a pulsing animation or highlight effect
      marker.style.transition = 'all 0.3s ease';
      marker.setAttribute('r', '14'); // Make it larger temporarily
      marker.setAttribute('stroke-width', '4'); // Thicker stroke
      marker.setAttribute('stroke', '#02270B'); // Dark green stroke to match selected border

      // Reset after animation
      setTimeout(() => {
        marker.setAttribute('r', originalRadius);
        marker.setAttribute('stroke-width', '2');
        marker.setAttribute('stroke', '#ffffff');
      }, 1500);

      console.log(`Highlighted marker for node: ${nodeId}`);
    } else {
      console.warn(`Marker not found for node index ${nodeIndex}`);
    }
  }

  /**
   * Toggle fullscreen mode for the map
   */
  toggleFullscreen(): void {
    const mapContainer = document.getElementById('war-room-map');
    if (!mapContainer) return;

    if (!this.isFullscreen) {
      this.enterFullscreen(mapContainer);
    } else {
      this.exitFullscreen();
    }
  }

  /**
   * Enter fullscreen mode
   */
  private enterFullscreen(element: HTMLElement): void {
    // Try to enter fullscreen on the map container instead of just the map div
    const mapContainer = element.closest('.war-room-map-container') as HTMLElement;
    const targetElement = mapContainer || element;

    if (targetElement.requestFullscreen) {
      targetElement.requestFullscreen().then(() => {
        this.isFullscreen = true;
        // Force container to fill screen
        targetElement.style.width = '100vw';
        targetElement.style.height = '100vh';
        targetElement.style.minHeight = '100vh';
        targetElement.style.maxHeight = '100vh';
        targetElement.style.backgroundColor = '#ffffff';

        // Resize map after entering fullscreen
        setTimeout(() => {
          if (this.mapInstance && this.mapInstance.updateSize) {
            this.mapInstance.updateSize();
          }
          this.updateLabelPositions();
        }, 300);
      }).catch((err) => {
        console.error('Error entering fullscreen:', err);
      });
    } else if ((targetElement as any).webkitRequestFullscreen) {
      // Safari
      (targetElement as any).webkitRequestFullscreen();
      this.isFullscreen = true;
      targetElement.style.width = '100vw';
      targetElement.style.height = '100vh';
      targetElement.style.minHeight = '100vh';
      targetElement.style.maxHeight = '100vh';
      targetElement.style.backgroundColor = '#ffffff';
      setTimeout(() => {
        if (this.mapInstance && this.mapInstance.updateSize) {
          this.mapInstance.updateSize();
        }
        this.updateLabelPositions();
      }, 300);
    } else if ((targetElement as any).msRequestFullscreen) {
      // IE/Edge
      (targetElement as any).msRequestFullscreen();
      this.isFullscreen = true;
      targetElement.style.width = '100vw';
      targetElement.style.height = '100vh';
      targetElement.style.minHeight = '100vh';
      targetElement.style.maxHeight = '100vh';
      targetElement.style.backgroundColor = '#ffffff';
      setTimeout(() => {
        if (this.mapInstance && this.mapInstance.updateSize) {
          this.mapInstance.updateSize();
        }
        this.updateLabelPositions();
      }, 300);
    }
  }

  /**
   * Exit fullscreen mode
   */
  private exitFullscreen(): void {
    const mapContainer = document.querySelector('.war-room-map-container') as HTMLElement;

    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        this.isFullscreen = false;
        // Reset container styles
        if (mapContainer) {
          mapContainer.style.width = '';
          mapContainer.style.height = '';
          mapContainer.style.minHeight = '';
          mapContainer.style.maxHeight = '';
        }
        // Resize map after exiting fullscreen
        setTimeout(() => {
          if (this.mapInstance && this.mapInstance.updateSize) {
            this.mapInstance.updateSize();
          }
          this.updateLabelPositions();
        }, 300);
      }).catch((err) => {
        console.error('Error exiting fullscreen:', err);
      });
    } else if ((document as any).webkitExitFullscreen) {
      // Safari
      (document as any).webkitExitFullscreen();
      this.isFullscreen = false;
      if (mapContainer) {
        mapContainer.style.width = '';
        mapContainer.style.height = '';
        mapContainer.style.minHeight = '';
        mapContainer.style.maxHeight = '';
      }
      setTimeout(() => {
        if (this.mapInstance && this.mapInstance.updateSize) {
          this.mapInstance.updateSize();
        }
        this.updateLabelPositions();
      }, 300);
    } else if ((document as any).msExitFullscreen) {
      // IE/Edge
      (document as any).msExitFullscreen();
      this.isFullscreen = false;
      if (mapContainer) {
        mapContainer.style.width = '';
        mapContainer.style.height = '';
        mapContainer.style.minHeight = '';
        mapContainer.style.maxHeight = '';
      }
      setTimeout(() => {
        if (this.mapInstance && this.mapInstance.updateSize) {
          this.mapInstance.updateSize();
        }
        this.updateLabelPositions();
      }, 300);
    }
  }

  /**
   * Check if currently in fullscreen mode
   */
  getFullscreenState(): boolean {
    return this.isFullscreen || !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement
    );
  }

  /**
   * Zoom the map in one step (custom control).
   */
  zoomIn(): void {
    if (!this.mapInstance) return;
    if (typeof (this.mapInstance as any).zoomIn === 'function') {
      (this.mapInstance as any).zoomIn();
      setTimeout(() => this.updateLabelPositions(), 300);
      return;
    }
    this.zoomByWheel(-1);
  }

  /**
   * Zoom the map out one step (custom control).
   */
  zoomOut(): void {
    if (!this.mapInstance) return;
    if (typeof (this.mapInstance as any).zoomOut === 'function') {
      (this.mapInstance as any).zoomOut();
      setTimeout(() => this.updateLabelPositions(), 300);
      return;
    }
    this.zoomByWheel(1);
  }

  /**
   * Fallback: trigger wheel zoom on the map container when zoomIn/zoomOut API is not available.
   */
  private zoomByWheel(direction: -1 | 1): void {
    const el = document.getElementById('war-room-map');
    if (!el) return;
    const delta = 120 * direction; // negative = zoom in, positive = zoom out
    el.dispatchEvent(new WheelEvent('wheel', { deltaY: delta, bubbles: true }));
    setTimeout(() => this.updateLabelPositions(), 300);
  }

  /**
   * Reposition zoom buttons to avoid overlap with SHOW METRICS button
   * This method directly sets inline styles to override library defaults
   */
  private repositionZoomButtons(): void {
    const container = document.getElementById('war-room-map');
    if (!container) return;

    // Find the zoom container element
    const zoomContainer = container.querySelector('.jvm-zoom-container') as HTMLElement;
    if (zoomContainer) {
      // Set position directly via inline styles to override library defaults
      // Top-right, grouped with fullscreen (top: 6px, right: 0.5rem)
      zoomContainer.style.position = 'absolute';
      zoomContainer.style.top = '6px';
      zoomContainer.style.bottom = 'auto';
      zoomContainer.style.right = '0.5rem';
      zoomContainer.style.left = 'auto';
      zoomContainer.style.display = 'flex';
      zoomContainer.style.flexDirection = 'column';
      zoomContainer.style.gap = '0.25rem';
      zoomContainer.style.zIndex = '40';
      console.log('Zoom buttons repositioned to top-right');
    } else {
      // Retry if element not found yet
      setTimeout(() => this.repositionZoomButtons(), 500);
    }
  }

  /**
   * Setup fullscreen change listeners
   */
  private setupFullscreenListeners(): void {
    const fullscreenChangeEvents = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'msfullscreenchange'
    ];

    // Create bound handler
    this.boundFullscreenHandler = () => {
      if (this.destroyed) return;
      
      const wasFullscreen = this.isFullscreen;
      this.isFullscreen = this.getFullscreenState();
      const mapContainer = document.querySelector('.war-room-map-container') as HTMLElement;
      const mapDiv = document.getElementById('war-room-map');
      const mapContainerDiv = document.querySelector('.map-container') as HTMLElement;

      if (this.isFullscreen && !wasFullscreen) {
        // Entering fullscreen - ensure container fills screen
        if (mapContainer) {
          mapContainer.style.width = '100vw';
          mapContainer.style.height = '100vh';
          mapContainer.style.minHeight = '100vh';
          mapContainer.style.maxHeight = '100vh';
          mapContainer.style.backgroundColor = '#ffffff';
          mapContainer.style.position = 'fixed';
          mapContainer.style.top = '0';
          mapContainer.style.left = '0';
          mapContainer.style.right = '0';
          mapContainer.style.bottom = '0';
        }

        if (mapContainerDiv) {
          mapContainerDiv.style.width = '100%';
          mapContainerDiv.style.height = '100%';
          mapContainerDiv.style.minHeight = '100vh';
          mapContainerDiv.style.maxHeight = '100vh';
          mapContainerDiv.style.backgroundColor = '#ffffff';
        }

        if (mapDiv) {
          mapDiv.style.width = '100%';
          mapDiv.style.height = '100%';
          mapDiv.style.minHeight = '100vh';
          mapDiv.style.maxHeight = '100vh';
          mapDiv.style.backgroundColor = '#ffffff';
        }

        // Ensure body/html don't have black background
        document.body.style.backgroundColor = '#ffffff';
        document.documentElement.style.backgroundColor = '#ffffff';
      } else if (!this.isFullscreen && wasFullscreen) {
        // Exiting fullscreen - reset styles
        if (mapContainer) {
          mapContainer.style.width = '';
          mapContainer.style.height = '';
          mapContainer.style.minHeight = '';
          mapContainer.style.maxHeight = '';
          mapContainer.style.position = '';
          mapContainer.style.top = '';
          mapContainer.style.left = '';
          mapContainer.style.right = '';
          mapContainer.style.bottom = '';
        }

        if (mapContainerDiv) {
          mapContainerDiv.style.width = '';
          mapContainerDiv.style.height = '';
          mapContainerDiv.style.minHeight = '';
          mapContainerDiv.style.maxHeight = '';
        }

        if (mapDiv) {
          mapDiv.style.width = '';
          mapDiv.style.height = '';
          mapDiv.style.minHeight = '';
          mapDiv.style.maxHeight = '';
        }

        // Reset body/html background
        document.body.style.backgroundColor = '';
        document.documentElement.style.backgroundColor = '';
      }

      // Resize map when fullscreen state changes
      setTimeout(() => {
        if (!this.destroyed && this.mapInstance && this.mapInstance.updateSize) {
          this.mapInstance.updateSize();
        }
        if (!this.destroyed) {
          this.updateLabelPositions();
        }
      }, 300);
    };

    // Add listeners with bound handler
    fullscreenChangeEvents.forEach((eventName) => {
      document.addEventListener(eventName, this.boundFullscreenHandler!);
    });
  }
}
