import {
  VehicleDetail,
  VehicleMetrics,
  MaintenanceWorkflow,
  MaintenancePhase,
  LiveFeed,
  ActiveProtocol,
  AssignedTeam,
  TeamMember,
  EfficiencyData,
  EfficiencyDataPoint,
  MaintenanceHistoryEntry,
} from '../models/vehicle.interface';

// Mock Vehicle Detail Data - Vehicle #405 (Ford Transit 2022)
export const mockVehicleDetailData: VehicleDetail[] = [
  {
    id: 'vehicle-405',
    vehicleId: '#405',
    make: 'FORD',
    model: 'TRANSIT',
    year: 2022,
    vinCode: '1FADP5CU8D1234567',
    licensePlate: 'XYZ-9822',
    specifications: ['H-ROOF', 'DIESEL_TURBO'],
    imageUrl: './assets/images/vehicles/ford-transit-2022.png', // Keep for backward compatibility
    imageUrls: [
      './assets/images/vehicles/ford-transit-2022-front.png',
      './assets/images/vehicles/ford-transit-2022-side.png',
      './assets/images/vehicles/ford-transit-2022-rear.png',
      './assets/images/vehicles/ford-transit-2022-interior.png',
      './assets/images/vehicles/ford-transit-2022.png',
    ],
    qrCode: 'QR-VEHICLE-405',
    status: 'Maintenance',
    healthScore: 75,
    location: 'Chicago, IL',
    companyId: '1',
    companyName: 'FleetCorp',
    createdAt: '2022-01-15T00:00:00Z',
    updatedAt: new Date().toISOString(),

    // Metrics
    metrics: {
      vehicleId: '#405',
      odometer: 45230,
      odometerChange: 120,
      fuelLevel: 82,
      powerUnitStatus: 'OPTIMAL',
      powerUnitVoltage: '12.8V STABLE',
      lastServiceDate: '2023-10-12T00:00:00Z',
      lastServiceType: 'Routine Maint.',
      daysSinceLastService: 12,
      lastUpdated: new Date().toISOString(),
    },

    // Maintenance Workflow
    maintenanceWorkflow: {
      vehicleId: '#405',
      currentPhase: 'REPAIR',
      overallProgress: 65,
      startedAt: '2023-10-24T08:00:00Z',
      estimatedCompletion: '2023-10-28T17:00:00Z',
      phases: [
        {
          phase: 'INTAKE',
          status: 'COMPLETE',
          completedAt: '2023-10-24T09:30:00Z',
          completedBy: 'S. Jenkins',
          notes: 'Vehicle received and logged',
        },
        {
          phase: 'DIAGNOSTICS',
          status: 'COMPLETE',
          completedAt: '2023-10-24T14:15:00Z',
          completedBy: 'S. Jenkins',
          notes: 'Full system scan performed. 3 minor issues found and logged.',
        },
        {
          phase: 'REPAIR',
          status: 'IN_PROGRESS',
          progress: 65,
          notes: 'Technician replacing hydraulic line sector 4.',
        },
        {
          phase: 'QC_CHECK',
          status: 'PENDING',
        },
        {
          phase: 'RELEASE',
          status: 'LOCKED',
        },
      ],
    },

    // Active Protocol
    activeProtocol: {
      protocolId: 'PROT-2023-10-24-405',
      vehicleId: '#405',
      protocolName: 'Hydraulic System Repair',
      initiatedDate: '2023-10-24T08:00:00Z',
      targetCompletionDate: '2023-10-28T17:00:00Z',
      estimatedCost: 450.0,
      progress: 65,
      status: 'IN_PROGRESS',
      description: 'Repair and replacement of hydraulic line sector 4',
      completedTasks: 13,
      totalTasks: 20,
    },

    // Assigned Team
    assignedTeam: {
      vehicleId: '#405',
      teamMembers: [
        {
          id: 'tech-001',
          name: 'Sarah Jenkins',
          role: 'LEAD TECH',
          avatarUrl: './assets/images/avatars/sarah-jenkins.png',
          status: 'online',
          lastActive: new Date().toISOString(),
        },
        {
          id: 'mgr-001',
          name: 'Mike Ross',
          role: 'FLEET MANAGER',
          avatarUrl: './assets/images/avatars/mike-ross.png',
          status: 'online',
          lastActive: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
      ],
    },

    // Live Feed
    liveFeed: {
      vehicleId: '#405',
      isLive: true,
      bayNumber: 'BAY 04',
      currentActivity:
        'Technician is currently performing torque calibration on the replaced unit.',
      sessionStartTime: new Date(Date.now() - 42 * 60 * 1000).toISOString(), // 42 minutes ago
      sessionDuration: '00:42:15',
    },
  },
];

// Mock Maintenance History
export const mockMaintenanceHistory: MaintenanceHistoryEntry[] = [
  {
    id: 'hist-001',
    vehicleId: '#405',
    date: '2023-10-12T00:00:00Z',
    operation: 'Oil Change Protocol',
    operator: {
      name: 'S. Jenkins',
      avatarUrl: './assets/images/avatars/sarah-jenkins.png',
    },
    cost: 85.0,
    state: 'DONE',
  },
  {
    id: 'hist-002',
    vehicleId: '#405',
    date: '2023-09-05T00:00:00Z',
    operation: 'Tire Rotation Sequence',
    operator: {
      name: 'M. Ross',
      avatarUrl: './assets/images/avatars/mike-ross.png',
    },
    cost: 45.0,
    state: 'DONE',
  },
  {
    id: 'hist-003',
    vehicleId: '#405',
    date: '2023-08-20T00:00:00Z',
    operation: 'Brake Sys Inspection',
    operator: {
      name: 'S. Jenkins',
      avatarUrl: './assets/images/avatars/sarah-jenkins.png',
    },
    cost: 0.0,
    state: 'PASS',
  },
  {
    id: 'hist-004',
    vehicleId: '#405',
    date: '2023-07-15T00:00:00Z',
    operation: 'Firmware Update v4.2',
    operator: {
      name: 'Sys Admin',
    },
    cost: 0.0,
    state: 'DONE',
  },
];

// Mock Efficiency Data - 30 Days
export const mockEfficiencyData30D: EfficiencyData = {
  vehicleId: '#405',
  period: '30D',
  dataPoints: [
    { date: 'OCT 01', consumption: 85, efficiency: 92 },
    { date: 'OCT 05', consumption: 78, efficiency: 94 },
    { date: 'OCT 10', consumption: 82, efficiency: 91 },
    { date: 'OCT 15', consumption: 75, efficiency: 95 },
    { date: 'OCT 20', consumption: 88, efficiency: 89 },
    { date: 'OCT 25', consumption: 80, efficiency: 93 },
    { date: 'TODAY', consumption: 82, efficiency: 92 },
  ],
};

// Mock Efficiency Data - 6 Months
export const mockEfficiencyData6M: EfficiencyData = {
  vehicleId: '#405',
  period: '6M',
  dataPoints: [
    { date: 'MAY', consumption: 88, efficiency: 90 },
    { date: 'JUN', consumption: 85, efficiency: 92 },
    { date: 'JUL', consumption: 82, efficiency: 93 },
    { date: 'AUG', consumption: 80, efficiency: 94 },
    { date: 'SEP', consumption: 83, efficiency: 92 },
    { date: 'OCT', consumption: 82, efficiency: 92 },
  ],
};

// Mock Efficiency Data - 1 Year
export const mockEfficiencyData1Y: EfficiencyData = {
  vehicleId: '#405',
  period: '1Y',
  dataPoints: [
    { date: 'Q1', consumption: 90, efficiency: 88 },
    { date: 'Q2', consumption: 87, efficiency: 90 },
    { date: 'Q3', consumption: 85, efficiency: 91 },
    { date: 'Q4', consumption: 82, efficiency: 92 },
  ],
};
