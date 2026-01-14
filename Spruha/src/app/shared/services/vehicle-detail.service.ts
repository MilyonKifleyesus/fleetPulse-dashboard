import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import {
  VehicleDetail,
  VehicleMetrics,
  MaintenanceWorkflow,
  MaintenanceHistoryEntry,
  EfficiencyData,
  SecureLog,
} from '../models/vehicle.interface';
import {
  mockVehicleDetailData,
  mockMaintenanceHistory,
  mockEfficiencyData30D,
  mockEfficiencyData6M,
  mockEfficiencyData1Y,
} from '../data/vehicle-detail-data';

@Injectable({
  providedIn: 'root',
})
export class VehicleDetailService {
  // localStorage keys
  private readonly VEHICLE_DETAIL_KEY = 'fleetpulse-vehicle-detail';

  constructor() {}

  /**
   * Get complete vehicle detail data
   */
  getVehicleDetail(vehicleId: string): Observable<VehicleDetail> {
    try {
      // Normalize vehicle ID (handle with or without #)
      const normalizedId = vehicleId.startsWith('#')
        ? vehicleId
        : `#${vehicleId}`;
      // In a real implementation, this would fetch from an API
      // For now, use mock data filtered by vehicleId
      const mockData = mockVehicleDetailData.find(
        (data) =>
          data.vehicleId === normalizedId ||
          data.vehicleId === vehicleId ||
          data.id === normalizedId ||
          data.id === vehicleId
      );

      if (!mockData) {
        return throwError(() => new Error(`Vehicle ${vehicleId} not found`));
      }

      return of(mockData).pipe(
        delay(100), // Simulate network delay
        catchError((error) => {
          console.error('Error fetching vehicle detail:', error);
          return throwError(
            () =>
              new Error('Failed to load vehicle detail data. Please try again.')
          );
        })
      );
    } catch (error: any) {
      return throwError(
        () => new Error('Failed to load vehicle detail data. Please try again.')
      );
    }
  }

  /**
   * Get vehicle metrics (real-time)
   */
  getVehicleMetrics(vehicleId: string): Observable<VehicleMetrics> {
    return this.getVehicleDetail(vehicleId).pipe(
      delay(100),
      map((data: VehicleDetail) => data.metrics),
      catchError((error) =>
        throwError(() => new Error('Failed to load vehicle metrics'))
      )
    );
  }

  /**
   * Get maintenance workflow status
   */
  getMaintenanceWorkflow(
    vehicleId: string
  ): Observable<MaintenanceWorkflow | null> {
    return this.getVehicleDetail(vehicleId).pipe(
      delay(100),
      map((data: VehicleDetail) => data.maintenanceWorkflow || null),
      catchError(() => of(null))
    );
  }

  /**
   * Get maintenance history
   */
  getMaintenanceHistory(
    vehicleId: string
  ): Observable<MaintenanceHistoryEntry[]> {
    // In a real implementation, this would fetch from an API
    // For now, return mock data filtered by vehicleId
    try {
      const stored = localStorage.getItem(
        `${this.VEHICLE_DETAIL_KEY}-${vehicleId}-history`
      );
      if (stored) {
        const history = JSON.parse(stored);
        return of(history).pipe(delay(100));
      }

      // Return mock data if available
      const normalizedId = vehicleId.startsWith('#')
        ? vehicleId
        : `#${vehicleId}`;
      const mockHistory = mockMaintenanceHistory.filter(
        (entry) =>
          entry.vehicleId === normalizedId || entry.vehicleId === vehicleId
      );
      return of(mockHistory).pipe(delay(100));
    } catch (error) {
      return of([]).pipe(delay(100));
    }
  }

  /**
   * Get efficiency data for a specific period
   */
  getEfficiencyData(
    vehicleId: string,
    period: '30D' | '6M' | '1Y'
  ): Observable<EfficiencyData> {
    // In a real implementation, this would fetch from an API
    // For now, return mock data
    try {
      const stored = localStorage.getItem(
        `${this.VEHICLE_DETAIL_KEY}-${vehicleId}-efficiency-${period}`
      );
      if (stored) {
        const data = JSON.parse(stored);
        return of(data).pipe(delay(100));
      }

      // Return mock data based on period
      let mockData: EfficiencyData;
      if (period === '30D') {
        mockData = { ...mockEfficiencyData30D, vehicleId };
      } else if (period === '6M') {
        mockData = { ...mockEfficiencyData6M, vehicleId };
      } else {
        mockData = { ...mockEfficiencyData1Y, vehicleId };
      }
      return of(mockData).pipe(delay(100));
    } catch (error) {
      const defaultData: EfficiencyData = {
        vehicleId,
        period,
        dataPoints: [],
      };
      return of(defaultData).pipe(delay(100));
    }
  }

  /**
   * Add a secure log entry
   */
  addSecureLog(vehicleId: string, message: string): Observable<void> {
    try {
      const log: SecureLog = {
        id: `log-${Date.now()}`,
        vehicleId,
        author: 'CURRENT_USER', // In real app, get from auth service
        message,
        timestamp: new Date(),
        encrypted: true,
      };

      // Store in localStorage
      const key = `${this.VEHICLE_DETAIL_KEY}-${vehicleId}-logs`;
      const existing = localStorage.getItem(key);
      const logs: SecureLog[] = existing ? JSON.parse(existing) : [];
      logs.unshift(log); // Add to beginning
      localStorage.setItem(key, JSON.stringify(logs.slice(0, 20))); // Keep last 20

      return of(undefined).pipe(delay(200));
    } catch (error) {
      return throwError(() => new Error('Failed to add secure log'));
    }
  }

  /**
   * Get secure logs
   */
  getSecureLogs(vehicleId: string): Observable<SecureLog[]> {
    try {
      const key = `${this.VEHICLE_DETAIL_KEY}-${vehicleId}-logs`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const logs = JSON.parse(stored);
        return of(logs).pipe(delay(100));
      }
      return of([]).pipe(delay(100));
    } catch (error) {
      return of([]).pipe(delay(100));
    }
  }

  /**
   * Schedule a service for a vehicle
   */
  scheduleService(vehicleId: string, serviceData: any): Observable<void> {
    // In a real implementation, this would call an API
    // For now, just simulate success
    return of(undefined).pipe(delay(500));
  }
}
