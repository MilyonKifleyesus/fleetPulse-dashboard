import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SharedModule } from '../../../shared/shared.module';
import { WorkspaceComponent } from '../../../shared/components/workspace/workspace.component';
import { WorkspaceStateService } from '../../../shared/services/workspace-state.service';
import { WorkspaceModeService } from '../../../shared/services/workspace-mode.service';
import { WidgetRegistryService } from '../../../shared/services/widget-registry.service';
import { FleetService } from '../../../shared/services/fleet.service';
import { WidgetFrame } from '../../../shared/models/workspace.interface';
import {
  DashboardStats,
  HistoricalData,
} from '../../../shared/models/dashboard-stats.interface';
import { Vehicle } from '../../../shared/models/vehicle.interface';
import { Activity } from '../../../shared/models/activity.interface';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpkApexChartsComponent } from '../../../@spk/reusable-charts/spk-apex-charts/spk-apex-charts.component';
import { SpkDashboardComponent } from '../../../@spk/reusable-dashboard/spk-dashboard/spk-dashboard.component';
import { SpkReusableTablesComponent } from '../../../@spk/reusable-tables/spk-reusable-tables/spk-reusable-tables.component';
import * as chartData from '../../../shared/data/dashboard';

interface CardData {
  svg: string;
  title: string;
  subtitle: string;
  value: string;
  percentage: string;
  percentage1: string;
  percentageClass: string;
}

@Component({
  selector: 'app-workspace-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    WorkspaceComponent,
    NgbModule,
    SpkApexChartsComponent,
    SpkDashboardComponent,
    SpkReusableTablesComponent,
  ],
  templateUrl: './workspace-dashboard.component.html',
  styleUrl: './workspace-dashboard.component.scss',
  providers: [DatePipe],
})
export class WorkspaceDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  readonly workspaceId = 'fleetpulse-dashboard';

  // Data
  vehicles: Vehicle[] = [];
  dashboardStats: DashboardStats | null = null;
  activities: Activity[] = [];
  historicalData: HistoricalData | null = null;
  cards: CardData[] = [];

  // UI State
  isLoading = false;
  errorMessage: string | null = null;
  hasData = false;
  lastSync: Date | null = null;
  selectedPeriod: '30d' | 'quarter' | 'year' = '30d';

  // Charts
  ChartOptions: any = {};
  ChartOptions1: any = {};
  circleOptions: any = {};
  circleOptions1: any = {};

  // Widgets
  widgets: WidgetFrame[] = [];

  // Table data
  taskColumns = [
    { header: 'Vehicle ID', field: 'VehicleID', tableHeadColumn: 'wd-lg-20p' },
    {
      header: 'Location',
      field: 'Location',
      tableHeadColumn: 'wd-lg-20p text-center',
    },
    {
      header: 'Work Orders',
      field: 'WorkOrders',
      tableHeadColumn: 'wd-lg-15p text-center',
    },
    {
      header: 'Days Between',
      field: 'DaysBetween',
      tableHeadColumn: 'wd-lg-15p text-center',
    },
    { header: 'Priority', field: 'Priority', tableHeadColumn: 'wd-lg-15p' },
    { header: 'Status', field: 'Status', tableHeadColumn: 'wd-lg-15p' },
  ];
  tasks: any[] = [];
  transactions: Activity[] = [];

  constructor(
    private fleetService: FleetService,
    private stateService: WorkspaceStateService,
    private modeService: WorkspaceModeService,
    private widgetRegistry: WidgetRegistryService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    // Load workspace state
    const savedState = this.stateService.loadWorkspaceState(this.workspaceId);

    if (savedState && savedState.widgets.length > 0) {
      this.widgets = savedState.widgets;
    } else {
      // Initialize with default widgets
      this.initializeDefaultWidgets();
    }

    // Subscribe to data refresh
    this.fleetService.dataRefresh$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadData();
      });

    // Initial load
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize default widget layout
   */
  private initializeDefaultWidgets(): void {
    this.widgets = [
      {
        id: 'widget-metric-1',
        type: 'metric-card',
        title: 'Total Fleet Units',
        icon: 'fe fe-truck',
        position: { column: 1, row: 1, columnSpan: 3, rowSpan: 2 },
        size: { width: 3, height: 2 },
        isMinimized: false,
        isMaximized: false,
        config: { metricIndex: 0 },
        order: 0,
      },
      {
        id: 'widget-metric-2',
        type: 'metric-card',
        title: 'Maintenance Efficiency',
        icon: 'fe fe-wrench',
        position: { column: 4, row: 1, columnSpan: 3, rowSpan: 2 },
        size: { width: 3, height: 2 },
        isMinimized: false,
        isMaximized: false,
        config: { metricIndex: 1 },
        order: 1,
      },
      {
        id: 'widget-metric-3',
        type: 'metric-card',
        title: 'Operational Cost',
        icon: 'fe fe-dollar-sign',
        position: { column: 7, row: 1, columnSpan: 3, rowSpan: 2 },
        size: { width: 3, height: 2 },
        isMinimized: false,
        isMaximized: false,
        config: { metricIndex: 2 },
        order: 2,
      },
      {
        id: 'widget-metric-4',
        type: 'metric-card',
        title: 'Efficiency Index',
        icon: 'fe fe-trending-up',
        position: { column: 10, row: 1, columnSpan: 3, rowSpan: 2 },
        size: { width: 3, height: 2 },
        isMinimized: false,
        isMaximized: false,
        config: { metricIndex: 3 },
        order: 3,
      },
      {
        id: 'widget-chart-1',
        type: 'chart-widget',
        title: 'Fleet Utilization',
        icon: 'fe fe-bar-chart-2',
        position: { column: 1, row: 3, columnSpan: 8, rowSpan: 4 },
        size: { width: 8, height: 4 },
        isMinimized: false,
        isMaximized: false,
        config: { chartType: 'utilization' },
        order: 4,
      },
      {
        id: 'widget-activity',
        type: 'activity-feed',
        title: 'Recent System Activities',
        icon: 'fe fe-activity',
        position: { column: 9, row: 3, columnSpan: 4, rowSpan: 4 },
        size: { width: 4, height: 4 },
        isMinimized: false,
        isMaximized: false,
        config: {},
        order: 5,
      },
      {
        id: 'widget-table',
        type: 'table-widget',
        title: 'Vehicles Requiring Maintenance',
        icon: 'fe fe-list',
        position: { column: 1, row: 7, columnSpan: 12, rowSpan: 5 },
        size: { width: 12, height: 5 },
        isMinimized: false,
        isMaximized: false,
        config: {},
        order: 6,
      },
    ];
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    forkJoin({
      vehicles: this.fleetService.getVehicles().pipe(catchError(() => of([]))),
      stats: this.fleetService
        .getDashboardStats()
        .pipe(catchError(() => of(null))),
      activities: this.fleetService
        .getRecentActivities(10)
        .pipe(catchError(() => of([]))),
      historical: this.fleetService
        .getHistoricalData(this.selectedPeriod)
        .pipe(catchError(() => of(null))),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.vehicles = data.vehicles;
          this.dashboardStats = data.stats;
          this.activities = data.activities;
          this.historicalData = data.historical;

          this.hasData = this.vehicles.length > 0;
          this.lastSync = new Date();

          this.calculateCards();
          this.updateCharts();
          this.updateStatusChart();
          this.updateActivities();
          this.updateVehiclesRequiringMaintenance();
          this.updateActiveOperations();

          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to load dashboard data.';
          this.isLoading = false;
          this.hasData = false;
        },
      });
  }

  onPeriodChange(period: '30d' | 'quarter' | 'year'): void {
    this.selectedPeriod = period;
    this.loadData();
  }

  calculateCards(): void {
    const totalVehicles = this.vehicles.length;
    const maintenanceCount = this.vehicles.filter(
      (v) => v.status === 'Maintenance' || v.status === 'Critical'
    ).length;
    const totalCost = this.vehicles.reduce((sum, v) => sum + (v.cost || 0), 0);
    const avgHealthScore =
      this.vehicles.length > 0
        ? this.vehicles.reduce((sum, v) => sum + (v.healthScore || 0), 0) /
        this.vehicles.length
        : 0;

    const totalTrend = this.dashboardStats?.totalFleetUnitsTrend || 0;
    const maintenanceTrend =
      this.dashboardStats?.maintenanceEfficiencyTrend || 0;
    const costTrend = this.dashboardStats?.operationalCostTrend || 0;
    const healthTrend = this.dashboardStats?.efficiencyIndexTrend || 0;

    this.cards = [
      {
        svg: `<svg class="text-primary" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" fill="currentColor"/></svg>`,
        title: 'Total Fleet Units',
        subtitle: 'Previous month vs this month',
        value: totalVehicles.toString(),
        percentage: Math.abs(totalTrend).toFixed(1) + '% ',
        percentage1: totalTrend >= 0 ? 'higher' : 'lower',
        percentageClass: totalTrend >= 0 ? 'text-success' : 'text-danger',
      },
      {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill="currentColor"/></svg>`,
        title: 'Maintenance Efficiency',
        subtitle: 'Vehicles in maintenance queue',
        value: maintenanceCount.toString(),
        percentage: Math.abs(maintenanceTrend).toFixed(1) + '%',
        percentage1: maintenanceTrend <= 0 ? 'Decreased' : 'Increased',
        percentageClass: maintenanceTrend <= 0 ? 'text-success' : 'text-danger',
      },
      {
        svg: `<svg class="text-primary" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.66 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" fill="currentColor"/></svg>`,
        title: 'Operational Cost',
        subtitle: 'Previous month vs this month',
        value:
          '$' +
          totalCost.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
        percentage: Math.abs(costTrend).toFixed(1) + '% ',
        percentage1: costTrend <= 0 ? 'Decreased' : 'Increased',
        percentageClass: costTrend <= 0 ? 'text-success' : 'text-danger',
      },
      {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/></svg>`,
        title: 'Efficiency Index',
        subtitle: 'Average health score',
        value: avgHealthScore.toFixed(1),
        percentage: Math.abs(healthTrend).toFixed(2) + '% ',
        percentage1: healthTrend >= 0 ? 'higher' : 'lower',
        percentageClass: healthTrend >= 0 ? 'text-success' : 'text-danger',
      },
    ];
  }

  updateCharts(): void {
    if (!this.historicalData || this.historicalData.dataPoints.length === 0) {
      const activeCount = this.vehicles.filter(
        (v) => v.status === 'Active'
      ).length;
      const inServiceCount = this.vehicles.filter(
        (v) => v.status === 'Active' || v.status === 'Maintenance'
      ).length;

      this.ChartOptions = {
        ...chartData.ChartOptions,
        series: [
          { name: 'Active Vehicles', data: [activeCount] },
          { name: 'Vehicles in Service', data: [inServiceCount] },
        ],
        xaxis: { ...chartData.ChartOptions.xaxis, categories: ['Current'] },
      };
      return;
    }

    const categories = this.historicalData.dataPoints.map((dp) => dp.period);
    const activeData = this.historicalData.dataPoints.map(
      (dp) => dp.activeVehicles
    );
    const inServiceData = this.historicalData.dataPoints.map(
      (dp) => dp.vehiclesInService
    );

    this.ChartOptions = {
      ...chartData.ChartOptions,
      series: [
        { name: 'Active Vehicles', data: activeData },
        { name: 'Vehicles in Service', data: inServiceData },
      ],
      xaxis: { ...chartData.ChartOptions.xaxis, categories },
    };
  }

  updateStatusChart(): void {
    const statusCounts = {
      active: this.vehicles.filter((v) => v.status === 'Active').length,
      maintenance: this.vehicles.filter((v) => v.status === 'Maintenance')
        .length,
      standby: this.vehicles.filter((v) => v.status === 'Standby').length,
      critical: this.vehicles.filter((v) => v.status === 'Critical').length,
    };

    const total = this.vehicles.length;
    const utilization =
      total > 0
        ? ((statusCounts.active + statusCounts.maintenance) / total) * 100
        : 0;

    this.ChartOptions1 = {
      ...chartData.ChartOptions1,
      series: [Math.round(utilization)],
    };
  }

  updateActivities(): void {
    this.transactions = this.activities.map((activity) => ({
      ...activity,
      icon: this.getActivityIcon(activity.type),
    }));
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'status_change':
        return './assets/images/faces/5.jpg';
      case 'vehicle_added':
        return './assets/images/faces/6.jpg';
      case 'excel_import':
        return './assets/images/faces/7.jpg';
      case 'health_score_alert':
        return './assets/images/faces/8.jpg';
      default:
        return './assets/images/faces/4.jpg';
    }
  }

  updateVehiclesRequiringMaintenance(): void {
    const maintenanceVehicles = this.vehicles.filter(
      (v) => v.status === 'Maintenance' || v.status === 'Critical'
    );

    this.tasks = maintenanceVehicles.map((vehicle) => {
      let priority = 'Normal';
      let priorityClass = 'text-warning';

      if (vehicle.status === 'Critical') {
        priority = 'High';
        priorityClass = 'text-danger';
      } else if (vehicle.status === 'Standby') {
        priority = 'Low';
        priorityClass = 'text-success';
      }

      let statusClass = 'bg-warning-transparent';
      if (vehicle.status === 'Critical') {
        statusClass = 'bg-danger-transparent';
      } else if (vehicle.status === 'Maintenance') {
        statusClass = 'bg-warning-transparent';
      }

      return {
        vehicleId: vehicle.vehicleId || vehicle.id,
        location: vehicle.location || 'N/A',
        workOrderCount: vehicle.workOrderCount || 0,
        daysBetweenWorkOrders: vehicle.daysBetweenWorkOrders || 0,
        priority,
        priorityClass,
        status: vehicle.status,
        statusClass,
      };
    });
  }

  updateActiveOperations(): void {
    const activeCount = this.vehicles.filter(
      (v) => v.status === 'Active'
    ).length;
    const maintenanceCount = this.vehicles.filter(
      (v) => v.status === 'Maintenance'
    ).length;
    const total = this.vehicles.length;
    const activePercentage = total > 0 ? (activeCount / total) * 100 : 0;
    const maintenancePercentage =
      total > 0 ? (maintenanceCount / total) * 100 : 0;

    this.circleOptions = {
      series: [
        Math.round(activePercentage),
        Math.round(100 - activePercentage),
      ],
      labels: ['Active', 'Other'],
      chart: { height: 73, width: 50, type: 'donut' },
      dataLabels: { enabled: false },
      legend: { show: false },
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'round',
        colors: '#fff',
        width: 0,
        dashArray: 0,
      },
      plotOptions: {
        pie: {
          expandOnClick: false,
          donut: {
            size: '75%',
            background: 'transparent',
            labels: {
              show: false,
              name: {
                show: true,
                fontSize: '20px',
                color: '#495057',
                offsetY: -4,
              },
              value: {
                show: true,
                fontSize: '18px',
                color: undefined,
                offsetY: 8,
              },
              total: {
                show: true,
                showAlways: true,
                label: 'Total',
                fontSize: '22px',
                fontWeight: 600,
                color: '#495057',
              },
            },
          },
        },
      },
      colors: ['#5ad85a', 'rgba(90, 216, 90, 0.2)'],
    };

    this.circleOptions1 = {
      series: [
        Math.round(maintenancePercentage),
        Math.round(100 - maintenancePercentage),
      ],
      labels: ['Maintenance', 'Other'],
      chart: { height: 73, width: 50, type: 'donut' },
      dataLabels: { enabled: false },
      legend: { show: false },
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'round',
        colors: '#fff',
        width: 0,
        dashArray: 0,
      },
      plotOptions: {
        pie: {
          expandOnClick: false,
          donut: {
            size: '75%',
            background: 'transparent',
            labels: {
              show: false,
              name: {
                show: true,
                fontSize: '20px',
                color: '#495057',
                offsetY: -4,
              },
              value: {
                show: true,
                fontSize: '18px',
                color: undefined,
                offsetY: 8,
              },
              total: {
                show: true,
                showAlways: true,
                label: 'Total',
                fontSize: '22px',
                fontWeight: 600,
                color: '#495057',
              },
            },
          },
        },
      },
      colors: ['#5ad85a', 'rgba(90, 216, 90, 0.2)'],
    };
  }

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return this.datePipe.transform(dateObj, 'medium') || '';
  }

  get activeVehiclesCount(): number {
    return this.vehicles.filter((v) => v.status === 'Active').length;
  }

  get maintenanceVehiclesCount(): number {
    return this.vehicles.filter((v) => v.status === 'Maintenance').length;
  }

  toggleEditMode(): void {
    this.modeService.toggleMode();
  }

  get modeServiceInstance(): WorkspaceModeService {
    return this.modeService;
  }
}
