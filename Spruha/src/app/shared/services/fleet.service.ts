import { Injectable } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject, interval } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { Vehicle } from '../models/vehicle.interface';
import { Company } from '../models/company.interface';
import {
  DashboardStats,
  HistoricalData,
  HistoricalDataPoint,
} from '../models/dashboard-stats.interface';
import { Activity } from '../models/activity.interface';

@Injectable({
  providedIn: 'root',
})
export class FleetService {
  private dataRefreshSubject = new BehaviorSubject<Date>(new Date());
  public dataRefresh$ = this.dataRefreshSubject.asObservable();

  // localStorage keys
  private readonly VEHICLES_KEY = 'fleetpulse-vehicles';
  private readonly ACTIVITIES_KEY = 'fleetpulse-activities';
  private readonly LAST_SYNC_KEY = 'fleetpulse-last-sync';

  constructor() {
    // Auto-refresh every 5 minutes (300000 ms)
    interval(300000).subscribe(() => {
      this.dataRefreshSubject.next(new Date());
    });
  }

  /**
   * Get all vehicles
   * Loads from localStorage, falls back to mock data if empty
   */
  getVehicles(): Observable<Vehicle[]> {
    const storedVehicles = this.loadVehiclesFromStorage();

    // If no stored data, return mock data for initial setup
    if (storedVehicles.length === 0) {
      const mockVehicles: Vehicle[] = [
        {
          id: '1',
          vehicleId: 'VH-001',
          status: 'Active',
          healthScore: 85,
          workOrderCount: 2,
          location: 'New York',
          cost: 45000,
          companyId: '1',
          companyName: 'FleetCorp',
          daysBetweenWorkOrders: 45,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          vehicleId: 'VH-002',
          status: 'Active',
          healthScore: 92,
          workOrderCount: 1,
          location: 'Los Angeles',
          cost: 52000,
          companyId: '1',
          companyName: 'FleetCorp',
          daysBetweenWorkOrders: 60,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          vehicleId: 'VH-003',
          status: 'Maintenance',
          healthScore: 65,
          workOrderCount: 3,
          location: 'Chicago',
          cost: 38000,
          companyId: '2',
          companyName: 'TransLog',
          daysBetweenWorkOrders: 30,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          vehicleId: 'VH-004',
          status: 'Critical',
          healthScore: 42,
          workOrderCount: 5,
          location: 'Houston',
          cost: 41000,
          companyId: '2',
          companyName: 'TransLog',
          daysBetweenWorkOrders: 20,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          vehicleId: 'VH-005',
          status: 'Active',
          healthScore: 88,
          workOrderCount: 1,
          location: 'Miami',
          cost: 48000,
          companyId: '1',
          companyName: 'FleetCorp',
          daysBetweenWorkOrders: 55,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '6',
          vehicleId: 'VH-006',
          status: 'Standby',
          healthScore: 75,
          workOrderCount: 0,
          location: 'Seattle',
          cost: 35000,
          companyId: '3',
          companyName: 'Pacific Fleet',
          daysBetweenWorkOrders: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      return of(mockVehicles).pipe(delay(100));
    }

    return of(storedVehicles).pipe(
      delay(100), // Simulate network delay
      catchError((error) => {
        console.error('Error fetching vehicles:', error);
        return throwError(
          () => new Error('Failed to load vehicles. Please try again.')
        );
      })
    );
  }

  /**
   * Get dashboard statistics
   * Calculates from stored vehicles
   */
  getDashboardStats(period?: string): Observable<DashboardStats> {
    const vehicles = this.loadVehiclesFromStorage();
    const stats = this.calculateDashboardStats(vehicles);

    return of(stats).pipe(
      delay(100),
      catchError((error) => {
        console.error('Error fetching dashboard stats:', error);
        return throwError(
          () =>
            new Error('Failed to load dashboard statistics. Please try again.')
        );
      })
    );
  }

  /**
   * Get historical data for charts
   * Generates from current vehicle data (simplified - would need time-series data for accurate history)
   */
  getHistoricalData(
    period: '30d' | 'quarter' | 'year' = '30d'
  ): Observable<HistoricalData> {
    const vehicles = this.loadVehiclesFromStorage();

    // Generate historical data based on current state
    // In a real implementation, this would come from time-series data
    const currentActive = vehicles.filter((v) => v.status === 'Active').length;
    const currentInService = vehicles.filter(
      (v) => v.status === 'Active' || v.status === 'Maintenance'
    ).length;

    // Generate mock historical points based on current data
    // This is a simplified approach - real implementation would track historical snapshots
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const dataPoints: HistoricalDataPoint[] = months.map((month, index) => {
      // Simulate slight variations from current state
      const variation = (index % 3) - 1; // -1, 0, or 1
      return {
        period: month,
        activeVehicles: Math.max(0, currentActive + variation * 2),
        vehiclesInService: Math.max(0, currentInService + variation),
      };
    });

    const historicalData: HistoricalData = {
      dataPoints,
      period: period,
    };

    return of(historicalData).pipe(
      delay(100),
      catchError((error) => {
        console.error('Error fetching historical data:', error);
        return throwError(
          () => new Error('Failed to load historical data. Please try again.')
        );
      })
    );
  }

  /**
   * Get company statistics
   * TODO: Connect to backend API
   */
  getCompanyStats(): Observable<Company[]> {
    // Mock data for testing - Remove when connecting to backend
    // Replace with: return this.http.get<Company[]>('/api/companies/stats');
    const mockCompanies: Company[] = [
      {
        id: '1',
        name: 'FleetCorp',
        entityName: 'FleetCorp Inc.',
        activeUnits: 150,
        maintenanceLoad: 5.2,
        totalUnits: 158,
        systemStatus: 'Optimal',
        efficiency: 85,
      },
      {
        id: '2',
        name: 'TransLog',
        entityName: 'TransLog Systems',
        activeUnits: 65,
        maintenanceLoad: 12.3,
        totalUnits: 74,
        systemStatus: 'Warning',
        efficiency: 68,
      },
      {
        id: '3',
        name: 'Pacific Fleet',
        entityName: 'Pacific Fleet Services',
        activeUnits: 15,
        maintenanceLoad: 8.5,
        totalUnits: 16,
        systemStatus: 'Optimal',
        efficiency: 82,
      },
    ];

    return of(mockCompanies).pipe(
      delay(100),
      catchError((error) => {
        console.error('Error fetching company stats:', error);
        return throwError(
          () =>
            new Error('Failed to load company statistics. Please try again.')
        );
      })
    );
  }

  /**
   * Get recent activities
   * Loads from localStorage
   */
  getRecentActivities(limit: number = 10): Observable<Activity[]> {
    const activities = this.getActivitiesFromStorage();
    // Sort by timestamp descending and limit
    const sorted = activities
      .sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateB - dateA;
      })
      .slice(0, limit);

    return of(sorted).pipe(
      delay(100),
      catchError((error) => {
        console.error('Error fetching recent activities:', error);
        return throwError(
          () => new Error('Failed to load recent activities. Please try again.')
        );
      })
    );
  }

  /**
   * Trigger data refresh
   */
  refreshData(): void {
    this.dataRefreshSubject.next(new Date());
  }

  /**
   * Save vehicles to localStorage
   */
  saveVehiclesToStorage(vehicles: Vehicle[]): void {
    try {
      localStorage.setItem(this.VEHICLES_KEY, JSON.stringify(vehicles));
      localStorage.setItem(this.LAST_SYNC_KEY, new Date().toISOString());
    } catch (error) {
      console.error('Error saving vehicles to localStorage:', error);
      throw new Error('Failed to save vehicles. Storage may be full.');
    }
  }

  /**
   * Load vehicles from localStorage
   */
  loadVehiclesFromStorage(): Vehicle[] {
    try {
      const stored = localStorage.getItem(this.VEHICLES_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error loading vehicles from localStorage:', error);
      return [];
    }
  }

  /**
   * Upsert a single vehicle (update if exists, insert if new)
   */
  upsertVehicle(vehicle: Vehicle): void {
    const vehicles = this.loadVehiclesFromStorage();
    const existingIndex = vehicles.findIndex(
      (v) => v.vehicleId === vehicle.vehicleId
    );

    if (existingIndex >= 0) {
      // Update existing - preserve createdAt
      const existing = vehicles[existingIndex];
      vehicles[existingIndex] = {
        ...vehicle,
        id: existing.id,
        createdAt: existing.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Insert new
      vehicles.push({
        ...vehicle,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    this.saveVehiclesToStorage(vehicles);
  }

  /**
   * Upsert multiple vehicles
   */
  upsertVehicles(newVehicles: Vehicle[]): void {
    const existingVehicles = this.loadVehiclesFromStorage();
    const vehicleMap = new Map<string, Vehicle>();

    // Add existing vehicles to map
    existingVehicles.forEach((v) => {
      vehicleMap.set(v.vehicleId, v);
    });

    // Upsert new vehicles
    newVehicles.forEach((vehicle) => {
      const existing = vehicleMap.get(vehicle.vehicleId);
      if (existing) {
        // Update - preserve createdAt
        vehicleMap.set(vehicle.vehicleId, {
          ...vehicle,
          id: existing.id,
          createdAt: existing.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Insert new
        vehicleMap.set(vehicle.vehicleId, {
          ...vehicle,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });

    // Convert map back to array and save
    const allVehicles = Array.from(vehicleMap.values());
    this.saveVehiclesToStorage(allVehicles);
  }

  /**
   * Save activity to localStorage
   */
  saveActivity(activity: Activity): void {
    try {
      const activities = this.getActivitiesFromStorage();
      activities.push({
        ...activity,
        id:
          activity.id ||
          `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: activity.timestamp || new Date().toISOString(),
      });
      localStorage.setItem(this.ACTIVITIES_KEY, JSON.stringify(activities));
    } catch (error) {
      console.error('Error saving activity to localStorage:', error);
    }
  }

  /**
   * Get activities from localStorage
   */
  getActivitiesFromStorage(): Activity[] {
    try {
      const stored = localStorage.getItem(this.ACTIVITIES_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error loading activities from localStorage:', error);
      return [];
    }
  }

  /**
   * Calculate dashboard stats from vehicles
   */
  calculateDashboardStats(vehicles: Vehicle[]): DashboardStats {
    const totalFleetUnits = vehicles.length;

    const statusDistribution = {
      active: vehicles.filter((v) => v.status === 'Active').length,
      maintenance: vehicles.filter((v) => v.status === 'Maintenance').length,
      standby: vehicles.filter((v) => v.status === 'Standby').length,
      critical: vehicles.filter((v) => v.status === 'Critical').length,
    };

    const maintenanceEfficiency =
      statusDistribution.maintenance + statusDistribution.critical;

    const operationalCost = vehicles.reduce((sum, v) => sum + (v.cost || 0), 0);

    const efficiencyIndex =
      vehicles.length > 0
        ? vehicles.reduce((sum, v) => sum + (v.healthScore || 0), 0) /
          vehicles.length
        : 0;

    const utilization =
      totalFleetUnits > 0
        ? ((statusDistribution.active + statusDistribution.maintenance) /
            totalFleetUnits) *
          100
        : 0;

    // Calculate trends (simplified - would need historical data for accurate trends)
    // For now, return 0 trends
    return {
      totalFleetUnits,
      totalFleetUnitsTrend: 0,
      maintenanceEfficiency,
      maintenanceEfficiencyTrend: 0,
      operationalCost,
      operationalCostTrend: 0,
      efficiencyIndex,
      efficiencyIndexTrend: 0,
      statusDistribution,
      utilization,
    };
  }
}
