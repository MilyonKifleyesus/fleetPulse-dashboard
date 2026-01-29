import {
  Node,
  Hub,
  ActivityLog,
  NetworkMetrics,
  NetworkThroughput,
  GeopoliticalHeatmap,
  SatelliteStatus,
  CompanyData,
  TransitRoute,
  WarRoomState,
} from '../models/war-room.interface';

/**
 * Mock data for War Room Dashboard
 * Based on the HTML mockup provided
 */

// Company IDs
const COMPANY_IDS = {
  TAM: 'tam',
  CREATIVE: 'creative',
  ARBOC: 'arboc',
  NFL: 'nfl',
  NOVA: 'nova',
  ALEXANDER: 'alexander',
  KARSAN: 'karsan',
};

const COMPANY_LOGOS = {
  TAM: '/assets/images/tam-logo.png',
  CREATIVE: '/assets/images/creative-carriage-logo.png',
  ARBOC: '/assets/images/ARBOC.jpg',
  NFL: '/assets/images/New-Flyer.jpg',
  NOVA: '/assets/images/Nova-Bus.jpg.png',
  ALEXANDER: '/assets/images/alexander-dennis.jpg',
  KARSAN: '/assets/images/KARSAN.jpg',
};

// Nodes (locations on the map)
export const mockNodes: Node[] = [
  {
    id: 'node-winnipeg',
    name: 'winnipeg',
    company: 'NFL',
    companyId: COMPANY_IDS.NFL,
    city: 'Winnipeg',
    coordinates: { latitude: 49.8951, longitude: -97.1384 },
    type: 'Facility',
    status: 'ONLINE',
    isHub: true,
    hubCode: 'WPG',
  },
  {
    id: 'node-indianapolis',
    name: 'indianapolis',
    company: 'ARBOC',
    companyId: COMPANY_IDS.ARBOC,
    city: 'Indianapolis',
    coordinates: { latitude: 39.7684, longitude: -86.1581 },
    type: 'Hub',
    status: 'OPTIMAL',
    isHub: true,
    hubCode: 'IND',
  },
  {
    id: 'node-st-eustache',
    name: 'st-eustache',
    company: 'Nova',
    companyId: COMPANY_IDS.NOVA,
    city: 'St. Eustache',
    coordinates: { latitude: 45.5650, longitude: -73.9055 },
    type: 'Facility',
    status: 'ACTIVE',
    isHub: true,
    hubCode: 'PRM-NVA',
  },
  {
    id: 'node-las-vegas',
    name: 'las-vegas',
    company: 'Alexander Dennis',
    companyId: COMPANY_IDS.ALEXANDER,
    city: 'Las Vegas',
    coordinates: { latitude: 36.1699, longitude: -115.1398 },
    type: 'Center',
    status: 'ACTIVE',
    isHub: true,
    hubCode: 'LVG',
  },
  {
    id: 'node-paris-ontario',
    name: 'paris-ontario',
    company: 'Creative Carriage',
    companyId: COMPANY_IDS.CREATIVE,
    city: 'Paris, Ontario',
    coordinates: { latitude: 43.1930, longitude: -80.3850 },
    type: 'Facility',
    status: 'ONLINE',
    isHub: true,
    hubCode: 'PRM',
  },
  {
    id: 'node-turkey',
    name: 'turkey',
    company: 'Karsan',
    companyId: COMPANY_IDS.KARSAN,
    city: 'Turkey',
    coordinates: { latitude: 39.9208, longitude: 32.8541 },
    type: 'Facility',
    status: 'ONLINE',
    isHub: true,
    hubCode: 'TKY',
  },
  {
    id: 'node-nanjing',
    name: 'nanjing',
    company: 'TAM',
    companyId: COMPANY_IDS.TAM,
    city: 'Nanjing, China',
    coordinates: { latitude: 32.0603, longitude: 118.7969 },
    type: 'Hub',
    status: 'OPTIMAL',
    isHub: true,
    hubCode: 'NJN',
  },
];

// Transit routes (connections between nodes)
export const mockTransitRoutes: TransitRoute[] = [
  {
    id: 'route-1',
    from: 'winnipeg',
    to: 'indianapolis',
    fromCoordinates: { latitude: 49.8951, longitude: -97.1384 },
    toCoordinates: { latitude: 39.7684, longitude: -86.1581 },
    animated: true,
    strokeColor: '#00FF41',
    strokeWidth: 3,
  },
  {
    id: 'route-2',
    from: 'indianapolis',
    to: 'st-eustache',
    fromCoordinates: { latitude: 39.7684, longitude: -86.1581 },
    toCoordinates: { latitude: 45.5650, longitude: -73.9055 },
    animated: true,
    strokeColor: '#00FF41',
    strokeWidth: 3,
  },
  {
    id: 'route-3',
    from: 'st-eustache',
    to: 'paris-ontario',
    fromCoordinates: { latitude: 45.5650, longitude: -73.9055 },
    toCoordinates: { latitude: 43.1930, longitude: -80.3850 },
    animated: true,
    strokeColor: '#00FF41',
    strokeWidth: 3,
  },
  {
    id: 'route-4',
    from: 'paris-ontario',
    to: 'las-vegas',
    fromCoordinates: { latitude: 43.1930, longitude: -80.3850 },
    toCoordinates: { latitude: 36.1699, longitude: -115.1398 },
    animated: true,
    strokeColor: '#00FF41',
    strokeWidth: 3,
  },
  {
    id: 'route-5',
    from: 'las-vegas',
    to: 'turkey',
    fromCoordinates: { latitude: 36.1699, longitude: -115.1398 },
    toCoordinates: { latitude: 39.9208, longitude: 32.8541 },
    animated: true,
    strokeColor: '#00FF41',
    strokeWidth: 3,
  },
  {
    id: 'route-6',
    from: 'turkey',
    to: 'nanjing',
    fromCoordinates: { latitude: 39.9208, longitude: 32.8541 },
    toCoordinates: { latitude: 32.0603, longitude: 118.7969 },
    animated: true,
    strokeColor: '#00FF41',
    strokeWidth: 3,
  },
  {
    id: 'route-7',
    from: 'las-vegas',
    to: 'indianapolis',
    fromCoordinates: { latitude: 36.1699, longitude: -115.1398 },
    toCoordinates: { latitude: 39.7684, longitude: -86.1581 },
    animated: true,
    strokeColor: '#00FF41',
    strokeWidth: 3,
  },
];

// Activity logs
export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: new Date('2026-01-22T14:28:11'),
    company: 'TAM',
    companyId: COMPANY_IDS.TAM,
    status: 'ACTIVE',
    title: 'TAM | NANJING, CHINA',
    description: 'PEAK EFFICIENCY // LOAD BALANCING COMPLETE',
    location: 'Nanjing, China',
    logo: COMPANY_LOGOS.TAM,
  },
  {
    id: 'log-2',
    timestamp: new Date('2026-01-22T14:22:05'),
    company: 'Creative Carriage',
    companyId: COMPANY_IDS.CREATIVE,
    status: 'INFO',
    title: 'CREATIVE CARRIAGE | PARIS, ONTARIO',
    description: 'SYNC SUCCESS // LATENCY REDUCED -24MS',
    location: 'Paris, Ontario',
    logo: COMPANY_LOGOS.CREATIVE,
  },
  {
    id: 'log-3',
    timestamp: new Date('2026-01-22T14:20:15'),
    company: 'ARBOC',
    companyId: COMPANY_IDS.ARBOC,
    status: 'INFO',
    title: 'ARBOC | INDIANAPOLIS',
    description: 'HUB SHIFT START',
    location: 'Indianapolis',
    logo: COMPANY_LOGOS.ARBOC,
  },
  {
    id: 'log-4',
    timestamp: new Date('2026-01-22T14:18:30'),
    company: 'NFL',
    companyId: COMPANY_IDS.NFL,
    status: 'INFO',
    title: 'NFL | WINNIPEG',
    description: 'SYSTEM OPTIMAL',
    location: 'Winnipeg',
    logo: COMPANY_LOGOS.NFL,
  },
  {
    id: 'log-5',
    timestamp: new Date('2026-01-22T14:15:40'),
    company: 'Nova',
    companyId: COMPANY_IDS.NOVA,
    status: 'INFO',
    title: 'NOVA | ST. EUSTACHE',
    description: 'SYNC ACTIVE',
    location: 'St. Eustache',
    logo: COMPANY_LOGOS.NOVA,
  },
  {
    id: 'log-6',
    timestamp: new Date('2026-01-22T14:12:20'),
    company: 'Alexander Dennis',
    companyId: COMPANY_IDS.ALEXANDER,
    status: 'INFO',
    title: 'ALEXANDER DENNIS | LAS VEGAS',
    description: 'OPERATIONAL',
    location: 'Las Vegas',
    logo: COMPANY_LOGOS.ALEXANDER,
  },
  {
    id: 'log-7',
    timestamp: new Date('2026-01-22T14:10:05'),
    company: 'Karsan',
    companyId: COMPANY_IDS.KARSAN,
    status: 'INFO',
    title: 'KARSAN | TURKEY',
    description: 'CONNECTED',
    location: 'Turkey',
    logo: COMPANY_LOGOS.KARSAN,
  },
];

// Network metrics
export const mockNetworkMetrics: NetworkMetrics = {
  dataFlowIntegrity: 99.9,
  fleetSyncRate: 1402,
  networkLatency: 4,
  latencyChange: -12.4,
  nodeDensity: 98.8,
  encryptionProtocol: 'QUANTUM-X',
  encryptionStatus: 'ACTIVE',
};

// Network throughput
export const mockNetworkThroughput: NetworkThroughput = {
  bars: [60, 80, 45, 90, 70, 100, 85],
  channelStatus: 'L-CHANNEL: ACTIVE',
  throughput: '4.8 GBPS',
};

// Geopolitical heatmap (4x3 grid)
export const mockGeopoliticalHeatmap: GeopoliticalHeatmap = {
  grid: [
    [20, 10, 40, 10],
    [5, 30, 10, 20],
    [40, 10, 20, 50],
  ],
  rows: 3,
  cols: 4,
};

// Satellite statuses
export const mockSatelliteStatuses: SatelliteStatus[] = [
  {
    id: 'sat-01',
    name: 'SAT-01',
    type: 'GEO',
    status: 'LOCKED',
  },
  {
    id: 'sat-02',
    name: 'SAT-02',
    type: 'LEO',
    status: 'LOCKED',
  },
  {
    id: 'sat-03',
    name: 'SAT-03',
    type: 'MEO',
    status: 'ACQUIRING',
  },
];

// Company data with hubs and quantum charts
export const mockCompanies: CompanyData[] = [
  {
    id: COMPANY_IDS.TAM,
    name: 'TAM',
    hubs: [
      {
        id: 'hub-tam-njn',
        code: 'NJN',
        companyId: COMPANY_IDS.TAM,
        companyName: 'TAM',
        status: 'OPTIMAL',
        capacity: 'MAX FLOW',
        capacityPercentage: 100,
        statusColor: 'text-tactical-green',
        capColor: 'text-tactical-green',
      },
    ],
    quantumChart: {
      dataPoints: [60, 75, 80, 95, 85, 90],
      highlightedIndex: 3,
    },
  },
  {
    id: COMPANY_IDS.CREATIVE,
    name: 'Creative Carriage',
    hubs: [
      {
        id: 'hub-creative-prm',
        code: 'PRM',
        companyId: COMPANY_IDS.CREATIVE,
        companyName: 'Creative Carriage',
        status: 'ONLINE',
        capacity: '78% CAP',
        capacityPercentage: 78,
        statusColor: 'text-tactical-green',
        capColor: 'text-tactical-green',
      },
    ],
    quantumChart: {
      dataPoints: [55, 70, 75, 88, 80, 85],
      highlightedIndex: 3,
    },
  },
  {
    id: COMPANY_IDS.ARBOC,
    name: 'ARBOC',
    hubs: [
      {
        id: 'hub-arboc-ind',
        code: 'IND',
        companyId: COMPANY_IDS.ARBOC,
        companyName: 'ARBOC',
        status: 'ONLINE',
        capacity: '84% CAP',
        capacityPercentage: 84,
        statusColor: 'text-tactical-green',
        capColor: 'text-tactical-green',
      },
    ],
    quantumChart: {
      dataPoints: [65, 78, 82, 92, 87, 88],
      highlightedIndex: 3,
    },
  },
  {
    id: COMPANY_IDS.NFL,
    name: 'NFL',
    hubs: [
      {
        id: 'hub-nfl-wpg',
        code: 'WPG',
        companyId: COMPANY_IDS.NFL,
        companyName: 'NFL',
        status: 'ONLINE',
        capacity: '92% CAP',
        capacityPercentage: 92,
        statusColor: 'text-tactical-green',
        capColor: 'text-tactical-green',
      },
    ],
    quantumChart: {
      dataPoints: [70, 80, 85, 95, 88, 92],
      highlightedIndex: 3,
    },
  },
  {
    id: COMPANY_IDS.NOVA,
    name: 'Nova',
    hubs: [
      {
        id: 'hub-nova-prm',
        code: 'PRM-NVA',
        companyId: COMPANY_IDS.NOVA,
        companyName: 'Nova',
        status: 'ACTIVE',
        capacity: '65% CAP',
        capacityPercentage: 65,
        statusColor: 'text-zinc-800',
        capColor: 'text-zinc-700',
      },
    ],
    quantumChart: {
      dataPoints: [50, 65, 70, 82, 75, 78],
      highlightedIndex: 3,
    },
  },
  {
    id: COMPANY_IDS.ALEXANDER,
    name: 'Alexander Dennis',
    hubs: [
      {
        id: 'hub-alexander-lvg',
        code: 'LVG',
        companyId: COMPANY_IDS.ALEXANDER,
        companyName: 'Alexander Dennis',
        status: 'ACTIVE',
        capacity: '45% CAP',
        capacityPercentage: 45,
        statusColor: 'text-zinc-800',
        capColor: 'text-zinc-700',
      },
    ],
    quantumChart: {
      dataPoints: [40, 55, 60, 72, 65, 68],
      highlightedIndex: 3,
    },
  },
  {
    id: COMPANY_IDS.KARSAN,
    name: 'Karsan',
    hubs: [
      {
        id: 'hub-karsan-tky',
        code: 'TKY',
        companyId: COMPANY_IDS.KARSAN,
        companyName: 'Karsan',
        status: 'ONLINE',
        capacity: '71% CAP',
        capacityPercentage: 71,
        statusColor: 'text-tactical-green',
        capColor: 'text-tactical-green',
      },
    ],
    quantumChart: {
      dataPoints: [58, 72, 77, 89, 82, 85],
      highlightedIndex: 3,
    },
  },
];

// Complete mock war room state
export const mockWarRoomData: WarRoomState = {
  nodes: mockNodes,
  transitRoutes: mockTransitRoutes,
  activityLogs: mockActivityLogs,
  networkMetrics: mockNetworkMetrics,
  networkThroughput: mockNetworkThroughput,
  geopoliticalHeatmap: mockGeopoliticalHeatmap,
  satelliteStatuses: mockSatelliteStatuses,
  companies: mockCompanies,
  selectedCompanyId: COMPANY_IDS.TAM,
};
