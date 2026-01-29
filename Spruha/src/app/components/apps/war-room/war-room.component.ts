import { Component, OnInit, OnDestroy, signal, inject, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarRoomService } from '../../../shared/services/war-room.service';
import { WarRoomRealtimeService } from '../../../shared/services/war-room-realtime.service';
import { Node, CompanyData, ActivityLog } from '../../../shared/models/war-room.interface';
import { WarRoomMapComponent } from './components/war-room-map/war-room-map.component';
import { WarRoomActivityLogComponent } from './components/war-room-activity-log/war-room-activity-log.component';
import { WarRoomHubStatusComponent } from './components/war-room-hub-status/war-room-hub-status.component';
import { AddCompanyModalComponent, CompanyFormData } from './components/add-company-modal/add-company-modal.component';

@Component({
  selector: 'app-war-room',
  imports: [
    CommonModule,
    WarRoomMapComponent,
    WarRoomActivityLogComponent,
    WarRoomHubStatusComponent,
    AddCompanyModalComponent,
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
  readonly selectedCompany = this.warRoomService.selectedCompany;

  // Activity log visibility - hidden by default
  readonly activityLogVisible = signal<boolean>(false);

  // Hub status visibility - hidden by default
  readonly hubStatusVisible = signal<boolean>(false);

  // Add company modal (over map)
  readonly addCompanyModalVisible = signal<boolean>(false);

  // ViewChild reference to map component
  readonly mapComponent = viewChild.required(WarRoomMapComponent);

  readonly addCompanyModalRef = viewChild<AddCompanyModalComponent>('addCompanyModalRef');

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

  ngOnInit(): void {
    // Start real-time updates
    this.realtimeService.startRealTimeUpdates();
  }

  ngOnDestroy(): void {
    // Stop real-time updates
    this.realtimeService.stopRealTimeUpdates();

    // Clear zoom timeout
    if (this.zoomTimeoutId) {
      clearTimeout(this.zoomTimeoutId);
      this.zoomTimeoutId = null;
    }
  }

  /**
   * Handle company selection from activity log
   */
  onCompanySelected(companyId: string): void {
    this.warRoomService.selectCompany(companyId);

    // Show activity log when clicking activity log
    this.activityLogVisible.set(true);

    // Zoom is handled by the effect() when selectedCompany changes
    // This prevents double-zooming and race conditions
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
   * Handle node selection from map
   */
  onNodeSelected(node: Node | undefined): void {
    if (node) {
      this.onCompanySelected(node.companyId);
    } else {
      this.warRoomService.selectCompany(null);
    }
  }

  onAddCompanyRequested(): void {
    this.addCompanyModalVisible.set(true);
    this.hubStatusVisible.set(true);
  }

  onAddCompanyModalClose(): void {
    this.addCompanyModalVisible.set(false);
  }

  async onCompanyAdded(formData: CompanyFormData): Promise<void> {
    if (!formData.companyName?.trim() || !formData.location?.trim()) {
      throw new Error('Company name and location are required');
    }
    const locationData = await this.warRoomService.parseLocationInput(formData.location);
    if (!locationData || locationData.latitude == null || locationData.longitude == null ||
      typeof locationData.latitude !== 'number' || typeof locationData.longitude !== 'number') {
      throw new Error('Location coordinates are required. Please provide valid coordinates or a location that can be geocoded.');
    }
    const companyId = this.warRoomService.generateCompanyId(formData.companyName);
    const nodeId = this.warRoomService.generateNodeId(formData.companyName);
    const locationParts = formData.location.split(',').map((p) => p.trim());
    const city = locationParts.length > 1 ? locationParts[0] : formData.location.trim();
    const fullLocation = formData.location.trim();
    const hubCode = this.generateHubCode(formData.companyName);
    const logoValue = typeof formData.logo === 'string' ? formData.logo : undefined;
    const newNode: Node = {
      id: nodeId,
      name: city.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      company: formData.companyName.toUpperCase(),
      companyId,
      city: city || 'Unknown',
      description: formData.description?.trim() || undefined,
      logo: logoValue,
      coordinates: { latitude: locationData.latitude, longitude: locationData.longitude },
      type: 'Facility',
      status: 'ONLINE',
      isHub: true,
      hubCode,
    };
    this.warRoomService.addNode(newNode);
    const existing = this.warRoomService.getCompanyData(companyId);
    if (!existing) {
      const newCompany: CompanyData = {
        id: companyId,
        name: formData.companyName.toUpperCase(),
        hubs: [{
          id: `hub-${companyId}-${Date.now()}`,
          code: hubCode,
          companyId,
          companyName: formData.companyName.toUpperCase(),
          status: 'ONLINE',
          capacity: '100% CAP',
          capacityPercentage: 100,
          statusColor: 'text-tactical-green',
          capColor: 'text-tactical-green',
        }],
        quantumChart: { dataPoints: [85, 88, 90, 92, 89, 91], highlightedIndex: 3 },
      };
      this.warRoomService.addCompany(newCompany);
    }
    const activityLog: ActivityLog = {
      id: `log-${nodeId}`,
      timestamp: new Date(),
      company: formData.companyName.toUpperCase(),
      companyId,
      status: 'ACTIVE',
      title: `${formData.companyName.toUpperCase()} | ${fullLocation.toUpperCase()}`,
      description: formData.description?.trim() || 'SYSTEM REGISTERED // NODE INITIALIZED',
      location: fullLocation,
      logo: formData.logo ?? undefined,
    };
    this.warRoomService.addActivityLog(activityLog);
    this.warRoomService.selectCompany(companyId);
    this.addCompanyModalRef()?.closeAfterSuccess();
  }

  private generateHubCode(companyName: string): string {
    const words = companyName.toUpperCase().split(/\s+/);
    if (words.length >= 2) {
      const firstChar = words[0][0] ?? '';
      const secondWord = words[1];
      const secondChar = secondWord.charAt(0) ?? '';
      const thirdChar = secondWord.length > 1 ? secondWord.charAt(1) : secondWord.charAt(0);
      return (firstChar + secondChar + thirdChar).substring(0, 3);
    }
    return companyName.toUpperCase().substring(0, 3).padEnd(3, 'X');
  }
}
