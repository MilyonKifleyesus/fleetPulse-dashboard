import {
  Component,
  signal,
  computed,
  OnInit,
  OnDestroy,
  input,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Subject, interval, forkJoin } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SharedModule } from '../../../shared/shared.module';
import { SpkApexChartsComponent } from '../../../@spk/reusable-charts/spk-apex-charts/spk-apex-charts.component';
import {
  VehicleDetail,
  VehicleMetrics,
  MaintenanceWorkflow,
  MaintenanceHistoryEntry,
  EfficiencyData,
  SecureLog,
  MaintenancePhaseType,
} from '../../../shared/models/vehicle.interface';
import { VehicleDetailService } from '../../../shared/services/vehicle-detail.service';

@Component({
  selector: 'app-vehicle-detail',
  imports: [
    CommonModule,
    NgApexchartsModule,
    SharedModule,
    SpkApexChartsComponent,
  ],
  templateUrl: './vehicle-detail.component.html',
  styleUrl: './vehicle-detail.component.scss',
})
export class VehicleDetailComponent implements OnInit, OnDestroy {
  // Route parameters (bound via withComponentInputBinding)
  vehicleId = input<string>('');
  facilityId = input<string | undefined>(); // Optional for nested route

  private destroy$ = new Subject<void>();

  // Data signals
  vehicleData = signal<VehicleDetail | null>(null);
  maintenanceHistory = signal<MaintenanceHistoryEntry[]>([]);
  efficiencyData = signal<EfficiencyData | null>(null);
  secureLogs = signal<SecureLog[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // UI state
  selectedTab = signal<'timeline' | 'history' | 'efficiency'>('timeline');
  efficiencyPeriod = signal<'30D' | '6M' | '1Y'>('30D');
  newLogMessage = signal<string>('');
  selectedImageIndex = signal<number>(0);

  // Computed values
  vehicle = computed(() => this.vehicleData());
  metrics = computed(() => this.vehicleData()?.metrics);
  maintenanceWorkflow = computed(() => this.vehicleData()?.maintenanceWorkflow);
  activeProtocol = computed(() => this.vehicleData()?.activeProtocol);
  assignedTeam = computed(() => this.vehicleData()?.assignedTeam);
  liveFeed = computed(() => this.vehicleData()?.liveFeed);

  // Image gallery computed values
  vehicleImages = computed(() => {
    const vehicle = this.vehicleData();
    if (vehicle?.imageUrls && vehicle.imageUrls.length > 0) {
      return vehicle.imageUrls;
    }
    // Fallback to single imageUrl for backward compatibility
    if (vehicle?.imageUrl) {
      return [vehicle.imageUrl];
    }
    return [];
  });

  currentImage = computed(() => {
    const images = this.vehicleImages();
    const index = this.selectedImageIndex();
    return images[index] || images[0] || null;
  });

  // Session timer
  sessionDuration = signal<string>('00:00:00');

  private sessionTimerInterval: any;

  constructor(
    private vehicleDetailService: VehicleDetailService,
    private router: Router
  ) {
    // Update session timer when live feed changes
    effect(() => {
      const feed = this.liveFeed();
      if (this.sessionTimerInterval) {
        clearInterval(this.sessionTimerInterval);
        this.sessionTimerInterval = null;
      }
      if (feed?.isLive && feed.sessionStartTime) {
        this.updateSessionTimer();
        this.sessionTimerInterval = setInterval(() => {
          this.updateSessionTimer();
        }, 1000);
      } else {
        this.sessionDuration.set('00:00:00');
      }
    });
  }

  ngOnInit(): void {
    this.loadData();

    // Real-time updates every 30 seconds
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadMetrics();
      });
  }

  ngOnDestroy(): void {
    if (this.sessionTimerInterval) {
      clearInterval(this.sessionTimerInterval);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    let id = this.vehicleId();
    if (!id) {
      this.errorMessage.set('Vehicle ID is required');
      this.isLoading.set(false);
      return;
    }
    // Normalize vehicle ID (remove # if present, or add it)
    id = id.startsWith('#') ? id : `#${id}`;

    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      vehicle: this.vehicleDetailService
        .getVehicleDetail(id)
        .pipe(catchError(() => of(null))),
      history: this.vehicleDetailService
        .getMaintenanceHistory(id)
        .pipe(catchError(() => of([]))),
      efficiency: this.vehicleDetailService
        .getEfficiencyData(id, this.efficiencyPeriod())
        .pipe(catchError(() => of(null))),
      logs: this.vehicleDetailService
        .getSecureLogs(id)
        .pipe(catchError(() => of([]))),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.vehicleData.set(data.vehicle);
          this.maintenanceHistory.set(data.history);
          this.efficiencyData.set(data.efficiency);
          this.secureLogs.set(data.logs);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.errorMessage.set(
            error.message || 'Failed to load vehicle detail data'
          );
          this.isLoading.set(false);
        },
      });
  }

  loadMetrics(): void {
    let id = this.vehicleId();
    if (!id || !this.vehicleData()) return;
    id = id.startsWith('#') ? id : `#${id}`;

    this.vehicleDetailService
      .getVehicleMetrics(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (metrics) => {
          const current = this.vehicleData();
          if (current) {
            this.vehicleData.set({ ...current, metrics });
          }
        },
        error: () => {
          // Silently fail for real-time updates
        },
      });
  }

  updateSessionTimer(): void {
    const feed = this.liveFeed();
    if (!feed?.isLive || !feed.sessionStartTime) {
      this.sessionDuration.set('00:00:00');
      return;
    }

    const start = new Date(feed.sessionStartTime).getTime();
    const now = Date.now();
    const diff = now - start;

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    this.sessionDuration.set(
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
        2,
        '0'
      )}:${String(seconds).padStart(2, '0')}`
    );
  }

  selectTab(tab: 'timeline' | 'history' | 'efficiency'): void {
    this.selectedTab.set(tab);
    if (tab === 'efficiency') {
      this.loadEfficiencyData();
    }
  }

  selectEfficiencyPeriod(period: '30D' | '6M' | '1Y'): void {
    this.efficiencyPeriod.set(period);
    this.loadEfficiencyData();
  }

  loadEfficiencyData(): void {
    let id = this.vehicleId();
    if (!id) return;
    id = id.startsWith('#') ? id : `#${id}`;

    this.vehicleDetailService
      .getEfficiencyData(id, this.efficiencyPeriod())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.efficiencyData.set(data);
        },
        error: () => {
          // Handle error silently
        },
      });
  }

  addSecureLog(): void {
    let id = this.vehicleId();
    const message = this.newLogMessage().trim();
    if (!id || !message) return;
    id = id.startsWith('#') ? id : `#${id}`;

    this.vehicleDetailService
      .addSecureLog(id, message)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.newLogMessage.set('');
          this.loadData();
        },
        error: () => {
          // Handle error
        },
      });
  }

  scheduleService(): void {
    // TODO: Open modal/dialog for scheduling service
    console.log('Schedule service for vehicle:', this.vehicleId());
  }

  viewFeed(): void {
    // TODO: Open modal or navigate to feed page
    console.log('View feed for vehicle:', this.vehicleId());
  }

  // Chart configuration for efficiency
  efficiencyChartOptions = computed<ApexOptions>(() => {
    const data = this.efficiencyData();
    if (!data || !data.dataPoints.length) {
      return this.getDefaultChartOptions();
    }

    const categories = data.dataPoints.map((p) => p.date);
    const efficiencyData = data.dataPoints.map((p) => p.efficiency);
    const consumptionData = data.dataPoints.map((p) => p.consumption);

    return {
      series: [
        {
          name: 'Efficiency',
          data: efficiencyData,
        },
        {
          name: 'Consumption',
          data: consumptionData,
        },
      ],
      chart: {
        height: 300,
        type: 'line',
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      stroke: {
        curve: 'smooth',
        width: [3, 2],
      },
      colors: [
        'var(--fleet-primary-green, #5ad85a)',
        'var(--fleet-warning, #eab308)',
      ],
      xaxis: {
        type: 'category',
        categories: categories,
        axisBorder: { show: false },
        axisTicks: { show: true },
      },
      yaxis: {
        title: { text: 'Percentage (%)' },
        min: 0,
        max: 100,
        labels: {
          formatter: (val: number) => val.toFixed(0) + '%',
        },
      },
      grid: {
        show: true,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      legend: {
        show: true,
        position: 'top',
        fontSize: '12px',
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (val: number) => val.toFixed(1) + '%',
        },
      },
    };
  });

  getDefaultChartOptions(): ApexOptions {
    return {
      series: [],
      chart: {
        height: 300,
        type: 'line',
      },
    };
  }

  // Format helpers
  formatDate(date: Date | string | undefined): string {
    if (!date) return '---';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  formatTime(timestamp: Date | string): string {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (days === 0) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (days === 1) {
      return 'YESTERDAY';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  }

  getPhaseStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETE':
        return 'phase-complete';
      case 'IN_PROGRESS':
        return 'phase-in-progress';
      case 'PENDING':
        return 'phase-pending';
      case 'LOCKED':
        return 'phase-locked';
      default:
        return '';
    }
  }

  getStateClass(state: string): string {
    switch (state) {
      case 'DONE':
        return 'state-done';
      case 'PASS':
        return 'state-pass';
      case 'FAILED':
        return 'state-failed';
      case 'IN_PROGRESS':
        return 'state-in-progress';
      default:
        return '';
    }
  }

  // Image gallery methods
  selectImage(index: number): void {
    const images = this.vehicleImages();
    if (index >= 0 && index < images.length) {
      this.selectedImageIndex.set(index);
    }
  }

  nextImage(): void {
    const images = this.vehicleImages();
    const currentIndex = this.selectedImageIndex();
    const nextIndex = (currentIndex + 1) % images.length;
    this.selectedImageIndex.set(nextIndex);
  }

  previousImage(): void {
    const images = this.vehicleImages();
    const currentIndex = this.selectedImageIndex();
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    this.selectedImageIndex.set(prevIndex);
  }

  // Expose Math for template
  Math = Math;
}
