export type ActivityType =
  | 'status_change'
  | 'vehicle_added'
  | 'excel_import'
  | 'health_score_alert'
  | 'maintenance_scheduled'
  | 'maintenance_completed'
  | 'capacity_alert';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  vehicleId?: string;
  facilityId?: string;
  timestamp: Date | string;
  icon?: string;
}
