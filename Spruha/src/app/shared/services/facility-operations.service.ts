import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import {
  FacilityOperationsData,
  Unit,
  FacilityTelemetry,
  FacilityResource,
  PerformanceMetrics,
  FacilityActivity,
  Facility,
} from '../models/facility.interface';
import { mockFacilityOperationsData } from '../data/facility-operations-data';

@Injectable({
  providedIn: 'root',
})
export class FacilityOperationsService {
  // localStorage keys
  private readonly FACILITY_OPERATIONS_KEY = 'fleetpulse-facility-operations';

  constructor() {}

  /**
   * Get facility operations data for a specific facility
   */
  getFacilityOperations(
    facilityId: string
  ): Observable<FacilityOperationsData> {
    try {
      // In a real implementation, this would fetch from an API
      // For now, use mock data filtered by facilityId
      const mockData = mockFacilityOperationsData.find(
        (data) => data.facility.facilityId === facilityId
      );

      if (!mockData) {
        return throwError(
          () => new Error(`Facility ${facilityId} not found`)
        );
      }

      return of(mockData).pipe(
        delay(100), // Simulate network delay
        catchError((error) => {
          console.error('Error fetching facility operations:', error);
          return throwError(
            () =>
              new Error(
                'Failed to load facility operations data. Please try again.'
              )
          );
        })
      );
    } catch (error: any) {
      return throwError(
        () =>
          new Error(
            'Failed to load facility operations data. Please try again.'
          )
      );
    }
  }

  /**
   * Get units for a specific facility
   */
  getFacilityUnits(facilityId: string): Observable<Unit[]> {
    return this.getFacilityOperations(facilityId).pipe(
      delay(100),
      catchError(() => of([]))
    );
  }

  /**
   * Get facility resources
   */
  getFacilityResources(facilityId: string): Observable<FacilityResource> {
    return this.getFacilityOperations(facilityId).pipe(
      delay(100),
      catchError(() =>
        throwError(
          () => new Error('Failed to load facility resources')
        )
      )
    );
  }

  /**
   * Get facility telemetry
   */
  getFacilityTelemetry(facilityId: string): Observable<FacilityTelemetry> {
    return this.getFacilityOperations(facilityId).pipe(
      delay(100),
      catchError(() =>
        throwError(
          () => new Error('Failed to load facility telemetry')
        )
      )
    );
  }

  /**
   * Get facility activity log
   */
  getFacilityActivityLog(
    facilityId: string
  ): Observable<FacilityActivity[]> {
    return this.getFacilityOperations(facilityId).pipe(
      delay(100),
      catchError(() => of([]))
    );
  }

  /**
   * Get facility performance metrics
   */
  getFacilityPerformanceMetrics(
    facilityId: string
  ): Observable<PerformanceMetrics> {
    return this.getFacilityOperations(facilityId).pipe(
      delay(100),
      catchError(() =>
        throwError(
          () => new Error('Failed to load performance metrics')
        )
      )
    );
  }

  /**
   * Generate report for facility
   */
  generateReport(facilityId: string): Observable<Blob> {
    // In a real implementation, this would call an API to generate a PDF/Excel report
    // For now, return a mock blob
    const mockReport = new Blob(['Mock Report Data'], {
      type: 'application/pdf',
    });
    return of(mockReport).pipe(delay(500));
  }
}
