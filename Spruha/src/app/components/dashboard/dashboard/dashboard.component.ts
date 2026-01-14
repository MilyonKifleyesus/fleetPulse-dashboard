import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import * as chartData from '../../../shared/data/dashboard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SpkApexChartsComponent } from '../../../@spk/reusable-charts/spk-apex-charts/spk-apex-charts.component';
import { SpkDashboardComponent } from '../../../@spk/reusable-dashboard/spk-dashboard/spk-dashboard.component';
import { SpkReusableTablesComponent } from '../../../@spk/reusable-tables/spk-reusable-tables/spk-reusable-tables.component';
import { CommonModule } from '@angular/common';
import { FleetService } from '../../../shared/services/fleet.service';
import { ExcelUploadService } from '../../../shared/services/excel-upload.service';
import {
  Vehicle,
  VehicleStatus,
} from '../../../shared/models/vehicle.interface';
import {
  DashboardStats,
  HistoricalData,
} from '../../../shared/models/dashboard-stats.interface';
import { Activity } from '../../../shared/models/activity.interface';
import { Company } from '../../../shared/models/company.interface';
import { Subject, forkJoin, of } from 'rxjs';
import { takeUntil, catchError, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

interface CardData {
  svg: string;
  title: string;
  subtitle: string;
  value: string;
  percentage: string;
  percentage1: string;
  percentageClass: string;
}

interface VehicleRequiringMaintenance {
  vehicleId: string;
  location: string;
  workOrderCount: number;
  daysBetweenWorkOrders: number;
  priority: string;
  priorityClass: string;
  status: string;
  statusClass: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SharedModule,
    NgbModule,
    NgSelectModule,
    NgCircleProgressModule,
    NgApexchartsModule,
    SpkApexChartsComponent,
    SpkDashboardComponent,
    SpkReusableTablesComponent,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [DatePipe],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data properties
  vehicles: Vehicle[] = [];
  dashboardStats: DashboardStats | null = null;
  activities: Activity[] = [];
  companies: Company[] = [];
  historicalData: HistoricalData | null = null;

  // UI State
  isLoading = false;
  errorMessage: string | null = null;
  hasData = false;
  lastSync: Date | null = null;
  selectedPeriod: '30d' | 'quarter' | 'year' = '30d';
  
  // Upload State
  showSaveButton: boolean = false;
  isUploading: boolean = false;
  pendingVehicles: Vehicle[] = [];
  selectedFileName: string = '';

  // Cards
  cards: CardData[] = [];

  // Charts
  public ChartOptions: any = {};
  public ChartOptions1: any = {};
  public ChartOptions2: any = chartData.ChartOptions2;

  // Bar chart (keeping for now, may remove later)
  public barChartOptions = chartData.barChartOptions;
  public barChartType = chartData.barChartType;
  public barChartData = chartData.barChartData;

  // Status distribution chart
  circleOptions: any = {};
  circleOptions1: any = {};

  // Activities
  transactions: Activity[] = [];

  // Work Orders / Vehicles Requiring Maintenance
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
  tasks: VehicleRequiringMaintenance[] = [];

  // Performance metrics
  healthScore: number = 0;
  healthScoreTrend: number = 0;

  constructor(
    private fleetService: FleetService,
    private excelUploadService: ExcelUploadService,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
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
      companies: this.fleetService
        .getCompanyStats()
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
          this.companies = data.companies;
          this.historicalData = data.historical;

          this.hasData = this.vehicles.length > 0;
          this.lastSync = new Date();

          // Calculate all derived data
          this.calculateCards();
          this.updateCharts();
          this.updateStatusChart();
          this.updateActivities();
          this.calculatePerformanceMetrics();
          this.updateVehiclesRequiringMaintenance();
          this.updateActiveOperations();

          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage =
            error.message || 'Failed to load dashboard data. Please try again.';
          this.isLoading = false;
          this.hasData = false;
        },
      });
  }

  refreshData(): void {
    this.fleetService.refreshData();
  }

  onPeriodChange(period: '30d' | 'quarter' | 'year'): void {
    this.selectedPeriod = period;
    this.fleetService
      .getHistoricalData(period)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.historicalData = data;
          this.updateCharts();
        },
        error: () => {
          this.errorMessage = 'Failed to load historical data.';
        },
      });
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

    // Calculate trends (stub - would need previous period data)
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
      // Use current snapshot if no historical data
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
        xaxis: {
          ...chartData.ChartOptions.xaxis,
          categories: ['Current'],
        },
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
      xaxis: {
        ...chartData.ChartOptions.xaxis,
        categories: categories,
      },
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

  calculatePerformanceMetrics(): void {
    if (this.vehicles.length === 0) {
      this.healthScore = 0;
      this.healthScoreTrend = 0;
      return;
    }

    const avgHealth =
      this.vehicles.reduce((sum, v) => sum + (v.healthScore || 0), 0) /
      this.vehicles.length;
    this.healthScore = Math.round(avgHealth);
    this.healthScoreTrend = this.dashboardStats?.efficiencyIndexTrend || 0;
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
        priority: priority,
        priorityClass: priorityClass,
        status: vehicle.status,
        statusClass: statusClass,
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
      chart: {
        height: 73,
        width: 50,
        type: 'donut',
      },
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
      chart: {
        height: 73,
        width: 50,
        type: 'donut',
      },
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

  get Math() {
    return Math;
  }

  get activeVehiclesCount(): number {
    return this.vehicles.filter((v) => v.status === 'Active').length;
  }

  get maintenanceVehiclesCount(): number {
    return this.vehicles.filter((v) => v.status === 'Maintenance').length;
  }

  /**
   * Process Excel file upload
   */
  async processExcelFile(file: File): Promise<void> {
    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      this.toastr.error('Please select a valid Excel file (.xlsx or .xls)', 'Invalid File Format');
      return;
    }

    this.isUploading = true;
    this.showSaveButton = false;
    this.selectedFileName = file.name;

    try {
      // Parse Excel file
      const vehicles = await this.excelUploadService.parseExcelFile(file);

      if (vehicles.length === 0) {
        this.toastr.warning('No valid vehicle data found in the Excel file', 'No Data');
        this.isUploading = false;
        return;
      }

      // Store pending vehicles
      this.pendingVehicles = vehicles;

      // Show success message
      this.toastr.success(
        `Successfully parsed ${vehicles.length} vehicle(s) from ${file.name}. Click Save to apply changes.`,
        'File Processed',
        { timeOut: 5000 }
      );

      // Show Save button
      this.showSaveButton = true;
      this.isUploading = false;
    } catch (error: any) {
      this.handleUploadError(error);
      this.isUploading = false;
      this.showSaveButton = false;
    }
  }

  /**
   * Handle Save button click
   */
  onSaveClick(): void {
    if (this.pendingVehicles.length === 0) {
      this.toastr.warning('No pending vehicles to save', 'Nothing to Save');
      return;
    }

    try {
      // Upsert vehicles to localStorage
      this.fleetService.upsertVehicles(this.pendingVehicles);

      // Create activity log entry
      const activity: Activity = {
        id: `activity-${Date.now()}`,
        type: 'excel_import',
        title: 'Data Import',
        description: `Excel file "${this.selectedFileName}" imported successfully. ${this.pendingVehicles.length} vehicle(s) processed.`,
        timestamp: new Date().toISOString(),
      };
      this.fleetService.saveActivity(activity);

      // Show success message
      this.toastr.success(
        `Successfully saved ${this.pendingVehicles.length} vehicle(s) to dashboard`,
        'Data Saved',
        { timeOut: 3000 }
      );

      // Reset state
      this.pendingVehicles = [];
      this.showSaveButton = false;
      this.selectedFileName = '';

      // Refresh dashboard data
      this.fleetService.refreshData();
    } catch (error: any) {
      this.toastr.error(
        error.message || 'Failed to save vehicles. Please try again.',
        'Save Error'
      );
    }
  }

  /**
   * Handle upload errors
   */
  private handleUploadError(error: Error): void {
    console.error('Upload error:', error);
    
    let errorMessage = 'Failed to process Excel file. ';
    
    if (error.message.includes('Required column')) {
      errorMessage = error.message;
    } else if (error.message.includes('no sheets')) {
      errorMessage = 'Excel file appears to be empty or corrupted.';
    } else if (error.message.includes('No valid vehicle data')) {
      errorMessage = error.message;
    } else {
      errorMessage += error.message || 'Unknown error occurred.';
    }

    this.toastr.error(errorMessage, 'Upload Error', { timeOut: 5000 });
    this.errorMessage = errorMessage;
  }
}
