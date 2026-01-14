import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Vehicle, VehicleStatus } from '../models/vehicle.interface';

interface ColumnMapping {
  vehicleId?: string;
  location?: string;
  workOrderCount?: string;
  daysBetweenWorkOrders?: string;
  cost?: string;
  make?: string;
  model?: string;
  distance?: string;
  [key: string]: string | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class ExcelUploadService {
  private readonly VEHICLE_ID_VARIANTS = [
    'vehicle id',
    'vehicleid',
    'unit number',
    'unit id',
    'vh id',
    'vehicle unit',
    'unit',
  ];

  private readonly LOCATION_VARIANTS = [
    'location',
    'facility',
    'site',
    'city',
    'address',
  ];

  private readonly WORK_ORDERS_VARIANTS = [
    'work orders',
    'workordercount',
    'wo count',
    'maintenance count',
    'work order count',
    'wo',
  ];

  private readonly DAYS_BETWEEN_VARIANTS = [
    'days between',
    'daysbetween',
    'days between work orders',
    'days between wo',
    'maintenance interval',
  ];

  private readonly COST_VARIANTS = [
    'cost',
    'total cost',
    'operational cost',
    'maintenance cost',
    'total',
  ];

  private readonly DISTANCE_VARIANTS = [
    'distance',
    'miles',
    'mileage',
    'total distance',
    'odometer',
  ];

  /**
   * Parse Excel file and extract vehicle data
   */
  async parseExcelFile(file: File): Promise<Vehicle[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          // Get first sheet
          const firstSheetName = workbook.SheetNames[0];
          if (!firstSheetName) {
            reject(new Error('Excel file contains no sheets'));
            return;
          }

          const worksheet = workbook.Sheets[firstSheetName];

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: '',
          });

          if (jsonData.length < 2) {
            reject(new Error('Excel file must contain at least a header row and one data row'));
            return;
          }

          // First row is headers
          const headers = (jsonData[0] as any[]).map((h) =>
            String(h).trim().toLowerCase()
          );

          // Map columns
          const mapping = this.mapColumns(headers);

          // Validate required columns
          if (!mapping.vehicleId) {
            reject(
              new Error(
                'Required column not found. Please ensure your Excel file contains a "Vehicle ID" column (or similar: Unit Number, VH ID, etc.)'
              )
            );
            return;
          }

          // Process data rows (skip header)
          const vehicles: Vehicle[] = [];
          const errors: string[] = [];

          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (!row || row.length === 0) continue;

            try {
              const vehicle = this.transformRowData(row, headers, mapping, i + 1);
              if (vehicle) {
                vehicles.push(vehicle);
              }
            } catch (error: any) {
              errors.push(`Row ${i + 1}: ${error.message || 'Invalid data'}`);
            }
          }

          if (vehicles.length === 0) {
            reject(
              new Error(
                'No valid vehicle data found in Excel file. ' +
                  (errors.length > 0 ? errors.join('; ') : '')
              )
            );
            return;
          }

          if (errors.length > 0) {
            console.warn('Some rows had errors:', errors);
          }

          resolve(vehicles);
        } catch (error: any) {
          reject(
            new Error(
              `Failed to parse Excel file: ${error.message || 'Unknown error'}`
            )
          );
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Map Excel column headers to internal field names
   */
  private mapColumns(headers: string[]): ColumnMapping {
    const mapping: ColumnMapping = {};

    headers.forEach((header, index) => {
      const normalized = header.toLowerCase().trim();

      if (!mapping.vehicleId && this.matchesVariant(normalized, this.VEHICLE_ID_VARIANTS)) {
        mapping.vehicleId = headers[index];
      } else if (
        !mapping.location &&
        this.matchesVariant(normalized, this.LOCATION_VARIANTS)
      ) {
        mapping.location = headers[index];
      } else if (
        !mapping.workOrderCount &&
        this.matchesVariant(normalized, this.WORK_ORDERS_VARIANTS)
      ) {
        mapping.workOrderCount = headers[index];
      } else if (
        !mapping.daysBetweenWorkOrders &&
        this.matchesVariant(normalized, this.DAYS_BETWEEN_VARIANTS)
      ) {
        mapping.daysBetweenWorkOrders = headers[index];
      } else if (
        !mapping.cost &&
        this.matchesVariant(normalized, this.COST_VARIANTS)
      ) {
        mapping.cost = headers[index];
      } else if (
        !mapping.distance &&
        this.matchesVariant(normalized, this.DISTANCE_VARIANTS)
      ) {
        mapping.distance = headers[index];
      }
    });

    return mapping;
  }

  /**
   * Check if a header matches any variant
   */
  private matchesVariant(header: string, variants: string[]): boolean {
    return variants.some((variant) => {
      // Exact match
      if (header === variant) return true;
      // Contains match
      if (header.includes(variant) || variant.includes(header)) return true;
      return false;
    });
  }

  /**
   * Transform a row of Excel data into a Vehicle object
   */
  private transformRowData(
    row: any[],
    headers: string[],
    mapping: ColumnMapping,
    rowNumber: number
  ): Vehicle | null {
    // Get values by column name
    const getValue = (columnName: string | undefined): any => {
      if (!columnName) return null;
      const index = headers.findIndex(
        (h) => h.toLowerCase().trim() === columnName.toLowerCase().trim()
      );
      return index >= 0 ? row[index] : null;
    };

    const vehicleIdValue = getValue(mapping.vehicleId);
    if (!vehicleIdValue || String(vehicleIdValue).trim() === '') {
      return null; // Skip rows without vehicle ID
    }

    const vehicleId = String(vehicleIdValue).trim();

    // Extract other fields
    const location = getValue(mapping.location) || 'Unknown';
    const workOrderCount = this.parseNumber(
      getValue(mapping.workOrderCount),
      0
    );
    const daysBetweenWorkOrders = this.parseNumber(
      getValue(mapping.daysBetweenWorkOrders),
      0
    );
    const cost = this.parseNumber(getValue(mapping.cost), 0);
    const distance = this.parseNumber(getValue(mapping.distance), 0);

    // Calculate status
    const status = this.calculateStatus({
      workOrderCount,
      daysBetweenWorkOrders,
      distance,
    });

    // Calculate health score
    const healthScore = this.calculateHealthScore({
      workOrderCount,
      daysBetweenWorkOrders,
    });

    // Generate ID from vehicleId if not provided
    const id = this.generateId(vehicleId);

    return {
      id,
      vehicleId,
      status,
      healthScore,
      workOrderCount,
      location: String(location).trim(),
      cost,
      companyId: '1', // Default, can be enhanced later
      daysBetweenWorkOrders,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Calculate vehicle status based on metrics
   */
  calculateStatus(vehicle: {
    workOrderCount: number;
    daysBetweenWorkOrders: number;
    distance?: number;
  }): VehicleStatus {
    // Critical: High work orders AND frequent maintenance
    if (
      vehicle.workOrderCount > 15 &&
      vehicle.daysBetweenWorkOrders < 30
    ) {
      return 'Critical';
    }

    // Maintenance: Moderate work orders
    if (
      vehicle.workOrderCount >= 5 &&
      vehicle.workOrderCount <= 15
    ) {
      return 'Maintenance';
    }

    // Standby: Low activity (if distance is available)
    if (vehicle.distance !== undefined && vehicle.distance < 1000) {
      return 'Standby';
    }

    // Default: Active
    return 'Active';
  }

  /**
   * Calculate health score (0-100)
   */
  calculateHealthScore(vehicle: {
    workOrderCount: number;
    daysBetweenWorkOrders: number;
  }): number {
    let score = 100;

    // Deduct 5 points per work order above 3
    if (vehicle.workOrderCount > 3) {
      score -= (vehicle.workOrderCount - 3) * 5;
    }

    // Deduct 10 points if days between is less than 30
    if (vehicle.daysBetweenWorkOrders > 0 && vehicle.daysBetweenWorkOrders < 30) {
      score -= 10;
    }

    // Add bonus points for longer periods between maintenance (max +10)
    if (vehicle.daysBetweenWorkOrders > 30) {
      const bonusDays = vehicle.daysBetweenWorkOrders - 30;
      const bonusPoints = Math.min(Math.floor(bonusDays / 10) * 2, 10);
      score += bonusPoints;
    }

    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Parse number from various formats
   */
  private parseNumber(value: any, defaultValue: number = 0): number {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }

    if (typeof value === 'number') {
      return isNaN(value) ? defaultValue : value;
    }

    // Handle string numbers (including currency)
    const str = String(value).replace(/[^0-9.-]/g, '');
    const num = parseFloat(str);
    return isNaN(num) ? defaultValue : num;
  }

  /**
   * Generate a unique ID from vehicleId
   */
  private generateId(vehicleId: string): string {
    // Use vehicleId as base, sanitize it
    return vehicleId.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
  }
}
