import { Component, OnInit, OnDestroy, signal, inject, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarRoomService } from '../../../shared/services/war-room.service';
import { WarRoomRealtimeService } from '../../../shared/services/war-room-realtime.service';
import { Node } from '../../../shared/models/war-room.interface';
import { WarRoomHeaderComponent } from './components/war-room-header/war-room-header.component';
import { WarRoomMapComponent } from './components/war-room-map/war-room-map.component';
import { WarRoomMetricsComponent } from './components/war-room-metrics/war-room-metrics.component';
import { WarRoomActivityLogComponent } from './components/war-room-activity-log/war-room-activity-log.component';
import { WarRoomHubStatusComponent } from './components/war-room-hub-status/war-room-hub-status.component';
import { WarRoomFooterComponent } from './components/war-room-footer/war-room-footer.component';

@Component({
  selector: 'app-war-room',
  imports: [
    CommonModule,
    WarRoomHeaderComponent,
    WarRoomMapComponent,
    WarRoomMetricsComponent,
    WarRoomActivityLogComponent,
    WarRoomHubStatusComponent,
    WarRoomFooterComponent,
  ],
  templateUrl: './war-room.component.html',
  styleUrl: './war-room.component.scss',
})
export class WarRoomComponent implements OnInit, OnDestroy {
  // Inject services
  private warRoomService = inject(WarRoomService);
  private realtimeService = inject(WarRoomRealtimeService);

  // Signals from service
  readonly nodes = this.warRoomService.nodes;
  readonly activityLogs = this.warRoomService.activityLogs;
  readonly networkMetrics = this.warRoomService.networkMetrics;
  readonly networkThroughput = this.warRoomService.networkThroughput;
  readonly geopoliticalHeatmap = this.warRoomService.geopoliticalHeatmap;
  readonly satelliteStatuses = this.warRoomService.satelliteStatuses;
  readonly selectedCompany = this.warRoomService.selectedCompany;

  // Current time for display
  readonly currentTime = signal<Date>(new Date());

  // Metrics panel visibility - hidden by default
  readonly metricsPanelVisible = signal<boolean>(false);

  // Top metrics visibility - hidden by default
  readonly topMetricsVisible = signal<boolean>(false);

  // Activity log visibility - hidden by default
  readonly activityLogVisible = signal<boolean>(false);

  // Hub status visibility - hidden by default
  readonly hubStatusVisible = signal<boolean>(false);

  // ViewChild reference to map component
  readonly mapComponent = viewChild.required(WarRoomMapComponent);
  
  // Timeout for zoom effect
  private zoomTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const selectedCompany = this.selectedCompany();
      const map = this.mapComponent();
      // Clear any existing timeout
      if (this.zoomTimeoutId) {
        clearTimeout(this.zoomTimeoutId);
      }
      if (selectedCompany && map) {
        this.zoomTimeoutId = setTimeout(() => {
          map.zoomToCompany(selectedCompany.id);
          this.zoomTimeoutId = null;
        }, 100);
      }
      // Cleanup function for effect
      return () => {
        if (this.zoomTimeoutId) {
          clearTimeout(this.zoomTimeoutId);
          this.zoomTimeoutId = null;
        }
      };
    });
  }

  // Time interval for clock updates
  private timeIntervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    // Start real-time updates
    this.realtimeService.startRealTimeUpdates();

    // Update time every second
    this.timeIntervalId = setInterval(() => {
      this.currentTime.set(new Date());
    }, 1000);
  }

  ngOnDestroy(): void {
    // Stop real-time updates
    this.realtimeService.stopRealTimeUpdates();

    // Clear time interval
    if (this.timeIntervalId) {
      clearInterval(this.timeIntervalId);
      this.timeIntervalId = null;
    }
    
    // Clear zoom timeout
    if (this.zoomTimeoutId) {
      clearTimeout(this.zoomTimeoutId);
      this.zoomTimeoutId = null;
    }
  }

  /**
   * Format time as ZULU TIME
   */
  formatZuluTime(): string {
    const date = this.currentTime();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  /**
   * Handle company selection from activity log
   */
  onCompanySelected(companyId: string): void {
    this.warRoomService.selectCompany(companyId);

    // Show metrics panel and activity log when clicking activity log
    this.showMetricsPanel();
    this.activityLogVisible.set(true);

    // Zoom is handled by the effect() when selectedCompany changes
    // This prevents double-zooming and race conditions
  }


  /**
   * Toggle metrics panel visibility (for button click)
   */
  toggleMetricsPanel(): void {
    this.metricsPanelVisible.update(visible => !visible);
  }

  /**
   * Show metrics panel (for activity log click)
   */
  showMetricsPanel(): void {
    this.metricsPanelVisible.set(true);
  }

  /**
   * Toggle activity log visibility
   */
  toggleActivityLog(): void {
    this.activityLogVisible.update(visible => !visible);
  }

  /**
   * Toggle hub status visibility
   */
  toggleHubStatus(): void {
    this.hubStatusVisible.update(visible => !visible);
  }

  /**
   * Toggle top metrics visibility
   */
  toggleTopMetrics(): void {
    this.topMetricsVisible.update(visible => !visible);
  }

  /**
   * Handle node selection from map
   */
  onNodeSelected(node: Node): void {
    this.warRoomService.selectCompany(node.companyId);
  }

  /**
   * Get data flow integrity status text
   */
  getDataFlowIntegrityStatus(value: number): string {
    if (value > 90) return 'OPTIMAL';
    if (value >= 70) return 'WARNING';
    return 'CRITICAL';
  }

  /**
   * Get data flow integrity CSS class
   */
  getDataFlowIntegrityClass(value: number): string {
    if (value > 90) return 'tactical-green';
    if (value >= 70) return 'tactical-amber';
    return 'tactical-red';
  }
}
