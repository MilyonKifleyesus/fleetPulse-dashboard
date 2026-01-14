import {
  Component,
  signal,
  computed,
  OnInit,
  OnDestroy,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedModule } from '../../../shared/shared.module';
import { SpkApexChartsComponent } from '../../../@spk/reusable-charts/spk-apex-charts/spk-apex-charts.component';
import {
  FacilityOperationsData,
  Unit,
  FacilityTelemetry,
  FacilityResource,
  PerformanceMetrics,
  UnitStatus,
} from '../../../shared/models/facility.interface';
import { FacilityOperationsService } from '../../../shared/services/facility-operations.service';

@Component({
  selector: 'app-facility-operations',
  imports: [
    CommonModule,
    NgApexchartsModule,
    SharedModule,
    SpkApexChartsComponent,
  ],
  templateUrl: './facility-operations.component.html',
  styleUrl: './facility-operations.component.scss',
})
export class FacilityOperationsComponent implements OnInit, OnDestroy {
  // Route parameter (bound via withComponentInputBinding)
  facilityId = input<string>('');

  private destroy$ = new Subject<void>();

  // Data signals
  operationsData = signal<FacilityOperationsData | null>(null);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Computed values
  facility = computed(() => this.operationsData()?.facility);
  totalUnits = computed(() => this.operationsData()?.totalUnits ?? 0);
  activeUnits = computed(() => this.operationsData()?.activeUnits ?? 0);
  idleUnits = computed(() => this.operationsData()?.idleUnits ?? 0);
  criticalAlerts = computed(() => this.operationsData()?.criticalAlerts ?? 0);
  healthScore = computed(() => this.operationsData()?.healthScore ?? 0);
  telemetry = computed(() => this.operationsData()?.telemetry);
  resources = computed(() => this.operationsData()?.resources);
  units = computed(() => this.operationsData()?.units ?? []);
  activities = computed(() => this.operationsData()?.activities ?? []);
  performanceMetrics = computed(() => this.operationsData()?.performanceMetrics);

  // Table state
  searchTerm = signal<string>('');
  sortColumn = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal<number>(1);
  pageSize = signal<number>(25);

  // Computed filtered and sorted units
  filteredUnits = computed(() => {
    const allUnits = this.units();
    const search = this.searchTerm().toLowerCase().trim();

    if (!search) return allUnits;

    return allUnits.filter(
      (unit) =>
        unit.unitId.toLowerCase().includes(search) ||
        unit.model.toLowerCase().includes(search) ||
        unit.status.toLowerCase().includes(search) ||
        unit.assignedStaff.toLowerCase().includes(search)
    );
  });

  sortedUnits = computed(() => {
    const data = [...this.filteredUnits()];
    const column = this.sortColumn();
    const direction = this.sortDirection();

    if (!column) {
      // Default sort: Status (REPAIR first), then Battery (lowest first)
      return data.sort((a, b) => {
        const statusPriority: { [key in UnitStatus]: number } = {
          REPAIR: 0,
          MAINTENANCE: 1,
          STANDBY: 2,
          'IN SERVICE': 3,
        };
        const aPriority = statusPriority[a.status] ?? 4;
        const bPriority = statusPriority[b.status] ?? 4;

        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }
        return a.battery - b.battery;
      });
    }

    return data.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (column) {
        case 'unitId':
          aVal = a.unitId.toLowerCase();
          bVal = b.unitId.toLowerCase();
          break;
        case 'model':
          aVal = a.model.toLowerCase();
          bVal = b.model.toLowerCase();
          break;
        case 'status':
          const statusPriority: { [key in UnitStatus]: number } = {
            REPAIR: 0,
            MAINTENANCE: 1,
            STANDBY: 2,
            'IN SERVICE': 3,
          };
          aVal = statusPriority[a.status] ?? 4;
          bVal = statusPriority[b.status] ?? 4;
          break;
        case 'battery':
          aVal = a.battery;
          bVal = b.battery;
          break;
        case 'assignedStaff':
          aVal = a.assignedStaff.toLowerCase();
          bVal = b.assignedStaff.toLowerCase();
          break;
        case 'lastMaintenance':
          aVal = a.lastMaintenance
            ? new Date(a.lastMaintenance).getTime()
            : 0;
          bVal = b.lastMaintenance
            ? new Date(b.lastMaintenance).getTime()
            : 0;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  });

  totalPages = computed(() => {
    const total = this.sortedUnits().length;
    if (total === 0) return 1;
    return Math.ceil(total / this.pageSize());
  });

  paginatedUnits = computed(() => {
    const data = this.sortedUnits();
    if (data.length === 0) return [];
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return data.slice(start, end);
  });

  // Chart configuration - memoized to prevent infinite re-renders
  private chartOptionsCache: ApexOptions | null = null;
  private lastMetricsHash: string = '';

  performanceChartOptions = computed<ApexOptions>(() => {
    const metrics = this.performanceMetrics();
    if (!metrics) {
      return this.getDefaultChartOptions();
    }

    // Create a hash to detect if metrics actually changed
    const metricsHash = JSON.stringify(metrics.dataPoints) + metrics.currentTime;
    
    // Return cached options if metrics haven't changed
    if (this.chartOptionsCache && metricsHash === this.lastMetricsHash) {
      return this.chartOptionsCache;
    }

    const categories = metrics.dataPoints.map((p) => p.time);
    const fleetUptimeData = metrics.dataPoints.map((p) => p.fleetUptime);
    const energyLoadData = metrics.dataPoints.map((p) => p.energyLoad);
    const maintenanceData = metrics.dataPoints.map((p) => p.maintenance);

    const currentTimeIndex = categories.findIndex(
      (time) => time === metrics.currentTime
    );

    const chartOptions: ApexOptions = {
      series: [
        {
          name: 'Fleet Uptime',
          data: fleetUptimeData,
        },
        {
          name: 'Energy Load',
          data: energyLoadData,
        },
        {
          name: 'Maintenance',
          data: maintenanceData,
        },
      ],
      chart: {
        height: 400,
        type: 'line',
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      stroke: {
        curve: 'smooth',
        width: [3, 3, 3],
        dashArray: [0, 5, 0], // Solid, dashed, solid
      },
      colors: ['#6ee755', '#f97316', '#3b82f6'], // Green, Orange, Blue
      xaxis: {
        type: 'category',
        categories: categories,
        axisBorder: { show: false },
        axisTicks: { show: true },
      },
      yaxis: [
        {
          title: { text: 'Percentage (%)' },
          min: 0,
          max: 100,
          labels: {
            formatter: (val: number) => val.toFixed(0) + '%',
          },
        },
      ],
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
      annotations: currentTimeIndex >= 0
        ? {
            xaxis: [
              {
                x: categories[currentTimeIndex],
                strokeDashArray: 5,
                borderColor: '#6ee755',
                label: {
                  borderColor: '#6ee755',
                  style: {
                    color: '#fff',
                    background: '#6ee755',
                  },
                  text: `CURRENT TIME: ${metrics.currentTime}`,
                },
              },
            ],
          }
        : {},
    };

    // Cache the options
    this.chartOptionsCache = chartOptions;
    this.lastMetricsHash = metricsHash;

    return chartOptions;
  });

  constructor(
    private facilityOperationsService: FacilityOperationsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();

    // Real-time updates every 30 seconds - DISABLED temporarily to prevent freezing
    // TODO: Re-enable with proper change detection
    // interval(30000)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(() => {
    //     this.loadData();
    //   });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    const id = this.facilityId();
    
    // Validate facilityId - check for empty, undefined, or literal route parameter
    if (!id || id.trim() === '' || id === ':facilityId') {
      this.errorMessage.set('Facility ID is required');
      this.isLoading.set(false);
      return;
    }

    // Prevent multiple simultaneous loads
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Clean the facilityId (remove any whitespace)
    const cleanId = id.trim();

    this.facilityOperationsService
      .getFacilityOperations(cleanId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.operationsData.set(data);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.errorMessage.set(
            error.message || 'Failed to load facility operations data'
          );
          this.isLoading.set(false);
        },
      });
  }

  getDefaultChartOptions(): ApexOptions {
    return {
      series: [],
      chart: {
        height: 400,
        type: 'line',
      },
    };
  }

  // Table methods
  sortTable(column: string): void {
    if (this.sortColumn() === column) {
      this.sortDirection.set(
        this.sortDirection() === 'asc' ? 'desc' : 'asc'
      );
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
    this.currentPage.set(1);
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  exportToCSV(): void {
    const data = this.sortedUnits();
    const headers = [
      'Unit ID',
      'Model',
      'Status',
      'Battery',
      'Assigned Staff',
      'Last Maintenance',
    ];

    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        [
          row.unitId,
          `"${row.model}"`,
          row.status,
          row.battery + '%',
          `"${row.assignedStaff}"`,
          row.lastMaintenance
            ? new Date(row.lastMaintenance).toLocaleString()
            : '---',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `facility-units-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  generateReport(): void {
    const id = this.facilityId();
    if (!id) return;

    this.facilityOperationsService
      .generateReport(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `facility-report-${id}-${new Date().toISOString().split('T')[0]}.pdf`;
          link.click();
          URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error generating report:', error);
        },
      });
  }

  navigateToNodeConfig(): void {
    // Navigate to node configuration page
    // This would be implemented based on your routing structure
    console.log('Navigate to node configuration');
  }

  navigateToVehicleDetail(unitId: string, event?: Event): void {
    // Prevent default if event is provided (for button clicks)
    if (event) {
      event.stopPropagation();
    }

    const facilityId = this.facilityId();
    
    // Ensure we have a valid facilityId before navigating
    if (!facilityId || facilityId.trim() === '' || facilityId === ':facilityId') {
      console.error('Invalid facilityId:', facilityId);
      // Fallback to standalone route if facilityId is invalid
      const cleanUnitId = unitId.replace('#', '');
      this.router.navigate(['/dashboard', 'vehicle', cleanUnitId]);
      return;
    }

    // Clean the unitId (remove # if present)
    const cleanUnitId = unitId.replace('#', '');
    
    // Navigate to nested route: facility-operations/:facilityId/vehicle/:vehicleId
    this.router.navigate([
      '/dashboard',
      'facility-operations',
      facilityId.trim(),
      'vehicle',
      cleanUnitId,
    ]);
  }

  // Expose Math and String for template
  Math = Math;
  String = String;

  // Computed formatted values
  formattedCriticalAlerts = computed(() => {
    const alerts = this.criticalAlerts();
    return String(alerts).padStart(2, '0');
  });

  // Helper methods for template
  getStatusClass(status: UnitStatus): string {
    switch (status) {
      case 'IN SERVICE':
        return 'status-in-service';
      case 'MAINTENANCE':
        return 'status-maintenance';
      case 'STANDBY':
        return 'status-standby';
      case 'REPAIR':
        return 'status-repair';
      default:
        return '';
    }
  }

  getBatteryClass(battery: number): string {
    if (battery >= 75) return 'battery-good';
    if (battery >= 50) return 'battery-normal';
    if (battery >= 25) return 'battery-low';
    return 'battery-critical';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '---';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatTime(timestamp: string | Date): string {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  getPartStatusClass(status: string): string {
    switch (status) {
      case 'Low':
        return 'part-status-low';
      case 'Warning':
        return 'part-status-warning';
      case 'Critical':
        return 'part-status-critical';
      default:
        return 'part-status-normal';
    }
  }
}
