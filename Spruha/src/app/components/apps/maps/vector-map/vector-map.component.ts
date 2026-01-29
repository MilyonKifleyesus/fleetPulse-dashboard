import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

declare global {
  interface Window {
    jsVectorMap: any;
  }
}

interface LocationMarker {
  name: string;
  latLng: [number, number];
  company: string;
  city: string;
}

@Component({
  selector: 'app-vector-map',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './vector-map.component.html',
  styleUrl: './vector-map.component.scss',
})
export class VectorMapComponent implements AfterViewInit, OnDestroy {
  private mapInstance: any = null;
  private scriptsLoaded = false;

  // Central hub location
  private readonly centralHub: LocationMarker = {
    name: 'toronto',
    latLng: [43.6532, -79.3832],
    company: 'Bus Pulse',
    city: 'Toronto',
  };

  // All fleet locations
  private readonly locations: LocationMarker[] = [
    {
      name: 'indianapolis',
      latLng: [39.7684, -86.1581],
      company: 'ARBOC',
      city: 'Indianapolis',
    },
    {
      name: 'winnipeg',
      latLng: [49.8951, -97.1384],
      company: 'NFL',
      city: 'Winnipeg',
    },
    {
      name: 'st-eustache',
      latLng: [45.5650, -73.9050],
      company: 'Nova',
      city: 'St. Eustache',
    },
    {
      name: 'las-vegas',
      latLng: [36.1699, -115.1398],
      company: 'Alexander Dennis',
      city: 'Las Vegas',
    },
    {
      name: 'nanjing',
      latLng: [32.0603, 118.7969],
      company: 'TAM',
      city: 'Nanjing, China',
    },
    {
      name: 'paris-ontario',
      latLng: [43.2000, -80.3833],
      company: 'Creative Carriage',
      city: 'Paris, Ontario',
    },
    {
      name: 'turkey',
      latLng: [39.9334, 32.8597],
      company: 'Karsan',
      city: 'Turkey',
    },
  ];

  ngAfterViewInit(): void {
    this.loadScripts().then(() => {
      this.initializeMap();
    });
  }

  ngOnDestroy(): void {
    if (this.mapInstance) {
      // Clean up map instance if needed
      this.mapInstance = null;
    }
  }

  private loadScripts(): Promise<void> {
    // Check if scripts are already loaded (via angular.json)
    if (this.scriptsLoaded || (window as any).jsVectorMap) {
      this.scriptsLoaded = true;
      // Wait a bit for world map data to be available
      return new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Fallback: dynamically load scripts if not loaded via angular.json
    return new Promise((resolve, reject) => {
      // Load jsVectorMap library
      const script1 = document.createElement('script');
      script1.src = './assets/libs/jsvectormap/js/jsvectormap.min.js';
      script1.onload = () => {
        // Load world map data
        const script2 = document.createElement('script');
        script2.src = './assets/libs/jsvectormap/maps/world.js';
        script2.onload = () => {
          this.scriptsLoaded = true;
          resolve();
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

    // Wait a bit for the library to be fully ready
    setTimeout(() => {
      try {
        // Get all markers including central hub
        // jsVectorMap uses 'coords' or 'latLng' for coordinates
        const allMarkers = [
          {
            name: this.centralHub.name,
            coords: this.centralHub.latLng,
            latLng: this.centralHub.latLng,
          },
          ...this.locations.map((loc) => ({
            name: loc.name,
            coords: loc.latLng,
            latLng: loc.latLng,
          })),
        ];

        // Create lines connecting all locations to Toronto
        const lines = this.locations.map((loc) => ({
          from: this.centralHub.name,
          to: loc.name,
        }));

        // Initialize the map with proper configuration
        const mapConfig: any = {
          selector: '#lines-map',
          map: 'world',
          zoomButtons: true,
          backgroundColor: '#2d3748',
          markers: allMarkers,
          markerStyle: {
            initial: {
              fill: '#6259ca',
              stroke: '#ffffff',
              strokeWidth: 2,
              r: 6,
            },
            hover: {
              fill: '#6259ca',
              stroke: '#ffffff',
              strokeWidth: 2,
              r: 8,
            },
          },
          regionStyle: {
            initial: {
              fill: '#4a5568',
              stroke: '#2d3748',
              strokeWidth: 0.5,
            },
            hover: {
              fill: '#718096',
            },
          },
        };

        // Add lines if supported
        if (lines.length > 0) {
          mapConfig.lines = lines;
          mapConfig.lineStyle = {
            stroke: '#cbd5e0',
            strokeWidth: 2.5,
            strokeDasharray: '5,5',
            strokeOpacity: 0.8,
          };
        }

        // Add tooltip handler
        mapConfig.onMarkerTipShow = (event: any, label: any, index: number) => {
          const marker = index === 0 ? this.centralHub : this.locations[index - 1];
          if (label && label.html) {
            label.html(
              `<div style="font-weight: 600; margin-bottom: 4px;">${marker.company}</div><div style="font-size: 12px; color: #6c757d;">${marker.city}</div>`
            );
          }
        };

        // Initialize the map
        this.mapInstance = new window.jsVectorMap(mapConfig);

        // If lines need to be added after initialization, use addLines method
        if (this.mapInstance && this.mapInstance.addLines && lines.length > 0) {
          setTimeout(() => {
            try {
              this.mapInstance.addLines(lines.map((line: any) => ({
                ...line,
                style: {
                  stroke: '#cbd5e0',
                  strokeWidth: 2.5,
                  strokeDasharray: '5,5',
                  strokeOpacity: 0.8,
                },
              })));
            } catch (error) {
              console.warn('Could not add lines via addLines method:', error);
            }
          }, 200);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }, 100);
  }
}
