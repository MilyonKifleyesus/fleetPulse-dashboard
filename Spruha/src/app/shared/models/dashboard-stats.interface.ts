export interface DashboardStats {
  totalFleetUnits: number;
  totalFleetUnitsTrend: number; // percentage change
  maintenanceEfficiency: number; // count of vehicles in maintenance
  maintenanceEfficiencyTrend: number; // percentage change
  operationalCost: number;
  operationalCostTrend: number; // percentage change
  efficiencyIndex: number; // average health score
  efficiencyIndexTrend: number; // percentage change
  statusDistribution: {
    active: number;
    maintenance: number;
    standby: number;
    critical: number;
  };
  utilization: number; // percentage: (Active + Maintenance) / Total
}

export interface HistoricalDataPoint {
  period: string; // month or date label
  activeVehicles: number;
  vehiclesInService: number; // Active + Maintenance
}

export interface HistoricalData {
  dataPoints: HistoricalDataPoint[];
  period: '30d' | 'quarter' | 'year';
}
