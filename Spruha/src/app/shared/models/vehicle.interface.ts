export type VehicleStatus = 'Active' | 'Maintenance' | 'Standby' | 'Critical';

export interface Vehicle {
  id: string;
  vehicleId: string;
  status: VehicleStatus;
  healthScore: number;
  workOrderCount: number;
  location: string;
  cost: number;
  companyId: string;
  companyName?: string;
  daysBetweenWorkOrders?: number;
  lastMaintenanceDate?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
