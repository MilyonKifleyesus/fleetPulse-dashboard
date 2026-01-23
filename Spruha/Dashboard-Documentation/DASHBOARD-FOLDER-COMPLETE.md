# Dashboard Folder - Complete Documentation

## 📁 Overview

The `dashboard` folder contains all dashboard-related components for the FleetPulse application. It includes main dashboards, facility dashboards, vehicle details, and workspace configurations.

**Location**: `Spruha/src/app/components/dashboard`

---

## 📂 Folder Structure

```
dashboard/
├── dashboard/
│   ├── dashboard.component.ts         # Main dashboard component
│   ├── dashboard.component.html       # Main dashboard template
│   └── dashboard.component.scss       # Main dashboard styles
├── workspace-dashboard/
│   ├── workspace-dashboard.component.ts    # Workspace-enabled dashboard
│   ├── workspace-dashboard.component.html  # Workspace template
│   └── workspace-dashboard.component.scss  # Workspace styles
├── facility-dashboard/
│   ├── facility-dashboard.component.ts     # Facility management dashboard
│   ├── facility-dashboard.component.html   # Facility template
│   └── facility-dashboard.component.scss   # Facility styles
├── facility-operations/
│   ├── facility-operations.component.ts    # Facility operations detail view
│   ├── facility-operations.component.html  # Operations template
│   └── facility-operations.component.scss  # Operations styles
├── vehicle-detail/
│   ├── vehicle-detail.component.ts         # Vehicle detail view
│   ├── vehicle-detail.component.html       # Vehicle template
│   └── vehicle-detail.component.scss       # Vehicle styles
└── dashboard.routes.ts                # Route configuration
```

---

## 🗂️ Components

### 1. DashboardComponent (`dashboard/dashboard.component.ts`)

#### Purpose
Main fleet dashboard displaying overall fleet statistics, charts, and management tools.

#### Key Features
- **Fleet Overview Cards**: Total units, maintenance efficiency, operational cost, efficiency index
- **Fleet Utilization Chart**: Historical data visualization (30d/quarter/year)
- **Status Distribution**: Active, maintenance, standby, critical vehicles
- **Performance Metrics**: Health score tracking with trends
- **Vehicles Requiring Maintenance Table**: Priority-based maintenance queue
- **Recent Activities Feed**: System activity log
- **Excel Upload**: Import vehicle data from Excel files

#### Dependencies
**Services:**
- `FleetService` - Vehicle data management
- `ExcelUploadService` - Excel file processing
- `ToastrService` - User notifications
- `DatePipe` - Date formatting

**Models:**
- `Vehicle` - Vehicle data structure
- `DashboardStats` - Dashboard statistics
- `HistoricalData` - Historical chart data
- `Activity` - Activity feed entries
- `Company` - Company information

#### Routes
**NOT directly routed** - This appears to be a legacy component. The workspace-dashboard is the active main dashboard.

---

### 2. WorkspaceDashboardComponent (`workspace-dashboard/workspace-dashboard.component.ts`)

#### Purpose
Enhanced dashboard with workspace functionality - customizable widget layout, drag-and-drop, edit mode.

#### Key Features
- **All DashboardComponent features PLUS:**
- **Customizable Widget Layout**: Drag-and-drop widget positioning
- **Edit Mode**: Toggle between view and edit modes
- **Workspace State Persistence**: Saves widget positions/layout to localStorage
- **Widget Management**: Add, remove, resize, minimize widgets
- **Factory Reset**: Restore default widget layout

#### Dependencies
**Services:**
- `FleetService` - Vehicle data management
- `WorkspaceStateService` - Workspace state persistence
- `WorkspaceModeService` - Edit/view mode management
- `WidgetRegistryService` - Widget registration and lookup

#### Widget Types
1. **Metric Cards** (`metric-card`): Fleet statistics cards
2. **Chart Widget** (`chart-widget`): Utilization charts
3. **Activity Feed** (`activity-feed`): Recent activities
4. **Table Widget** (`table-widget`): Maintenance queue table

#### Routes
```typescript
{
  path: 'dashboard',
  loadComponent: () => import('./workspace-dashboard/workspace-dashboard.component')
}
```

---

### 3. FacilityDashboardComponent (`facility-dashboard/facility-dashboard.component.ts`)

#### Purpose
Facility management dashboard showing facility operations, utilization, efficiency metrics.

#### Key Features
- **Facility Overview Cards**: Total facilities, operational facilities, average utilization, critical issues
- **Facility Carousel**: Top facilities by utilization (Swiper)
- **Performance Charts**: Facility performance trends, resource allocation, operational status
- **Facility Table**: Comprehensive facility listing with efficiency, utilization, unit counts
- **Advanced Filtering**: Filter by facility name, location, status, efficiency range, repair queue
- **Sorting**: All columns sortable
- **Pagination**: Configurable page size
- **Export**: CSV/Excel export

#### Data Sources
Currently uses mock data from `facility-dashboard-data.ts`

#### Routes
```typescript
{
  path: 'facility-dashboard',
  loadComponent: () => import('./facility-dashboard/facility-dashboard.component')
}
```

---

### 4. FacilityOperationsComponent (`facility-operations/facility-operations.component.ts`)

#### Purpose
Detailed facility operations view showing real-time unit status, telemetry, and performance metrics for a specific facility.

#### Key Features
- **Key Metrics Cards**: Total units, active units, idle units, critical alerts, health score
- **Performance Chart**: Fleet uptime, energy load, maintenance over time
- **Telemetry Display**: Real-time facility telemetry data
- **Resource Status**: Parts inventory, staffing levels
- **Units Table**: Unit ID, Model, Status, Battery level, Assigned staff, Last maintenance
- **Real-time Updates**: Auto-refresh every 30 seconds (currently disabled)

#### Route Parameters
- `facilityId` (required) - Facility identifier from route

#### Routes
```typescript
{
  path: 'facility-operations/:facilityId',
  loadComponent: () => import('./facility-operations/facility-operations.component')
}
```

---

### 5. VehicleDetailComponent (`vehicle-detail/vehicle-detail.component.ts`)

#### Purpose
Detailed vehicle/unit view with maintenance timeline, history, efficiency tracking, and live feed capabilities.

#### Key Features
- **Vehicle Header**: Vehicle ID, model, status, health score
- **Image Gallery**: Multiple vehicle images with navigation
- **Maintenance Timeline**: Visual maintenance workflow with phases (Inspection, Diagnosis, Repair, Testing, Documentation)
- **Maintenance History**: Historical maintenance records table
- **Efficiency Tracking**: Chart showing efficiency and consumption over time (30D/6M/1Y)
- **Live Feed**: Real-time monitoring session with timer
- **Secure Logs**: System logs for the vehicle
- **Tabs**: Timeline, History, Efficiency views

#### Route Parameters
- `vehicleId` (required) - Vehicle identifier
- `facilityId` (optional) - Facility context (for nested routes)

#### Routes
```typescript
{
  path: 'vehicle/:vehicleId',
  loadComponent: () => import('./vehicle-detail/vehicle-detail.component')
},
{
  path: 'facility-operations/:facilityId/vehicle/:vehicleId',
  loadComponent: () => import('./vehicle-detail/vehicle-detail.component')
}
```

---

## 🛣️ Routes Configuration (`dashboard.routes.ts`)

### Route Definitions

```typescript
export const admin: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./workspace-dashboard/workspace-dashboard.component')
  },
  {
    path: 'facility-dashboard',
    loadComponent: () => import('./facility-dashboard/facility-dashboard.component')
  },
  {
    path: 'facility-management-dashboard',
    loadComponent: () => import('./facility-dashboard/facility-dashboard.component')
  },
  {
    path: 'facility-management',
    loadComponent: () => import('./facility-dashboard/facility-dashboard.component')
  },
  {
    path: 'facility-operations/:facilityId',
    loadComponent: () => import('./facility-operations/facility-operations.component')
  },
  {
    path: 'vehicle/:vehicleId',
    loadComponent: () => import('./vehicle-detail/vehicle-detail.component')
  },
  {
    path: 'facility-operations/:facilityId/vehicle/:vehicleId',
    loadComponent: () => import('./vehicle-detail/vehicle-detail.component')
  }
];
```

---

## 🔗 Related Services

### FleetService (`shared/services/fleet.service.ts`)
**Used by**: DashboardComponent, WorkspaceDashboardComponent

**Methods:**
- `getVehicles()` - Get all vehicles
- `getDashboardStats()` - Calculate statistics
- `getHistoricalData(period)` - Get historical chart data
- `getRecentActivities(limit)` - Get activity feed
- `upsertVehicles(vehicles)` - Save/update vehicles
- `refreshData()` - Trigger data refresh

**Data Storage**: localStorage

---

### WorkspaceStateService (`shared/services/workspace-state.service.ts`)
**Used by**: WorkspaceDashboardComponent

**Methods:**
- `loadWorkspaceState(workspaceId)` - Load saved workspace layout
- `saveWorkspaceState(state)` - Save workspace layout
- `resetWorkspaceState(workspaceId)` - Reset to defaults

---

### FacilityOperationsService (`shared/services/facility-operations.service.ts`)
**Used by**: FacilityOperationsComponent

**Methods:**
- `getFacilityOperations(facilityId)` - Get operations data
- `generateReport(facilityId)` - Generate PDF report

---

### VehicleDetailService (`shared/services/vehicle-detail.service.ts`)
**Used by**: VehicleDetailComponent

**Methods:**
- `getVehicleDetail(vehicleId)` - Get vehicle details
- `getVehicleMetrics(vehicleId)` - Get real-time metrics
- `getMaintenanceHistory(vehicleId)` - Get maintenance history
- `getEfficiencyData(vehicleId, period)` - Get efficiency data
- `getSecureLogs(vehicleId)` - Get secure logs

---

## 📊 Models & Interfaces

### Vehicle (`shared/models/vehicle.interface.ts`)
**Key Properties:**
- `id`, `vehicleId` - Identifiers
- `status` - Vehicle status (Active, Maintenance, Standby, Critical)
- `healthScore` - Health percentage (0-100)
- `location` - Current location
- `cost` - Operational cost
- `workOrderCount` - Number of work orders

### DashboardStats (`shared/models/dashboard-stats.interface.ts`)
**Properties:**
- `totalFleetUnits`, `totalFleetUnitsTrend`
- `maintenanceEfficiency`, `maintenanceEfficiencyTrend`
- `operationalCost`, `operationalCostTrend`
- `efficiencyIndex`, `efficiencyIndexTrend`
- `statusDistribution` - Status counts
- `utilization` - Utilization percentage

### WidgetFrame (`shared/models/workspace.interface.ts`)
**Properties:**
- `id`, `type`, `title`, `icon`
- `position` - Grid position (column, row, spans)
- `size` - Widget dimensions
- `isMinimized`, `isMaximized` - State flags
- `config` - Widget-specific configuration

---

## 📝 What's Missing / TODOs

### 1. FacilityDashboardComponent
- ⚠️ **Missing Service Integration**: Currently uses mock data. Needs `FacilityService` implementation
- 🔧 **TODO**: Replace mock data with real service calls
- 🔧 **TODO**: Implement facility creation modal/page

### 2. FacilityOperationsComponent
- ⚠️ **Real-time Updates Disabled**: Commented out due to performance issues
- 🔧 **TODO**: Fix change detection for real-time updates
- 🔧 **TODO**: Implement proper WebSocket integration

### 3. VehicleDetailComponent
- 🔧 **TODO**: Implement service scheduling modal
- 🔧 **TODO**: Implement live feed modal/page

### 4. DashboardComponent
- ⚠️ **Not Routed**: This component is not used in routes. Consider removing if legacy

### 5. Routes
- ⚠️ **Multiple Routes to Same Component**: Three routes point to FacilityDashboardComponent
- **Recommendation**: Consolidate to single route or document why multiple routes exist

### 6. Testing
- ⚠️ **No Test Files**: No `.spec.ts` files found
- 🔧 **TODO**: Add unit tests for all components

---

## 🚀 Usage Examples

### Navigating to Dashboard
```typescript
// Navigate to main dashboard
this.router.navigate(['/dashboard']);

// Navigate to facility dashboard
this.router.navigate(['/dashboard/facility-dashboard']);

// Navigate to facility operations
this.router.navigate(['/dashboard/facility-operations', facilityId]);

// Navigate to vehicle detail
this.router.navigate(['/dashboard/vehicle', vehicleId]);
```

### Using FleetService
```typescript
constructor(private fleetService: FleetService) {}

// Subscribe to data refresh
this.fleetService.dataRefresh$
  .pipe(takeUntil(this.destroy$))
  .subscribe(() => {
    this.loadData();
  });

// Get vehicles
this.fleetService.getVehicles().subscribe(vehicles => {
  this.vehicles = vehicles;
});
```

---

## 📚 Related Documentation

- [Vehicle Interface Documentation](./Models/vehicle.interface.md)
- [Dashboard Stats Interface](./Models/dashboard-stats.interface.md)
- [Workspace Interface Documentation](./Models/workspace.interface.md)
- [FleetService Documentation](./Services/fleet.service.md)
- [Workspace Implementation Summary](../WORKSPACE_IMPLEMENTATION_SUMMARY.md)

---

**Last Updated**: 2025-01-16  
**Version**: 1.0.0  
**Maintainer**: FleetPulse Development Team
