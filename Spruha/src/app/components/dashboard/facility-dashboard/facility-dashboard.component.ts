import {
  Component,
  ElementRef,
  ViewChild,
  signal,
  computed,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from '../../../shared/shared.module';
import { SpkApexChartsComponent } from '../../../@spk/reusable-charts/spk-apex-charts/spk-apex-charts.component';
import { SpkDashboardComponent } from '../../../@spk/reusable-dashboard/spk-dashboard/spk-dashboard.component';
import { SpkReusableTablesComponent } from '../../../@spk/reusable-tables/spk-reusable-tables/spk-reusable-tables.component';
import { SpkNgSelectComponent } from '../../../@spk/reusable-plugins/spk-ng-select/spk-ng-select.component';
import { register } from 'swiper/element';
import {
  Facility,
  FacilityActivity,
  FacilityDashboardStats,
  FacilityHistoricalData,
  UtilizationZone,
} from '../../../shared/models/facility.interface';
import {
  mockFacilities,
  mockFacilityActivities,
  mockFacilityDashboardStats,
  mockFacilityHistoricalData,
  facilityPerformanceChart,
  resourceAllocationChart,
  operationalStatusChart,
  capacityUtilizationLineChart,
  facilitySparklineChart,
} from '../../../shared/data/facility-dashboard-data';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// #region agent log
console.error('DEBUG: FacilityDashboardComponent module file loaded');
// #endregion

register();

interface CardData {
  svg: string;
  title: string;
  subtitle: string;
  value: string;
  percentage: string;
  percentage1: string;
  percentageClass: string;
}

interface FacilityTableItem {
  id: string;
  facilityId: string;
  name: string;
  type: string;
  location: string;
  utilization: number;
  utilizationDisplay: string;
  efficiency: number;
  efficiencyDisplay: string;
  totalUnits: number;
  activeUnits: number;
  maintenanceUnits: number;
  repairUnits: number;
  status: string;
  change: string;
  changeClass: string;
  chartId: string;
  statusClass: string;
  alertCount: number;
  hasAlerts: boolean;
  repairQueueStatus: 'normal' | 'warning' | 'critical';
  efficiencyClass: string;
  repairQueueClass: string;
}

interface CarouselItem {
  id: string;
  name: string;
  utilization: number;
}

@Component({
  selector: 'app-facility-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    NgApexchartsModule,
    SharedModule,
    SpkApexChartsComponent,
    SpkDashboardComponent,
    SpkReusableTablesComponent,
    SpkNgSelectComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './facility-dashboard.component.html',
  styleUrl: './facility-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacilityDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;

  // Signals for data state
  facilities = signal<Facility[]>([]);
  activities = signal<FacilityActivity[]>([]);
  dashboardStats = signal<FacilityDashboardStats | null>(null);
  historicalData = signal<FacilityHistoricalData | null>(null);

  // Computed values
  totalFacilities = computed(() => this.facilities().length);
  operationalFacilitiesCount = computed(
    () =>
      this.facilities().filter(
        (f) =>
          f.operationalStatus === 'Fully Operational' ||
          f.operationalStatus === 'Operational with Limitations'
      ).length
  );
  averageUtilization = computed(() => {
    const facilities = this.facilities();
    if (facilities.length === 0) return 0;
    const sum = facilities.reduce(
      (acc, f) => acc + f.capacity.spaceUtilization,
      0
    );
    return sum / facilities.length;
  });
  criticalIssuesCount = computed(
    () =>
      this.facilities().filter(
        (f) =>
          f.operationalStatus === 'Non-Operational' ||
          f.operationalStatus === 'Emergency Shutdown'
      ).length
  );

  // Chart configurations
  performanceChart = facilityPerformanceChart;
  resourceAllocationChart = resourceAllocationChart;
  operationalStatusChart = operationalStatusChart;
  capacityLineChart = capacityUtilizationLineChart;
  sparklineChart = facilitySparklineChart;

  // Cards data
  cards = signal<CardData[]>([]);

  // Facility carousel data
  carouselItems = signal<CarouselItem[]>([]);

  // Facility table data
  facilityTableData = signal<FacilityTableItem[]>([]);
  facilityTableColumns = [
    { header: '#', field: '#', tableHeadColumn: 'wd-lg-5p', sortable: false },
    {
      header: 'FACILITY',
      field: 'FACILITY',
      tableHeadColumn: 'wd-lg-20p',
      sortable: true,
    },
    {
      header: 'LOCATION',
      field: 'LOCATION',
      tableHeadColumn: 'wd-lg-12p',
      sortable: true,
    },
    {
      header: 'EFFICIENCY',
      field: 'EFFICIENCY',
      tableHeadColumn: 'wd-lg-10p',
      sortable: true,
    },
    {
      header: 'UTILIZATION',
      field: 'UTILIZATION',
      tableHeadColumn: 'wd-lg-10p',
      sortable: true,
    },
    {
      header: 'UNITS',
      field: 'UNITS',
      tableHeadColumn: 'wd-lg-8p',
      sortable: true,
    },
    {
      header: 'ACTIVE',
      field: 'ACTIVE',
      tableHeadColumn: 'wd-lg-8p',
      sortable: true,
    },
    {
      header: 'MAINT',
      field: 'MAINT',
      tableHeadColumn: 'wd-lg-8p',
      sortable: true,
    },
    {
      header: 'REPAIR',
      field: 'REPAIR',
      tableHeadColumn: 'wd-lg-8p',
      sortable: true,
    },
    {
      header: 'CHANGE',
      field: 'CHANGE',
      tableHeadColumn: 'wd-lg-10p',
      sortable: true,
    },
    {
      header: 'TREND',
      field: 'TREND',
      tableHeadColumn: 'wd-lg-10p',
      sortable: true,
    },
    {
      header: 'STATUS',
      field: 'STATUS',
      tableHeadColumn: 'wd-lg-12p',
      sortable: true,
    },
  ];

  // Filter state signals
  selectedFacility = signal<string | null>(null);
  selectedLocations = signal<string[]>([]);
  selectedStatuses = signal<string[]>([]);
  selectedEfficiencyRange = signal<string | null>(null);
  selectedRepairQueue = signal<string | null>(null);
  searchTerm = signal<string>('');
  sortColumn = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Pagination state
  currentPage = signal<number>(1);
  pageSize = signal<number>(25);

  // Computed filter options
  uniqueFacilities = computed(() => {
    const facilities = this.facilityTableData();
    if (!facilities || facilities.length === 0) return [];
    return Array.from(new Set(facilities.map((f) => f.name))).sort();
  });

  uniqueLocations = computed(() => {
    const facilities = this.facilityTableData();
    if (!facilities || facilities.length === 0) return [];
    return Array.from(new Set(facilities.map((f) => f.location))).sort();
  });

  uniqueStatuses = computed(() => {
    const facilities = this.facilityTableData();
    if (!facilities || facilities.length === 0) return [];
    return Array.from(new Set(facilities.map((f) => f.status))).sort();
  });

  // Computed filter options for dropdowns (with label/value format)
  facilityFilterOptions = computed(() => {
    return this.uniqueFacilities().map((f) => ({ label: f, value: f }));
  });

  locationFilterOptions = computed(() => {
    return this.uniqueLocations().map((l) => ({ label: l, value: l }));
  });

  statusFilterOptions = computed(() => {
    return this.uniqueStatuses().map((s) => ({ label: s, value: s }));
  });

  efficiencyFilterOptions = [
    { label: 'Optimal (90-100%)', value: 'optimal' },
    { label: 'Good (75-89%)', value: 'good' },
    { label: 'Warning (60-74%)', value: 'warning' },
    { label: 'Critical (<60%)', value: 'critical' },
  ];

  repairQueueFilterOptions = [
    { label: 'Normal (0-9 units)', value: 'normal' },
    { label: 'Warning (10-14 units)', value: 'warning' },
    { label: 'Critical (15+ units)', value: 'critical' },
  ];

  // Computed filtered and sorted data
  filteredFacilityTableData = computed(() => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'facility-dashboard.component.ts:276',
        message: 'filteredFacilityTableData computed called',
        data: { tableDataLength: this.facilityTableData().length },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'D',
      }),
    }).catch(() => {});
    // #endregion
    const tableData = this.facilityTableData();
    if (!tableData || tableData.length === 0) {
      // #region agent log
      fetch(
        'http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'facility-dashboard.component.ts:279',
            message: 'filteredFacilityTableData returning empty',
            data: {},
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'D',
          }),
        }
      ).catch(() => {});
      // #endregion
      return [];
    }
    let data = [...tableData];

    // Apply facility filter
    if (this.selectedFacility()) {
      data = data.filter((f) => f.name === this.selectedFacility());
    }

    // Apply location filter
    if (this.selectedLocations().length > 0) {
      data = data.filter((f) => this.selectedLocations().includes(f.location));
    }

    // Apply status filter
    if (this.selectedStatuses().length > 0) {
      data = data.filter((f) => this.selectedStatuses().includes(f.status));
    }

    // Apply efficiency filter
    if (this.selectedEfficiencyRange()) {
      const range = this.selectedEfficiencyRange();
      data = data.filter((f) => {
        switch (range) {
          case 'optimal':
            return f.efficiency >= 90 && f.efficiency <= 100;
          case 'good':
            return f.efficiency >= 75 && f.efficiency < 90;
          case 'warning':
            return f.efficiency >= 60 && f.efficiency < 75;
          case 'critical':
            return f.efficiency < 60;
          default:
            return true;
        }
      });
    }

    // Apply repair queue filter
    if (this.selectedRepairQueue()) {
      const queue = this.selectedRepairQueue();
      data = data.filter((f) => {
        switch (queue) {
          case 'normal':
            return f.repairQueueStatus === 'normal';
          case 'warning':
            return f.repairQueueStatus === 'warning';
          case 'critical':
            return f.repairQueueStatus === 'critical';
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (this.searchTerm().trim()) {
      const term = this.searchTerm().toLowerCase().trim();
      data = data.filter(
        (f) =>
          f.name.toLowerCase().includes(term) ||
          f.location.toLowerCase().includes(term) ||
          f.facilityId.toLowerCase().includes(term)
      );
    }

    return data;
  });

  sortedFacilityTableData = computed(() => {
    const data = [...this.filteredFacilityTableData()];
    const column = this.sortColumn();
    const direction = this.sortDirection();

    if (!column) {
      return data;
    }

    return data.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (column) {
        case 'FACILITY':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'LOCATION':
          aVal = a.location.toLowerCase();
          bVal = b.location.toLowerCase();
          break;
        case 'EFFICIENCY':
          aVal = a.efficiency;
          bVal = b.efficiency;
          break;
        case 'UTILIZATION':
          aVal = a.utilization;
          bVal = b.utilization;
          break;
        case 'UNITS':
          aVal = a.totalUnits;
          bVal = b.totalUnits;
          break;
        case 'ACTIVE':
          aVal = a.activeUnits;
          bVal = b.activeUnits;
          break;
        case 'MAINT':
          aVal = a.maintenanceUnits;
          bVal = b.maintenanceUnits;
          break;
        case 'REPAIR':
          aVal = a.repairUnits;
          bVal = b.repairUnits;
          break;
        case 'STATUS':
          // Priority-based sorting
          const statusPriority: { [key: string]: number } = {
            'Emergency Shutdown': 0,
            'Non-Operational': 1,
            Warning: 2,
            'Under Maintenance': 3,
            'Operational with Limitations': 4,
            'Fully Operational': 5,
          };
          aVal = statusPriority[a.status] ?? 6;
          bVal = statusPriority[b.status] ?? 6;
          break;
        case 'CHANGE':
          aVal = parseFloat(a.change.replace('%', '').replace('+', ''));
          bVal = parseFloat(b.change.replace('%', '').replace('+', ''));
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;

      // Secondary sort by facility name
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  });

  totalPages = computed(() => {
    const total = this.sortedFacilityTableData().length;
    if (total === 0) return 1;
    return Math.ceil(total / this.pageSize());
  });

  paginatedFacilityTableData = computed(() => {
    const data = this.sortedFacilityTableData();
    if (data.length === 0) return [];
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return data.slice(start, end);
  });

  activeFilterCount = computed(() => {
    let count = 0;
    if (this.selectedFacility()) count++;
    if (this.selectedLocations().length > 0) count++;
    if (this.selectedStatuses().length > 0) count++;
    if (this.selectedEfficiencyRange()) count++;
    if (this.selectedRepairQueue()) count++;
    if (this.searchTerm().trim()) count++;
    return count;
  });

  // Expose Math for template use
  Math = Math;

  constructor() {
    // #region agent log
    console.error('DEBUG: FacilityDashboardComponent constructor called');
    console.error('DEBUG: Component is being instantiated');
    try {
      fetch(
        'http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'facility-dashboard.component.ts:489',
            message: 'Constructor entry',
            data: { timestamp: new Date().toISOString() },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run3',
            hypothesisId: 'B',
          }),
        }
      ).catch((e) => console.error('DEBUG: Log fetch failed', e));
    } catch (err) {
      console.error('DEBUG: Error in constructor logging', err);
    }
    // #endregion
    console.log('FacilityDashboardComponent: Constructor called');
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'facility-dashboard.component.ts:457',
        message: 'Constructor exit',
        data: {},
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run2',
        hypothesisId: 'B',
      }),
    }).catch((e) => console.error('DEBUG: Log fetch failed', e));
    // #endregion
  }

  ngOnInit(): void {
    // #region agent log
    console.error('DEBUG: FacilityDashboardComponent ngOnInit called');
    try {
      fetch(
        'http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'facility-dashboard.component.ts:524',
            message: 'ngOnInit entry',
            data: { timestamp: new Date().toISOString() },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run3',
            hypothesisId: 'B',
          }),
        }
      ).catch((e) => console.error('DEBUG: Log fetch failed in ngOnInit', e));
    } catch (err) {
      console.error('DEBUG: Error in ngOnInit logging', err);
    }
    // #endregion
    console.log('FacilityDashboardComponent: ngOnInit called');
    console.error('DEBUG: About to call loadData()');
    try {
      this.loadData();
      console.error('DEBUG: loadData() completed');
      // #region agent log
      fetch(
        'http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'facility-dashboard.component.ts:466',
            message: 'ngOnInit after loadData',
            data: {
              facilitiesCount: this.facilities().length,
              tableDataCount: this.facilityTableData().length,
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'C',
          }),
        }
      ).catch(() => {});
      // #endregion
      console.log(
        'FacilityDashboardComponent: Data loaded, facilities count:',
        this.facilities().length
      );
    } catch (error: any) {
      // #region agent log
      fetch(
        'http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'facility-dashboard.component.ts:472',
            message: 'ngOnInit error',
            data: { error: error?.message, stack: error?.stack },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'B',
          }),
        }
      ).catch(() => {});
      // #endregion
      throw error;
    }
  }

  ngAfterViewInit(): void {
    this.initializeSwiper();
  }

  /**
   * Load mock data
   * TODO: Replace with FacilityService when backend integration is ready
   */
  loadData(): void {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'facility-dashboard.component.ts:475',
        message: 'loadData entry',
        data: { mockFacilitiesLength: mockFacilities?.length },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'C',
      }),
    }).catch(() => {});
    // #endregion
    try {
      // Load mock data - structure allows easy replacement with service calls
      this.facilities.set(mockFacilities);
      // #region agent log
      fetch(
        'http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'facility-dashboard.component.ts:479',
            message: 'Facilities set',
            data: { count: this.facilities().length },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'C',
          }),
        }
      ).catch(() => {});
      // #endregion
      this.activities.set(mockFacilityActivities);
      this.dashboardStats.set(mockFacilityDashboardStats);
      this.historicalData.set(mockFacilityHistoricalData);

      // Calculate derived data
      this.calculateCards();
      this.calculateCarouselItems();
      this.calculateFacilityTableData();
      // #region agent log
      fetch(
        'http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'facility-dashboard.component.ts:490',
            message: 'loadData success',
            data: {
              facilitiesCount: this.facilities().length,
              tableDataCount: this.facilityTableData().length,
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'C',
          }),
        }
      ).catch(() => {});
      // #endregion
    } catch (error: any) {
      // #region agent log
      fetch(
        'http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'facility-dashboard.component.ts:492',
            message: 'loadData error',
            data: { error: error?.message, stack: error?.stack },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'C',
          }),
        }
      ).catch(() => {});
      // #endregion
      console.error('Error loading facility data:', error);
      // Set empty arrays to prevent component crash
      this.facilities.set([]);
      this.activities.set([]);
      this.facilityTableData.set([]);
    }
  }

  /**
   * Calculate utilization zone based on utilization percentage
   */
  getUtilizationZone(utilization: number): UtilizationZone {
    if (utilization >= 60 && utilization <= 80) return 'Green';
    if (utilization > 80 && utilization <= 90) return 'Yellow';
    if (utilization > 90) return 'Red';
    return 'Blue';
  }

  /**
   * Get status color class
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'Fully Operational':
        return 'text-success';
      case 'Operational with Limitations':
        return 'text-primary';
      case 'Partially Operational':
        return 'text-warning';
      case 'Under Maintenance':
        return 'text-warning';
      case 'Non-Operational':
      case 'Emergency Shutdown':
        return 'text-danger';
      default:
        return 'text-muted';
    }
  }

  /**
   * Calculate summary cards
   */
  calculateCards(): void {
    const stats = this.dashboardStats();
    const total = this.totalFacilities();
    const operational = this.operationalFacilitiesCount();
    const avgUtil = this.averageUtilization();
    const critical = this.criticalIssuesCount();

    this.cards.set([
      {
        svg: `<svg class="text-primary" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="currentColor"/></svg>`,
        title: 'Total Facilities',
        subtitle: 'All registered facilities',
        value: total.toString(),
        percentage: (stats?.totalFacilitiesTrend || 0).toFixed(1) + '%',
        percentage1:
          (stats?.totalFacilitiesTrend || 0) >= 0 ? 'increase' : 'decrease',
        percentageClass:
          (stats?.totalFacilitiesTrend || 0) >= 0
            ? 'text-success'
            : 'text-danger',
      },
      {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor"/></svg>`,
        title: 'Operational Facilities',
        subtitle: 'Currently operational',
        value: operational.toString(),
        percentage: (stats?.operationalFacilitiesTrend || 0).toFixed(1) + '%',
        percentage1:
          (stats?.operationalFacilitiesTrend || 0) >= 0
            ? 'increase'
            : 'decrease',
        percentageClass:
          (stats?.operationalFacilitiesTrend || 0) >= 0
            ? 'text-success'
            : 'text-danger',
      },
      {
        svg: `<svg class="text-primary" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/></svg>`,
        title: 'Average Utilization',
        subtitle: 'Capacity utilization rate',
        value: avgUtil.toFixed(1) + '%',
        percentage:
          (stats?.averageCapacityUtilizationTrend || 0).toFixed(1) + '%',
        percentage1:
          (stats?.averageCapacityUtilizationTrend || 0) >= 0
            ? 'increase'
            : 'decrease',
        percentageClass:
          (stats?.averageCapacityUtilizationTrend || 0) >= 0
            ? 'text-success'
            : 'text-danger',
      },
      {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor"/></svg>`,
        title: 'Critical Issues',
        subtitle: 'Facilities requiring attention',
        value: critical.toString(),
        percentage: (stats?.criticalIssuesTrend || 0).toFixed(1) + '%',
        percentage1:
          (stats?.criticalIssuesTrend || 0) <= 0 ? 'decrease' : 'increase',
        percentageClass:
          (stats?.criticalIssuesTrend || 0) <= 0
            ? 'text-success'
            : 'text-danger',
      },
    ]);
  }

  /**
   * Calculate carousel items (top facilities by utilization)
   */
  calculateCarouselItems(): void {
    const facilities = this.facilities();
    const sorted = [...facilities]
      .sort((a, b) => b.capacity.spaceUtilization - a.capacity.spaceUtilization)
      .slice(0, 8);

    this.carouselItems.set(
      sorted.map((f) => ({
        id: f.id,
        name: f.name,
        utilization: f.capacity.spaceUtilization,
      }))
    );
  }

  /**
   * Calculate alerts for a facility
   */
  calculateAlerts(facility: Facility): number {
    let alertCount = 0;

    // Capacity alert (utilization > 90%)
    if (facility.capacity.spaceUtilization > 90) {
      alertCount++;
    }

    // Efficiency alert (efficiency dropping or low)
    if (facility.capacity.resourceEfficiency < 75) {
      alertCount++;
    }

    // Maintenance alert (scheduled maintenance upcoming within 7 days)
    if (facility.nextScheduledMaintenance) {
      const nextMaintenance = new Date(facility.nextScheduledMaintenance);
      const today = new Date();
      const daysUntil = Math.ceil(
        (nextMaintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntil <= 7 && daysUntil >= 0) {
        alertCount++;
      }
    }

    // Critical alert (non-operational or emergency shutdown)
    if (
      facility.operationalStatus === 'Non-Operational' ||
      facility.operationalStatus === 'Emergency Shutdown'
    ) {
      alertCount++;
    }

    // Repair queue alert (calculated separately, but count if critical)
    const repairUnits = this.calculateRepairUnits(facility);
    if (repairUnits >= 15) {
      alertCount++;
    }

    return alertCount;
  }

  /**
   * Calculate repair units for a facility
   * For now, using a mock calculation based on facility status and capacity
   */
  calculateRepairUnits(facility: Facility): number {
    // Mock calculation - in real app, this would come from vehicle/unit data
    // Base on operational status and utilization
    if (facility.operationalStatus === 'Under Maintenance') {
      return Math.floor(facility.capacity.maxOccupancy * 0.15);
    }
    if (facility.operationalStatus === 'Operational with Limitations') {
      return Math.floor(facility.capacity.maxOccupancy * 0.08);
    }
    if (facility.capacity.spaceUtilization > 90) {
      return Math.floor(facility.capacity.maxOccupancy * 0.12);
    }
    return Math.floor(facility.capacity.maxOccupancy * 0.05);
  }

  /**
   * Get repair queue status
   */
  getRepairQueueStatus(repairUnits: number): 'normal' | 'warning' | 'critical' {
    if (repairUnits >= 15) return 'critical';
    if (repairUnits >= 10) return 'warning';
    return 'normal';
  }

  /**
   * Get efficiency color class
   */
  getEfficiencyClass(efficiency: number): string {
    if (efficiency >= 90) return 'text-success';
    if (efficiency >= 75) return 'text-primary';
    if (efficiency >= 60) return 'text-warning';
    return 'text-danger';
  }

  /**
   * Get repair queue color class
   */
  getRepairQueueClass(status: 'normal' | 'warning' | 'critical'): string {
    switch (status) {
      case 'critical':
        return 'text-danger';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-success';
    }
  }

  /**
   * Calculate facility table data
   */
  calculateFacilityTableData(): void {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'facility-dashboard.component.ts:696',
        message: 'calculateFacilityTableData entry',
        data: { facilitiesCount: this.facilities().length },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'C',
      }),
    }).catch(() => {});
    // #endregion
    const facilities = this.facilities();
    const tableData: FacilityTableItem[] = facilities.map((facility, index) => {
      const utilization = facility.capacity.spaceUtilization;
      const efficiency = facility.capacity.resourceEfficiency || utilization;
      const zone = this.getUtilizationZone(utilization);
      const change =
        index % 3 === 0 ? '+2.3%' : index % 3 === 1 ? '-1.1%' : '+0.5%';
      const changeClass = change.startsWith('+')
        ? 'text-success'
        : 'text-danger';

      // Get type abbreviation - handle special cases
      let typeAbbr = facility.classification.substring(0, 3).toUpperCase();
      if (facility.classification.includes('/')) {
        // For "Warehouse/Distribution" use "WH" instead of "War"
        typeAbbr = facility.classification
          .split('/')[0]
          .substring(0, 2)
          .toUpperCase();
      }

      // Calculate location string
      const location = facility.location.state
        ? `${facility.location.city}, ${facility.location.state}`
        : facility.location.city;

      // Calculate unit counts (mock data - in real app would come from vehicle/unit service)
      const totalUnits = facility.capacity.maxOccupancy;
      const activeUnits = Math.floor(
        totalUnits * (facility.capacity.occupancyRate / 100)
      );
      const maintenanceUnits =
        facility.operationalStatus === 'Under Maintenance'
          ? Math.floor(totalUnits * 0.15)
          : Math.floor(totalUnits * 0.05);
      const repairUnits = this.calculateRepairUnits(facility);

      // Calculate alerts
      const alertCount = this.calculateAlerts(facility);
      const hasAlerts = alertCount > 0;

      // Get repair queue status
      const repairQueueStatus = this.getRepairQueueStatus(repairUnits);

      return {
        id: facility.id,
        facilityId: facility.facilityId,
        name: facility.name,
        type: typeAbbr,
        location,
        utilization,
        utilizationDisplay: utilization.toFixed(1) + '%',
        efficiency,
        efficiencyDisplay: efficiency.toFixed(1) + '%',
        totalUnits,
        activeUnits,
        maintenanceUnits,
        repairUnits,
        status: facility.operationalStatus,
        change,
        changeClass,
        chartId: `sparkline-${facility.id}`,
        statusClass: this.getStatusClass(facility.operationalStatus),
        alertCount,
        hasAlerts,
        repairQueueStatus,
        efficiencyClass: this.getEfficiencyClass(efficiency),
        repairQueueClass: this.getRepairQueueClass(repairQueueStatus),
      };
    });

    this.facilityTableData.set(tableData);
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'facility-dashboard.component.ts:760',
        message: 'calculateFacilityTableData exit',
        data: { tableDataCount: tableData.length },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'C',
      }),
    }).catch(() => {});
    // #endregion
  }

  /**
   * Initialize Swiper carousel
   */
  initializeSwiper(): void {
    if (this.swiperContainer) {
      const swiperEl = this.swiperContainer.nativeElement;
      Object.assign(swiperEl, {
        slidesPerView: 5,
        spaceBetween: 10,
        loop: true,
        breakpoints: {
          0: { slidesPerView: 1, spaceBetween: 20 },
          320: { slidesPerView: 1, spaceBetween: 20 },
          500: { slidesPerView: 2, spaceBetween: 20 },
          700: { slidesPerView: 3, spaceBetween: 20 },
          1400: { slidesPerView: 5, spaceBetween: 20 },
        },
      });
    }
  }

  /**
   * Sort table by column
   */
  sortTable(column: string): void {
    if (this.sortColumn() === column) {
      // Toggle direction
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
    // Reset to first page when sorting
    this.currentPage.set(1);
  }

  /**
   * Clear all filters
   */
  clearAllFilters(): void {
    this.selectedFacility.set(null);
    this.selectedLocations.set([]);
    this.selectedStatuses.set([]);
    this.selectedEfficiencyRange.set(null);
    this.selectedRepairQueue.set(null);
    this.searchTerm.set('');
    this.currentPage.set(1);
  }

  /**
   * Export to CSV
   */
  exportToCSV(): void {
    const data = this.sortedFacilityTableData();
    const headers = [
      '#',
      'Facility',
      'Location',
      'Efficiency',
      'Utilization',
      'Total Units',
      'Active Units',
      'Maintenance Units',
      'Repair Units',
      'Change',
      'Status',
    ];

    const csvContent = [
      headers.join(','),
      ...data.map((row, index) =>
        [
          index + 1,
          `"${row.name} ${row.type}"`,
          `"${row.location}"`,
          row.efficiencyDisplay,
          row.utilizationDisplay,
          row.totalUnits,
          row.activeUnits,
          row.maintenanceUnits,
          row.repairUnits,
          row.change,
          `"${row.status}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `facility-operations-log-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export to Excel (using CSV format for now - can be enhanced with xlsx library)
   */
  exportToExcel(): void {
    // For now, use CSV export. Can be enhanced with xlsx library if needed
    this.exportToCSV();
  }

  /**
   * Navigate to page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  /**
   * Handle search input with debounce
   */
  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  /**
   * Filter change handlers
   * ng-select emits the value directly (not the object) when using bindValue
   */
  onFacilityFilterChange(event: any): void {
    // ng-select with bindValue emits the value directly, not the object
    this.selectedFacility.set(event || null);
    this.currentPage.set(1);
  }

  onLocationFilterChange(event: any): void {
    // For multiple select, ng-select returns array of values directly
    if (!event) {
      this.selectedLocations.set([]);
    } else if (Array.isArray(event)) {
      this.selectedLocations.set(event);
    } else {
      this.selectedLocations.set([event]);
    }
    this.currentPage.set(1);
  }

  onStatusFilterChange(event: any): void {
    // For multiple select, ng-select returns array of values directly
    if (!event) {
      this.selectedStatuses.set([]);
    } else if (Array.isArray(event)) {
      this.selectedStatuses.set(event);
    } else {
      this.selectedStatuses.set([event]);
    }
    this.currentPage.set(1);
  }

  onEfficiencyFilterChange(event: any): void {
    // ng-select with bindValue emits the value directly
    this.selectedEfficiencyRange.set(event || null);
    this.currentPage.set(1);
  }

  onRepairQueueFilterChange(event: any): void {
    // ng-select with bindValue emits the value directly
    this.selectedRepairQueue.set(event || null);
    this.currentPage.set(1);
  }

  /**
   * Initialize new facility
   * TODO: Implement modal or navigation to facility creation form
   */
  initializeNewFacility(): void {
    // TODO: Open modal or navigate to facility creation page
    console.log('Initialize New Facility clicked');
    // Example: this.router.navigate(['/facilities/new']);
    // Or: this.modalService.open(FacilityCreationModal);
  }
}
