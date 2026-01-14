import {
  FacilityOperationsData,
  Unit,
  FacilityTelemetry,
  FacilityResource,
  PerformanceMetrics,
  FacilityActivity,
  Facility,
} from '../models/facility.interface';
import { mockFacilities } from './facility-dashboard-data';

// Mock Facility Operations Data - North Logistics Hub
const northLogisticsHub: Facility = {
  id: 'north-logistics-hub',
  facilityId: 'FAC-CHI-LOG-001',
  name: 'North Logistics Hub',
  location: {
    address: '789 Logistics Way',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    zipCode: '60601',
    gpsCoordinates: { latitude: 41.8781, longitude: -87.6298 },
  },
  primaryFunction: 'Logistics and Distribution',
  classification: 'Warehouse/Distribution',
  sizeCategory: 'Large',
  criticalityLevel: 'Critical',
  securityClassification: 'High',
  environmentalRequirements: 'Standard',
  ownershipType: 'Owned',
  operationalStatus: 'Fully Operational',
  capacity: {
    totalArea: 300000,
    occupiedSpace: 276900,
    spaceUtilization: 92.3,
    maxOccupancy: 200,
    currentOccupants: 185,
    occupancyRate: 92.5,
    resourceEfficiency: 88,
    electricalCapacity: 3000,
    electricalConsumed: 2640, // 88% of capacity
  },
  kpis: {
    uptimePercentage: 98.4,
    avgResponseTime: 35,
    preventiveMaintenanceCompliance: 94,
    safetyIncidentRate: 0.5,
    costPerSquareFoot: 28,
    maintenanceCostAsPercentOfValue: 2.2,
    energyCostPerSquareFoot: 2.8,
  },
  createdAt: '2019-03-20T00:00:00Z',
  updatedAt: new Date().toISOString(),
  lastMaintenanceDate: '2024-10-20T00:00:00Z',
  nextScheduledMaintenance: '2025-01-20T00:00:00Z',
};

// Mock Units Data
const mockUnits: Unit[] = [
  {
    id: '1',
    unitId: '#9422',
    model: 'TX-INTERCEPTOR',
    status: 'IN SERVICE',
    battery: 92,
    assignedStaff: 'Elena Vance',
    lastMaintenance: '2029-11-28T14:30:00Z',
    facilityId: 'FAC-CHI-LOG-001',
  },
  {
    id: '2',
    unitId: '#8812',
    model: 'HAULER V3',
    status: 'MAINTENANCE',
    battery: 45,
    assignedStaff: 'Markos Chen',
    lastMaintenance: '2030-01-12T08:15:00Z',
    facilityId: 'FAC-CHI-LOG-001',
  },
  {
    id: '3',
    unitId: '#7103',
    model: 'COURIER-LITE',
    status: 'STANDBY',
    battery: 100,
    assignedStaff: 'System Auto',
    lastMaintenance: '2030-01-14T11:22:00Z',
    facilityId: 'FAC-CHI-LOG-001',
  },
  {
    id: '4',
    unitId: '#2019',
    model: 'HEAVY HAULER',
    status: 'REPAIR',
    battery: 12,
    assignedStaff: 'EMERGENCY CREW',
    lastMaintenance: undefined,
    facilityId: 'FAC-CHI-LOG-001',
  },
  // Add more units to reach 128 total (reduced for performance)
  ...Array.from({ length: 24 }, (_, i) => ({
    id: `unit-${i + 5}`,
    unitId: `#${String(1000 + i).padStart(4, '0')}`,
    model: ['TX-INTERCEPTOR', 'HAULER V3', 'COURIER-LITE', 'HEAVY HAULER'][
      i % 4
    ],
    status: ['IN SERVICE', 'STANDBY', 'MAINTENANCE', 'REPAIR'][
      Math.floor(Math.random() * 4)
    ] as Unit['status'],
    battery: Math.floor(Math.random() * 100),
    assignedStaff:
      i % 3 === 0
        ? 'System Auto'
        : i % 5 === 0
        ? 'EMERGENCY CREW'
        : `Staff Member ${i}`,
    lastMaintenance:
      i % 10 === 0
        ? undefined
        : new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
    facilityId: 'FAC-CHI-LOG-001',
  })),
];

// Mock Telemetry
const mockTelemetry: FacilityTelemetry = {
  uptime: 98.4,
  demand: 'HIGH',
  demandTrend: 'increasing',
  lastUpdated: new Date().toISOString(),
};

// Mock Resources
const mockResources: FacilityResource = {
  availableBays: 14,
  totalBays: 20,
  energyConsumption: 88,
  criticalParts: [
    {
      name: 'HE-Cores (M3)',
      quantity: 2,
      status: 'Low',
      threshold: 5,
    },
    {
      name: 'Optical Sensors',
      quantity: 45,
      status: 'Normal',
      threshold: 20,
    },
    {
      name: 'Hydraulic Fluid',
      quantity: 8,
      status: 'Warning',
      threshold: 10,
    },
    {
      name: 'Brake Pads (Set)',
      quantity: 15,
      status: 'Normal',
      threshold: 10,
    },
    {
      name: 'Battery Cells',
      quantity: 3,
      status: 'Low',
      threshold: 5,
    },
  ],
};

// Generate 24-hour performance metrics - STATIC DATA to prevent infinite loops
const generate24HourMetrics = (): PerformanceMetrics => {
  // Use fixed seed-based values instead of Math.random() to prevent infinite recalculations
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = `${String(currentHour).padStart(2, '0')}:${String(
    currentMinute
  ).padStart(2, '0')}`;

  // Static data points - no random values
  const dataPoints: PerformanceMetrics['dataPoints'] = [
    { time: '00:00', fleetUptime: 92, energyLoad: 45, maintenance: 5 },
    { time: '04:00', fleetUptime: 91, energyLoad: 42, maintenance: 8 },
    { time: '08:00', fleetUptime: 94, energyLoad: 68, maintenance: 12 },
    { time: '12:00', fleetUptime: 95, energyLoad: 75, maintenance: 15 },
    { time: '16:00', fleetUptime: 93, energyLoad: 72, maintenance: 10 },
    { time: '20:00', fleetUptime: 92, energyLoad: 55, maintenance: 7 },
    { time: '24:00', fleetUptime: 91, energyLoad: 48, maintenance: 6 },
  ];

  return {
    dataPoints,
    currentTime,
    period: '24h',
  };
};

// Mock Activity Log
const mockActivities: FacilityActivity[] = [
  {
    id: 'act-1',
    type: 'equipment_status_change',
    title: 'Unit #9422 docked for recharge',
    description: 'Unit #9422 docked for recharge',
    facilityId: 'FAC-CHI-LOG-001',
    facilityName: 'North Logistics Hub',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    impactLevel: 'Low',
    location: 'Bay A-1',
  },
  {
    id: 'act-2',
    type: 'maintenance_completed',
    title: 'Maintenance bypass initiated',
    description: 'Maintenance bypass initiated',
    facilityId: 'FAC-CHI-LOG-001',
    facilityName: 'North Logistics Hub',
    timestamp: new Date(Date.now() - 19 * 60 * 1000).toISOString(), // 19 minutes ago
    impactLevel: 'Medium',
    personnelInvolved: ['SysAdmin'],
  },
  {
    id: 'act-3',
    type: 'equipment_status_change',
    title: 'Critical sensor failure detected',
    description: 'Critical sensor failure detected',
    facilityId: 'FAC-CHI-LOG-001',
    facilityName: 'North Logistics Hub',
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(), // 42 minutes ago
    impactLevel: 'Critical',
    location: 'Sect 4B',
  },
  {
    id: 'act-4',
    type: 'system_startup',
    title: 'Inventory sync complete',
    description: 'Inventory sync complete',
    facilityId: 'FAC-CHI-LOG-001',
    facilityName: 'North Logistics Hub',
    timestamp: new Date(Date.now() - 62 * 60 * 1000).toISOString(), // 62 minutes ago
    impactLevel: 'Low',
    personnelInvolved: ['GlobalDB'],
  },
  {
    id: 'act-5',
    type: 'scheduled_maintenance',
    title: 'Routine maintenance completed on Unit #8812',
    description: 'Routine maintenance completed on Unit #8812',
    facilityId: 'FAC-CHI-LOG-001',
    facilityName: 'North Logistics Hub',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    impactLevel: 'Low',
    location: 'Bay B-3',
    personnelInvolved: ['Markos Chen'],
  },
  {
    id: 'act-6',
    type: 'equipment_status_change',
    title: 'Unit #7103 moved to standby',
    description: 'Unit #7103 moved to standby',
    facilityId: 'FAC-CHI-LOG-001',
    facilityName: 'North Logistics Hub',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    impactLevel: 'Low',
  },
];

// Calculate KPIs from units
const calculateKPIs = (units: Unit[]) => {
  const totalUnits = units.length;
  const activeUnits = units.filter((u) => u.status === 'IN SERVICE').length;
  const idleUnits = units.filter((u) => u.status === 'STANDBY').length;
  const criticalAlerts = units.filter((u) => u.status === 'REPAIR').length;
  const healthScore = Math.round(
    (units.reduce((sum, u) => sum + u.battery, 0) / totalUnits) * 0.6 +
      (activeUnits / totalUnits) * 40
  );

  return {
    totalUnits,
    activeUnits,
    idleUnits,
    criticalAlerts,
    healthScore: Math.min(100, Math.max(0, healthScore)),
  };
};

// Calculate KPIs - use actual counts for better performance
const kpis = {
  totalUnits: 28, // Reduced from 128 for performance
  activeUnits: 20,
  idleUnits: 5,
  criticalAlerts: 3,
  healthScore: 92,
};

// Create Facility Operations Data
// Generate operations data for ALL facilities in mockFacilities
export const mockFacilityOperationsData: FacilityOperationsData[] =
  mockFacilities.map((facility) => {
    // Generate facility-specific units (28 units per facility for performance)
    const facilityUnits = Array.from({ length: 28 }, (_, i) => {
      const baseUnit = mockUnits[i % mockUnits.length];
      return {
        ...baseUnit,
        id: `${facility.id}-unit-${i + 1}`,
        unitId: `#${String(1000 + i + facility.id.charCodeAt(0)).padStart(
          4,
          '0'
        )}`,
        facilityId: facility.facilityId,
      };
    });

    const facilityKPIs = calculateKPIs(facilityUnits);

    // Generate facility-specific activities
    const facilityActivities = mockActivities.slice(0, 6).map((a, index) => ({
      ...a,
      id: `${facility.id}-act-${index + 1}`,
      facilityId: facility.facilityId,
      facilityName: facility.name,
      timestamp: new Date(
        Date.now() - (index + 1) * 15 * 60 * 1000
      ).toISOString(),
    }));

    return {
      facility,
      ...facilityKPIs,
      telemetry: {
        ...mockTelemetry,
        uptime: facility.kpis.uptimePercentage || 98.4,
        demand: facility.capacity.spaceUtilization > 85 ? 'HIGH' : 'NORMAL',
        demandTrend:
          facility.capacity.spaceUtilization > 80 ? 'increasing' : 'stable',
      },
      resources: {
        ...mockResources,
        availableBays: Math.max(
          5,
          Math.floor(facility.capacity.maxOccupancy / 10)
        ),
        totalBays: Math.floor(facility.capacity.maxOccupancy / 10),
        energyConsumption: Math.round(
          ((facility.capacity.electricalConsumed || 0) /
            (facility.capacity.electricalCapacity || 1)) *
            100
        ),
      },
      performanceMetrics: generate24HourMetrics(),
      units: facilityUnits,
      activities: facilityActivities,
      sector: `SECTOR ${facility.id.charCodeAt(0) % 10}-${String.fromCharCode(
        65 + (facility.id.charCodeAt(0) % 26)
      )}`,
      networkNode: `FP-${facility.location.city
        .substring(0, 3)
        .toUpperCase()}-${facility.id.charCodeAt(0) % 100}`,
    };
  });
