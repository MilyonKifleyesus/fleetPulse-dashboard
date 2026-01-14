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
  // Extended properties for vehicle detail
  make?: string;
  model?: string;
  year?: number;
  vinCode?: string;
  licensePlate?: string;
  specifications?: string[];
  imageUrl?: string; // Deprecated - use imageUrls instead
  imageUrls?: string[]; // Array of vehicle images
  qrCode?: string;
}

// Maintenance Phase Status Types
export type MaintenancePhaseStatus =
  | 'COMPLETE'
  | 'IN_PROGRESS'
  | 'PENDING'
  | 'LOCKED';
export type MaintenancePhaseType =
  | 'INTAKE'
  | 'DIAGNOSTICS'
  | 'REPAIR'
  | 'QC_CHECK'
  | 'RELEASE';

// Maintenance Phase Interface
export interface MaintenancePhase {
  phase: MaintenancePhaseType;
  status: MaintenancePhaseStatus;
  completedAt?: Date | string;
  completedBy?: string;
  notes?: string;
  progress?: number; // Percentage for current phase
}

// Maintenance Workflow Interface
export interface MaintenanceWorkflow {
  vehicleId: string;
  currentPhase: MaintenancePhaseType;
  phases: MaintenancePhase[];
  overallProgress: number; // Percentage 0-100
  startedAt?: Date | string;
  estimatedCompletion?: Date | string;
}

// Vehicle Metrics Interface
export interface VehicleMetrics {
  vehicleId: string;
  odometer: number; // Total miles
  odometerChange: number; // Miles since last cycle
  fuelLevel: number; // Percentage 0-100
  powerUnitStatus: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
  powerUnitVoltage: string; // e.g., "12.8V STABLE"
  lastServiceDate?: Date | string;
  lastServiceType?: string;
  daysSinceLastService: number;
  lastUpdated: Date | string;
}

// Live Feed Interface
export interface LiveFeed {
  vehicleId: string;
  isLive: boolean;
  bayNumber: string; // e.g., "BAY 04"
  currentActivity: string;
  sessionStartTime: Date | string;
  sessionDuration: string; // e.g., "00:42:15"
  streamUrl?: string;
}

// Active Protocol Interface
export interface ActiveProtocol {
  protocolId: string;
  vehicleId: string;
  protocolName: string;
  initiatedDate: Date | string;
  targetCompletionDate: Date | string;
  estimatedCost: number;
  progress: number; // Percentage 0-100
  status: 'IN_PROGRESS' | 'PENDING' | 'COMPLETED' | 'ON_HOLD';
  description?: string;
  completedTasks?: number;
  totalTasks?: number;
}

// Team Member Interface
export interface TeamMember {
  id: string;
  name: string; // e.g., "Sarah Jenkins"
  role: string; // e.g., "LEAD TECH", "FLEET MANAGER"
  avatarUrl?: string;
  status: 'online' | 'offline' | 'busy';
  lastActive?: Date | string;
}

// Assigned Team Interface
export interface AssignedTeam {
  vehicleId: string;
  teamMembers: TeamMember[];
}

// Secure Log Interface
export interface SecureLog {
  id: string;
  vehicleId: string;
  author: string; // e.g., "M. ROSS", "S. JENKINS"
  message: string;
  timestamp: Date | string;
  encrypted: boolean;
}

// Maintenance History Entry Interface
export interface MaintenanceHistoryEntry {
  id: string;
  vehicleId: string;
  date: Date | string;
  operation: string; // e.g., "Oil Change Protocol"
  operator: {
    name: string;
    avatarUrl?: string;
  };
  cost: number;
  state: 'DONE' | 'PASS' | 'FAILED' | 'IN_PROGRESS';
}

// Efficiency Data Point Interface
export interface EfficiencyDataPoint {
  date: string; // e.g., "OCT 01"
  consumption: number;
  efficiency: number;
}

// Efficiency Data Interface
export interface EfficiencyData {
  vehicleId: string;
  period: '30D' | '6M' | '1Y';
  dataPoints: EfficiencyDataPoint[];
}

// Vehicle Detail Interface (Complete vehicle information)
export interface VehicleDetail {
  // Core identification
  id: string;
  vehicleId: string; // e.g., "#405"
  make: string; // e.g., "FORD"
  model: string; // e.g., "TRANSIT"
  year: number; // e.g., 2022
  vinCode: string; // e.g., "1FADP5CU8D..."
  licensePlate: string; // e.g., "XYZ-9822"
  specifications: string[]; // e.g., ["H-ROOF", "DIESEL_TURBO"]
  imageUrl?: string; // Deprecated - use imageUrls instead
  imageUrls?: string[]; // Array of vehicle images for gallery
  qrCode?: string;

  // Status
  status: VehicleStatus;
  healthScore: number;

  // Metrics (real-time)
  metrics: VehicleMetrics;

  // Maintenance workflow
  maintenanceWorkflow?: MaintenanceWorkflow;

  // Active protocol
  activeProtocol?: ActiveProtocol;

  // Team
  assignedTeam?: AssignedTeam;

  // Live feed
  liveFeed?: LiveFeed;

  // Additional metadata
  location?: string;
  companyId?: string;
  companyName?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
