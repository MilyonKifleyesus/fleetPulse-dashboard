/**
 * War Room Dashboard Interfaces
 * Data models for the Tactical Green War Room Command Center
 */

// Node Types
export type NodeType = 'Hub' | 'Facility' | 'Center' | 'Terminal';
export type NodeStatus = 'OPTIMAL' | 'ONLINE' | 'ACTIVE' | 'OFFLINE';

// Hub Status Types
export type HubStatus = 'OPTIMAL' | 'ONLINE' | 'ACTIVE' | 'OFFLINE';

// Activity Log Status Types
export type ActivityStatus = 'ACTIVE' | 'INFO' | 'WARNING' | 'ERROR';

// Satellite Types
export type SatelliteType = 'GEO' | 'LEO' | 'MEO';
export type SatelliteConnectionStatus = 'LOCKED' | 'ACQUIRING' | 'OFFLINE';

/**
 * Geographic Node - Represents a location on the map
 */
export interface Node {
  id: string;
  name: string;
  company: string;
  companyId: string;
  city: string;
  country?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  type: NodeType;
  status: NodeStatus;
  isHub?: boolean;
  hubCode?: string;
}

/**
 * Hub - Operational hub with status and capacity
 */
export interface Hub {
  id: string;
  code: string; // e.g., 'NJN', 'PRM', 'IND'
  companyId: string;
  companyName: string;
  status: HubStatus;
  capacity: string; // e.g., 'MAX FLOW', '78% CAP', '84% CAP'
  capacityPercentage?: number;
  statusColor: string; // CSS class or color value
  capColor: string; // CSS class or color value
}

/**
 * Activity Log Entry - Operational event log
 */
export interface ActivityLog {
  id: string;
  timestamp: Date | string;
  company: string;
  companyId: string;
  status: ActivityStatus;
  title: string; // e.g., "TAM | NANJING, CHINA"
  description: string; // e.g., "PEAK EFFICIENCY // LOAD BALANCING COMPLETE"
  location?: string;
  logo?: string | ArrayBuffer; // Company logo (base64 or data URL)
}

/**
 * Network Metrics - Real-time network performance data
 */
export interface NetworkMetrics {
  dataFlowIntegrity: number; // Percentage (0-100)
  fleetSyncRate: number; // Active units count
  networkLatency: number; // Milliseconds
  latencyChange?: number; // Change from previous measurement
  nodeDensity: number; // Percentage (0-100)
  encryptionProtocol: string; // e.g., "QUANTUM-X"
  encryptionStatus: string; // e.g., "ACTIVE"
}

/**
 * Network Throughput - Bar chart data
 */
export interface NetworkThroughput {
  bars: number[]; // Array of bar heights (0-100)
  channelStatus: string; // e.g., "L-CHANNEL: ACTIVE"
  throughput: string; // e.g., "4.8 GBPS"
}

/**
 * Satellite Status - Connection status for satellite links
 */
export interface SatelliteStatus {
  id: string;
  name: string; // e.g., "SAT-01"
  type: SatelliteType;
  status: SatelliteConnectionStatus;
}

/**
 * Geopolitical Heatmap - Activity density grid
 */
export interface GeopoliticalHeatmap {
  grid: number[][]; // 2D array of activity density values (0-100)
  rows: number;
  cols: number;
}

/**
 * Quantum Chart Data - Historical stability data
 */
export interface QuantumChartData {
  dataPoints: number[]; // Array of 6 values (0-100)
  highlightedIndex?: number; // Index of highlighted bar
}

/**
 * Company Data - Company-specific information
 */
export interface CompanyData {
  id: string;
  name: string;
  hubs: Hub[];
  quantumChart: QuantumChartData;
}

/**
 * Transit Route - Connection path between nodes
 */
export interface TransitRoute {
  id: string;
  from: string; // Node ID or name
  to: string; // Node ID or name
  fromCoordinates: {
    latitude: number;
    longitude: number;
  };
  toCoordinates: {
    latitude: number;
    longitude: number;
  };
  animated?: boolean; // Whether to show animated chevrons
  strokeColor?: string; // Line color
  strokeWidth?: number;
}

/**
 * War Room Dashboard State - Complete dashboard state
 */
export interface WarRoomState {
  nodes: Node[];
  transitRoutes: TransitRoute[];
  activityLogs: ActivityLog[];
  networkMetrics: NetworkMetrics;
  networkThroughput: NetworkThroughput;
  geopoliticalHeatmap: GeopoliticalHeatmap;
  satelliteStatuses: SatelliteStatus[];
  companies: CompanyData[];
  selectedCompanyId: string | null;
}
