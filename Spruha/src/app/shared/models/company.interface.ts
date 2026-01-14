export type SystemStatus = 'Optimal' | 'Warning' | 'Alert';

export interface Company {
  id: string;
  name: string;
  entityName: string;
  activeUnits: number;
  maintenanceLoad: number; // percentage
  totalUnits: number;
  systemStatus: SystemStatus;
  efficiency?: number; // percentage
}
