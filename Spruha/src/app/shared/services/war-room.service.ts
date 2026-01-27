import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
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
import { mockWarRoomData } from '../data/war-room-mock-data';

@Injectable({
  providedIn: 'root',
})
export class WarRoomService {
  // Signal-based state management
  private _nodes = signal<Node[]>([]);
  private _transitRoutes = signal<TransitRoute[]>([]);
  private _activityLogs = signal<ActivityLog[]>([]);
  private _networkMetrics = signal<NetworkMetrics | null>(null);
  private _networkThroughput = signal<NetworkThroughput | null>(null);
  private _geopoliticalHeatmap = signal<GeopoliticalHeatmap | null>(null);
  private _satelliteStatuses = signal<SatelliteStatus[]>([]);
  private _companies = signal<CompanyData[]>([]);
  private _selectedCompanyId = signal<string | null>(null);

  // Public readonly signals
  readonly nodes = this._nodes.asReadonly();
  readonly transitRoutes = this._transitRoutes.asReadonly();
  readonly activityLogs = this._activityLogs.asReadonly();
  readonly networkMetrics = this._networkMetrics.asReadonly();
  readonly networkThroughput = this._networkThroughput.asReadonly();
  readonly geopoliticalHeatmap = this._geopoliticalHeatmap.asReadonly();
  readonly satelliteStatuses = this._satelliteStatuses.asReadonly();
  readonly companies = this._companies.asReadonly();
  readonly selectedCompanyId = this._selectedCompanyId.asReadonly();

  // Computed signals
  readonly selectedCompany = computed(() => {
    const companyId = this._selectedCompanyId();
    if (!companyId) return null;
    return this._companies().find((c) => c.id === companyId) || null;
  });

  readonly filteredActivityLogs = computed(() => {
    const selectedId = this._selectedCompanyId();
    if (!selectedId) return this._activityLogs();
    return this._activityLogs().filter((log) => log.companyId === selectedId);
  });

  constructor() {
    this.initializeData();
  }

  /**
   * Initialize data from mock data
   */
  private initializeData(): void {
    const mockData = mockWarRoomData;
    this._nodes.set(mockData.nodes);
    this._transitRoutes.set(mockData.transitRoutes);
    this._activityLogs.set(mockData.activityLogs);
    this._networkMetrics.set(mockData.networkMetrics);
    this._networkThroughput.set(mockData.networkThroughput);
    this._geopoliticalHeatmap.set(mockData.geopoliticalHeatmap);
    this._satelliteStatuses.set(mockData.satelliteStatuses);
    this._companies.set(mockData.companies);

    // Set default selected company (TAM - first in list)
    if (mockData.companies.length > 0) {
      this._selectedCompanyId.set(mockData.companies[0].id);
    }
  }

  /**
   * Get all nodes
   */
  getNodes(): Observable<Node[]> {
    return of(this._nodes()).pipe(delay(100));
  }

  /**
   * Get all transit routes
   */
  getTransitRoutes(): Observable<TransitRoute[]> {
    return of(this._transitRoutes()).pipe(delay(100));
  }

  /**
   * Get all activity logs
   */
  getActivityLogs(): Observable<ActivityLog[]> {
    return of(this._activityLogs()).pipe(delay(100));
  }

  /**
   * Get hub status for a specific company
   */
  getHubStatus(companyId: string): Hub[] {
    const company = this._companies().find((c) => c.id === companyId);
    return company?.hubs || [];
  }

  /**
   * Get network metrics
   */
  getNetworkMetrics(): Observable<NetworkMetrics> {
    const metrics = this._networkMetrics();
    if (!metrics) {
      throw new Error('Network metrics not initialized');
    }
    return of(metrics).pipe(delay(100));
  }

  /**
   * Get company data including quantum chart
   */
  getCompanyData(companyId: string): CompanyData | null {
    return this._companies().find((c) => c.id === companyId) || null;
  }

  /**
   * Select a company
   */
  selectCompany(companyId: string | null): void {
    this._selectedCompanyId.set(companyId);
  }

  /**
   * Get selected company
   */
  getSelectedCompany(): CompanyData | null {
    return this.selectedCompany();
  }

  /**
   * Add a new activity log entry
   * Keeps only the most recent entry per company (max 7 entries, one per company)
   */
  addActivityLog(log: ActivityLog): void {
    const currentLogs = this._activityLogs();
    
    // Remove any existing entry for this company to ensure only one entry per company
    const filteredLogs = currentLogs.filter((l) => l.companyId !== log.companyId);
    
    // Add the new log at the beginning (most recent first)
    const updatedLogs = [log, ...filteredLogs];
    
    // Group by company and keep only the most recent entry per company
    const companyMap = new Map<string, ActivityLog>();
    updatedLogs.forEach((l) => {
      const existing = companyMap.get(l.companyId);
      if (!existing) {
        companyMap.set(l.companyId, l);
      } else {
        // Keep the most recent entry
        const dateExisting = typeof existing.timestamp === 'string' ? new Date(existing.timestamp) : existing.timestamp;
        const dateNew = typeof l.timestamp === 'string' ? new Date(l.timestamp) : l.timestamp;
        if (dateNew.getTime() > dateExisting.getTime()) {
          companyMap.set(l.companyId, l);
        }
      }
    });
    
    // Convert map to array, sort by timestamp (most recent first), and limit to 7
    const sortedLogs = Array.from(companyMap.values())
      .sort((a, b) => {
        const dateA = typeof a.timestamp === 'string' ? new Date(a.timestamp) : a.timestamp;
        const dateB = typeof b.timestamp === 'string' ? new Date(b.timestamp) : b.timestamp;
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 7); // Keep only 7 entries (one per company)
    
    this._activityLogs.set(sortedLogs);
  }

  /**
   * Update network metrics
   */
  updateNetworkMetrics(metrics: Partial<NetworkMetrics>): void {
    const current = this._networkMetrics();
    if (current) {
      this._networkMetrics.set({ ...current, ...metrics });
    }
  }

  /**
   * Update network throughput
   */
  updateNetworkThroughput(throughput: Partial<NetworkThroughput>): void {
    const current = this._networkThroughput();
    if (current) {
      this._networkThroughput.set({ ...current, ...throughput });
    }
  }

  /**
   * Update hub status for a company
   */
  updateHubStatus(companyId: string, hubCode: string, updates: Partial<Hub>): void {
    const companies = this._companies();
    const companyIndex = companies.findIndex((c) => c.id === companyId);
    if (companyIndex === -1) return;

    const company = companies[companyIndex];
    const hubIndex = company.hubs.findIndex((h) => h.code === hubCode);
    if (hubIndex === -1) return;

    const updatedHubs = [...company.hubs];
    updatedHubs[hubIndex] = { ...updatedHubs[hubIndex], ...updates };

    const updatedCompanies = [...companies];
    updatedCompanies[companyIndex] = {
      ...company,
      hubs: updatedHubs,
    };

    this._companies.set(updatedCompanies);
  }

  /**
   * Get complete war room state
   */
  getWarRoomState(): WarRoomState {
    const networkMetrics = this._networkMetrics();
    const networkThroughput = this._networkThroughput();
    const geopoliticalHeatmap = this._geopoliticalHeatmap();
    
    // Provide fallback values if signals are not initialized
    return {
      nodes: this._nodes(),
      transitRoutes: this._transitRoutes(),
      activityLogs: this._activityLogs(),
      networkMetrics: networkMetrics || {
        dataFlowIntegrity: 0,
        fleetSyncRate: 0,
        networkLatency: 0,
        nodeDensity: 0,
        encryptionProtocol: '',
        encryptionStatus: '',
      },
      networkThroughput: networkThroughput || {
        bars: [],
        channelStatus: '',
        throughput: '',
      },
      geopoliticalHeatmap: geopoliticalHeatmap || {
        grid: [],
        rows: 0,
        cols: 0,
      },
      satelliteStatuses: this._satelliteStatuses(),
      companies: this._companies(),
      selectedCompanyId: this._selectedCompanyId(),
    };
  }

  /**
   * City lookup table for common cities
   * Format: "city, province/state" -> { latitude, longitude }
   */
  private cityLookup: Map<string, { latitude: number; longitude: number }> = new Map([
    // Canadian Cities
    ['toronto, ontario', { latitude: 43.6532, longitude: -79.3832 }],
    ['vancouver, british columbia', { latitude: 49.2827, longitude: -123.1207 }],
    ['montreal, quebec', { latitude: 45.5017, longitude: -73.5673 }],
    ['calgary, alberta', { latitude: 51.0447, longitude: -114.0719 }],
    ['ottawa, ontario', { latitude: 45.4215, longitude: -75.6972 }],
    ['edmonton, alberta', { latitude: 53.5461, longitude: -113.4938 }],
    ['winnipeg, manitoba', { latitude: 49.8951, longitude: -97.1384 }],
    ['halifax, nova scotia', { latitude: 44.6488, longitude: -63.5752 }],
    ['victoria, british columbia', { latitude: 48.4284, longitude: -123.3656 }],
    ['saskatoon, saskatchewan', { latitude: 52.1332, longitude: -106.6700 }],
    ['regina, saskatchewan', { latitude: 50.4452, longitude: -104.6189 }],
    ['quebec city, quebec', { latitude: 46.8139, longitude: -71.2080 }],
    ['hamilton, ontario', { latitude: 43.2557, longitude: -79.8711 }],
    ['london, ontario', { latitude: 42.9849, longitude: -81.2453 }],
    ['kitchener, ontario', { latitude: 43.4516, longitude: -80.4925 }],
    ['windsor, ontario', { latitude: 42.3149, longitude: -83.0364 }],
    ['oshawa, ontario', { latitude: 43.8975, longitude: -78.8659 }],
    ['barrie, ontario', { latitude: 44.3894, longitude: -79.6903 }],
    ['sudbury, ontario', { latitude: 46.4920, longitude: -80.9940 }],
    ['kingston, ontario', { latitude: 44.2312, longitude: -76.4860 }],
    ['paris, ontario', { latitude: 43.2000, longitude: -80.3833 }],
    ['st. eustache, quebec', { latitude: 45.5650, longitude: -73.9050 }],
    // US Cities (common ones)
    ['new york, new york', { latitude: 40.7128, longitude: -74.0060 }],
    ['los angeles, california', { latitude: 34.0522, longitude: -118.2437 }],
    ['chicago, illinois', { latitude: 41.8781, longitude: -87.6298 }],
    ['houston, texas', { latitude: 29.7604, longitude: -95.3698 }],
    ['phoenix, arizona', { latitude: 33.4484, longitude: -112.0740 }],
    ['philadelphia, pennsylvania', { latitude: 39.9526, longitude: -75.1652 }],
    ['san antonio, texas', { latitude: 29.4241, longitude: -98.4936 }],
    ['san diego, california', { latitude: 32.7157, longitude: -117.1611 }],
    ['dallas, texas', { latitude: 32.7767, longitude: -96.7970 }],
    ['san jose, california', { latitude: 37.3382, longitude: -121.8863 }],
    ['austin, texas', { latitude: 30.2672, longitude: -97.7431 }],
    ['jacksonville, florida', { latitude: 30.3322, longitude: -81.6557 }],
    ['san francisco, california', { latitude: 37.7749, longitude: -122.4194 }],
    ['indianapolis, indiana', { latitude: 39.7684, longitude: -86.1581 }],
    ['columbus, ohio', { latitude: 39.9612, longitude: -82.9988 }],
    ['fort worth, texas', { latitude: 32.7555, longitude: -97.3308 }],
    ['charlotte, north carolina', { latitude: 35.2271, longitude: -80.8431 }],
    ['seattle, washington', { latitude: 47.6062, longitude: -122.3321 }],
    ['denver, colorado', { latitude: 39.7392, longitude: -104.9903 }],
    ['washington, district of columbia', { latitude: 38.9072, longitude: -77.0369 }],
    ['boston, massachusetts', { latitude: 42.3601, longitude: -71.0589 }],
    ['el paso, texas', { latitude: 31.7619, longitude: -106.4850 }],
    ['detroit, michigan', { latitude: 42.3314, longitude: -83.0458 }],
    ['nashville, tennessee', { latitude: 36.1627, longitude: -86.7816 }],
    ['portland, oregon', { latitude: 45.5152, longitude: -122.6784 }],
    ['oklahoma city, oklahoma', { latitude: 35.4676, longitude: -97.5164 }],
    ['las vegas, nevada', { latitude: 36.1699, longitude: -115.1398 }],
    ['memphis, tennessee', { latitude: 35.1495, longitude: -90.0490 }],
    ['louisville, kentucky', { latitude: 38.2527, longitude: -85.7585 }],
    ['baltimore, maryland', { latitude: 39.2904, longitude: -76.6122 }],
    ['milwaukee, wisconsin', { latitude: 43.0389, longitude: -87.9065 }],
    ['albuquerque, new mexico', { latitude: 35.0844, longitude: -106.6504 }],
    ['tucson, arizona', { latitude: 32.2226, longitude: -110.9747 }],
    ['fresno, california', { latitude: 36.7378, longitude: -119.7871 }],
    ['sacramento, california', { latitude: 38.5816, longitude: -121.4944 }],
    ['kansas city, missouri', { latitude: 39.0997, longitude: -94.5786 }],
    ['mesa, arizona', { latitude: 33.4152, longitude: -111.8315 }],
    ['atlanta, georgia', { latitude: 33.7490, longitude: -84.3880 }],
    ['omaha, nebraska', { latitude: 41.2565, longitude: -95.9345 }],
    ['colorado springs, colorado', { latitude: 38.8339, longitude: -104.8214 }],
    ['raleigh, north carolina', { latitude: 35.7796, longitude: -78.6382 }],
    ['virginia beach, virginia', { latitude: 36.8529, longitude: -75.9780 }],
    ['miami, florida', { latitude: 25.7617, longitude: -80.1918 }],
    ['oakland, california', { latitude: 37.8044, longitude: -122.2712 }],
    ['minneapolis, minnesota', { latitude: 44.9778, longitude: -93.2650 }],
    ['tulsa, oklahoma', { latitude: 36.1540, longitude: -95.9928 }],
    ['cleveland, ohio', { latitude: 41.4993, longitude: -81.6944 }],
    ['wichita, kansas', { latitude: 37.6872, longitude: -97.3301 }],
    ['arlington, texas', { latitude: 32.7357, longitude: -97.1081 }],
    ['new orleans, louisiana', { latitude: 29.9511, longitude: -90.0715 }],
    ['honolulu, hawaii', { latitude: 21.3099, longitude: -157.8581 }],
  ]);

  /**
   * Parse location input (coordinates or address)
   * Supports coordinate format: "latitude, longitude" or "City, Province/State" format
   * For addresses, uses a lookup table for common cities or returns placeholder coordinates
   */
  async parseLocationInput(input: string): Promise<{ latitude: number; longitude: number }> {
    const trimmed = input.trim();

    // Try to parse as coordinates (format: "lat, lng" or "lat,lng")
    const coordinateMatch = trimmed.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
    if (coordinateMatch) {
      const latitude = parseFloat(coordinateMatch[1]);
      const longitude = parseFloat(coordinateMatch[2]);

      // Validate coordinate ranges
      if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
        return { latitude, longitude };
      } else {
        throw new Error('Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180');
      }
    }

    // Try to parse as "City, Province/State" format
    const cityProvinceMatch = trimmed.match(/^([^,]+),\s*(.+)$/i);
    if (cityProvinceMatch) {
      const city = cityProvinceMatch[1].trim().toLowerCase();
      const province = cityProvinceMatch[2].trim().toLowerCase();
      const lookupKey = `${city}, ${province}`;
      
      // Try exact match first
      const exactMatch = this.cityLookup.get(lookupKey);
      if (exactMatch) {
        return exactMatch;
      }

      // Try case-insensitive search
      for (const [key, coords] of this.cityLookup.entries()) {
        if (key.toLowerCase() === lookupKey) {
          return coords;
        }
      }

      // If not found in lookup, return placeholder coordinates (0, 0)
      // This allows the system to work while real geocoding can be added later
      console.warn(`City "${lookupKey}" not found in lookup table. Using placeholder coordinates.`);
      return { latitude: 0, longitude: 0 };
    }

    // If not coordinates or city/province format, return placeholder
    // This allows the system to work while real geocoding can be added later
    console.warn(`Could not parse location "${trimmed}". Using placeholder coordinates.`);
    return { latitude: 0, longitude: 0 };
  }

  /**
   * Add a new node to the map
   */
  addNode(node: Node): void {
    const currentNodes = this._nodes();
    
    // Check if node with same ID already exists
    if (currentNodes.find(n => n.id === node.id)) {
      console.warn(`Node with ID ${node.id} already exists. Updating instead.`);
      this.updateNode(node);
      return;
    }

    // Add new node
    this._nodes.set([...currentNodes, node]);
    console.log('Node added:', node);
  }

  /**
   * Update an existing node
   */
  updateNode(node: Node): void {
    const currentNodes = this._nodes();
    const index = currentNodes.findIndex(n => n.id === node.id);
    
    if (index === -1) {
      console.warn(`Node with ID ${node.id} not found. Adding as new node.`);
      this.addNode(node);
      return;
    }

    const updatedNodes = [...currentNodes];
    updatedNodes[index] = node;
    this._nodes.set(updatedNodes);
  }

  /**
   * Add a new company
   */
  addCompany(company: CompanyData): void {
    const currentCompanies = this._companies();
    
    // Check if company with same ID already exists
    if (currentCompanies.find(c => c.id === company.id)) {
      console.warn(`Company with ID ${company.id} already exists. Updating instead.`);
      this.updateCompany(company);
      return;
    }

    // Add new company
    this._companies.set([...currentCompanies, company]);
    console.log('Company added:', company);
  }

  /**
   * Update an existing company
   */
  updateCompany(company: CompanyData): void {
    const currentCompanies = this._companies();
    const index = currentCompanies.findIndex(c => c.id === company.id);
    
    if (index === -1) {
      console.warn(`Company with ID ${company.id} not found. Adding as new company.`);
      this.addCompany(company);
      return;
    }

    const updatedCompanies = [...currentCompanies];
    updatedCompanies[index] = company;
    this._companies.set(updatedCompanies);
  }

  /**
   * Generate a unique company ID from company name
   */
  generateCompanyId(companyName: string): string {
    const slug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    // Append timestamp to ensure uniqueness (matching generateNodeId behavior)
    const timestamp = Date.now();
    return `${slug}-${timestamp}`;
  }

  /**
   * Generate a unique node ID from company name
   */
  generateNodeId(companyName: string): string {
    const slug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const timestamp = Date.now();
    return `node-${slug}-${timestamp}`;
  }
}
