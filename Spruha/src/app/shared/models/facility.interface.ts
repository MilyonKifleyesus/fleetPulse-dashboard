/**
 * Facility Management Interfaces
 * Based on Comprehensive Facility Management Business Logic Guide
 */

// Operational Status Types
export type FacilityStatus =
  | 'Fully Operational'
  | 'Operational with Limitations'
  | 'Partially Operational'
  | 'Non-Operational'
  | 'Under Maintenance'
  | 'Emergency Shutdown';

// Primary Facility Classifications
export type FacilityClassification =
  | 'Office'
  | 'Manufacturing'
  | 'Warehouse/Distribution'
  | 'Retail'
  | 'Data Center'
  | 'Healthcare'
  | 'Educational';

// Size Categories
export type FacilitySizeCategory = 'Small' | 'Medium' | 'Large';

// Criticality Levels
export type FacilityCriticalityLevel = 'Critical' | 'Important' | 'Standard';

// Security Classifications
export type SecurityClassification = 'High' | 'Medium' | 'Low';

// Environmental Requirements
export type EnvironmentalRequirement = 'Climate-controlled' | 'Standard' | 'Industrial';

// Ownership Types
export type OwnershipType = 'Owned' | 'Leased' | 'Managed';

// Capacity Metrics
export interface FacilityCapacity {
  totalArea: number; // Square feet/meters
  occupiedSpace: number;
  spaceUtilization: number; // Percentage: (Occupied Space / Total Available Space) × 100
  maxOccupancy: number;
  currentOccupants: number;
  occupancyRate: number; // Percentage: (Current Occupants / Maximum Capacity) × 100
  resourceEfficiency: number; // Percentage: (Actual Output / Theoretical Maximum Output) × 100
  electricalCapacity?: number; // kW available
  electricalConsumed?: number; // kW consumed
  hvacCapacity?: number; // BTU/hour
  networkBandwidth?: number; // Mbps available
  networkUtilized?: number; // Mbps utilized
}

// Performance KPIs
export interface FacilityKPIs {
  oee?: number; // Overall Equipment Effectiveness
  uptimePercentage: number; // Facility uptime (Target: >99.5%)
  avgResponseTime?: number; // Average response time to issues (minutes)
  preventiveMaintenanceCompliance?: number; // Percentage (Target: >95%)
  safetyIncidentRate?: number; // Incidents per 100,000 hours (Target: <0.5)
  costPerSquareFoot?: number;
  maintenanceCostAsPercentOfValue?: number; // Percentage (Target: <3%)
  energyCostPerSquareFoot?: number;
  energyConsumptionPerSquareFoot?: number; // kWh/sq ft/year
  waterUsageEfficiency?: number; // Gallons per occupant per day
  wasteDiversionRate?: number; // Percentage (Target: >75%)
  carbonFootprint?: number; // CO2 equivalent per sq ft
}

// Location Information
export interface FacilityLocation {
  address: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Core Facility Interface
export interface Facility {
  id: string;
  facilityId: string; // Format: FAC-[Location Code]-[Sequential Number]
  name: string;
  location: FacilityLocation;
  primaryFunction: string;
  classification: FacilityClassification;
  sizeCategory: FacilitySizeCategory;
  criticalityLevel: FacilityCriticalityLevel;
  securityClassification?: SecurityClassification;
  environmentalRequirements?: EnvironmentalRequirement;
  ownershipType: OwnershipType;
  operationalStatus: FacilityStatus;
  capacity: FacilityCapacity;
  kpis: FacilityKPIs;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  lastMaintenanceDate?: Date | string;
  nextScheduledMaintenance?: Date | string;
}

// Activity/Event Types
export type FacilityActivityType =
  | 'system_startup'
  | 'system_shutdown'
  | 'capacity_threshold_breach'
  | 'equipment_status_change'
  | 'access_control_event'
  | 'scheduled_maintenance'
  | 'emergency_repair'
  | 'equipment_replacement'
  | 'system_upgrade'
  | 'safety_incident'
  | 'security_breach'
  | 'emergency_evacuation'
  | 'compliance_inspection'
  | 'temperature_excursion'
  | 'power_outage'
  | 'water_leak'
  | 'air_quality_issue'
  | 'status_change'
  | 'maintenance_completed'
  | 'capacity_alert';

// Activity Impact Classification
export type ActivityImpactLevel = 'Critical' | 'High' | 'Medium' | 'Low';

// Facility Activity Interface
export interface FacilityActivity {
  id: string;
  type: FacilityActivityType;
  title: string;
  description: string;
  facilityId: string;
  facilityName?: string;
  timestamp: Date | string;
  duration?: number; // Hours affected
  impactLevel: ActivityImpactLevel;
  impactScore?: number; // (Severity × Duration × Scope) / 100
  location?: string; // Location within facility
  personnelInvolved?: string[];
  resolutionTime?: number; // Hours to resolve
  resolvedAt?: Date | string;
  icon?: string;
}

// Dashboard Statistics Interface
export interface FacilityDashboardStats {
  totalFacilities: number;
  totalFacilitiesTrend: number; // Percentage change
  operationalFacilities: number;
  operationalFacilitiesTrend: number; // Percentage change
  averageCapacityUtilization: number; // Percentage
  averageCapacityUtilizationTrend: number; // Percentage change
  criticalIssuesCount: number;
  criticalIssuesTrend: number; // Percentage change
  statusDistribution: {
    fullyOperational: number;
    operationalWithLimitations: number;
    partiallyOperational: number;
    nonOperational: number;
    underMaintenance: number;
    emergencyShutdown: number;
  };
  classificationDistribution: {
    office: number;
    manufacturing: number;
    warehouse: number;
    retail: number;
    dataCenter: number;
    healthcare: number;
    educational: number;
  };
  averageUptime: number; // Percentage
  averageOEE?: number; // Overall Equipment Effectiveness
  totalCapacityUtilization: number; // Overall capacity utilization percentage
}

// Historical Data Point
export interface FacilityHistoricalDataPoint {
  period: string;
  totalFacilities: number;
  operationalFacilities: number;
  averageUtilization: number;
  criticalIssues: number;
}

// Historical Data
export interface FacilityHistoricalData {
  dataPoints: FacilityHistoricalDataPoint[];
}

// Utilization Threshold Zone
export type UtilizationZone = 'Green' | 'Yellow' | 'Red' | 'Blue';

// Facility with Alert Status
export interface FacilityAlert {
  facilityId: string;
  facilityName: string;
  alertType: 'capacity' | 'status' | 'critical_issue' | 'maintenance_due';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  message: string;
  timestamp: Date | string;
  acknowledged: boolean;
}

// Unit Status Types
export type UnitStatus = 'IN SERVICE' | 'MAINTENANCE' | 'STANDBY' | 'REPAIR';

// Unit Interface
export interface Unit {
  id: string;
  unitId: string; // Format: "#9422"
  model: string; // e.g., "TX-INTERCEPTOR", "HAULER V3"
  status: UnitStatus;
  battery: number; // Percentage 0-100
  assignedStaff: string; // e.g., "Elena Vance", "System Auto", "EMERGENCY CREW"
  lastMaintenance?: Date | string; // Date/time or null
  facilityId: string;
}

// Facility Telemetry Interface
export interface FacilityTelemetry {
  uptime: number; // Percentage
  demand: 'HIGH' | 'NORMAL' | 'LOW';
  demandTrend?: 'increasing' | 'stable' | 'decreasing';
  lastUpdated: Date | string;
}

// Facility Resource Interface
export interface FacilityResource {
  availableBays: number;
  totalBays: number;
  energyConsumption: number; // Percentage 0-100
  criticalParts: CriticalPart[];
}

// Critical Part Interface
export interface CriticalPart {
  name: string; // e.g., "HE-Cores (M3)", "Optical Sensors"
  quantity: number;
  status: 'Low' | 'Normal' | 'Warning' | 'Critical';
  threshold?: number; // Minimum quantity before status change
}

// Performance Metrics Data Point
export interface PerformanceMetricsPoint {
  time: string; // Format: "HH:mm"
  fleetUptime: number; // Percentage
  energyLoad: number; // Percentage
  maintenance: number; // Hours or count
}

// Performance Metrics Interface
export interface PerformanceMetrics {
  dataPoints: PerformanceMetricsPoint[];
  currentTime: string; // Format: "HH:mm"
  period: '24h' | '7d' | '30d';
}

// Facility Operations Data Interface
export interface FacilityOperationsData {
  facility: Facility;
  totalUnits: number;
  activeUnits: number;
  idleUnits: number;
  criticalAlerts: number;
  healthScore: number; // Percentage 0-100
  telemetry: FacilityTelemetry;
  resources: FacilityResource;
  performanceMetrics: PerformanceMetrics;
  units: Unit[];
  activities: FacilityActivity[];
  sector?: string; // e.g., "SECTOR 7-G"
  networkNode?: string; // e.g., "FP-CHI-84"
}