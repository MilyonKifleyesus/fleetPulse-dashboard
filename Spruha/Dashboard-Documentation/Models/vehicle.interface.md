# Vehicle Interface - Complete Documentation

## 📄 File Information

- **File Path**: `src/app/shared/models/vehicle.interface.ts`
- **Purpose**: Defines the Vehicle data structure and related interfaces
- **Dependencies**: None (pure TypeScript interfaces)
- **Used By**: 
  - `FleetService` - Vehicle data management
  - `WorkspaceDashboardComponent` - Dashboard display
  - `VehicleManagementComponent` - Vehicle operations
  - All components that work with vehicle data

## 📋 Table of Contents

1. [Vehicle Interface Overview](#vehicle-interface-overview)
2. [VehicleStatus Type](#vehiclestatus-type)
3. [Vehicle Interface Properties](#vehicle-interface-properties)
4. [Maintenance Interfaces](#maintenance-interfaces)
5. [Vehicle Metrics Interface](#vehicle-metrics-interface)
6. [Other Related Interfaces](#other-related-interfaces)
7. [Usage Examples](#usage-examples)
8. [Documentation Links](#documentation-links)

---

## 🎯 Vehicle Interface Overview

### WHERE
**Location**: `src/app/shared/models/vehicle.interface.ts:3-27`

### WHY
The Vehicle interface defines the structure for all vehicle data in the FleetPulse Dashboard. It ensures:
- **Type Safety**: TypeScript enforces correct vehicle data structure
- **Data Consistency**: All vehicle data follows the same format
- **API Contracts**: Clear contract between services and components
- **IntelliSense**: Better IDE autocomplete and error detection

### WHEN
This interface is used:
- When creating new vehicle objects
- When receiving vehicle data from services
- When displaying vehicle information in components
- When updating vehicle status or properties
- During TypeScript compilation for type checking

### HOW
TypeScript uses this interface to:
1. **Type Checking**: Validates object structure at compile time
2. **IntelliSense**: Provides autocomplete in IDEs
3. **Documentation**: Serves as inline documentation
4. **Refactoring**: Helps with safe code refactoring

### WHICH
**Concepts Used:**
- TypeScript Interfaces
- TypeScript Union Types
- Optional Properties (`?`)
- Date/string flexibility for API compatibility

**Documentation Links:**
- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Optional Properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties)

---

## 🚦 VehicleStatus Type

### WHERE
**Location**: `src/app/shared/models/vehicle.interface.ts:1`

### WHY
Defines allowed vehicle status values using a union type. This ensures:
- Only valid statuses can be assigned
- Type safety prevents invalid values
- Clear documentation of allowed states
- IDE autocomplete shows all options

### WHEN
Used when:
- Assigning vehicle status
- Filtering vehicles by status
- Displaying status badges
- Validating status transitions

### HOW
```typescript
export type VehicleStatus = 'Active' | 'Maintenance' | 'Standby' | 'Critical';
```

TypeScript creates a union type that accepts only these four string literal values.

### WHICH
**Concepts Used:**
- TypeScript Union Types
- String Literal Types

**Documentation Links:**
- [TypeScript Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
- [String Literal Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)

**Status Values Explained:**
- **'Active'**: Vehicle is currently in operation
- **'Maintenance'**: Vehicle is undergoing maintenance
- **'Standby'**: Vehicle is available but not in use
- **'Critical'**: Vehicle requires immediate attention

---

## 🚗 Vehicle Interface Properties

### Core Identification Properties

#### `id: string`
**WHERE**: `src/app/shared/models/vehicle.interface.ts:4`

**WHY**: Unique database/system identifier for internal use

**WHEN**: Used by services for CRUD operations, data lookups

**HOW**: Assigned by backend system or generated during creation

**WHICH**: Standard database ID pattern

#### `vehicleId: string`
**WHERE**: `src/app/shared/models/vehicle.interface.ts:5`

**WHY**: Human-readable vehicle identifier (e.g., "VH-001"). Used for display and user reference.

**WHEN**: Displayed in UI, used in search/filter operations

**HOW**: Format typically follows pattern like "VH-###"

**WHICH**: Business identifier separate from system ID

---

### Status & Health Properties

#### `status: VehicleStatus`
**WHERE**: `src/app/shared/models/vehicle.interface.ts:6`

**WHY**: Current operational status of the vehicle. Determines:
- Which columns/widgets display the vehicle
- Priority in maintenance queue
- Visual indicators (badges, colors)

**WHEN**: 
- Updated when vehicle status changes
- Used for filtering/sorting vehicles
- Displayed in UI components

**HOW**: Assigned from `VehicleStatus` union type

**WHICH**: 
- Enum-like pattern using union types
- Used with conditional rendering in templates

**Documentation Links:**
- [TypeScript Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)

#### `healthScore: number`
**WHERE**: `src/app/shared/models/vehicle.interface.ts:7`

**WHY**: Overall vehicle condition score (0-100). Used for:
- Dashboard efficiency index calculation
- Health alerts
- Prioritization

**WHEN**: Calculated from various metrics, updated regularly

**HOW**: Typically calculated from multiple factors (age, maintenance history, etc.)

**WHICH**: Numeric metric for health tracking

**Range**: 0-100 (0 = critical, 100 = optimal)

---

### Operational Properties

#### `workOrderCount: number`
**WHERE**: `src/app/shared/models/vehicle.interface.ts:8`

**WHY**: Number of active work orders. Used for:
- Maintenance queue priority
- Dashboard statistics
- Maintenance efficiency calculations

**WHEN**: Updated when work orders are created/completed

**HOW**: Counted from work order database/collection

**WHICH**: Counter for maintenance tracking

#### `location: string`
**WHERE**: `src/app/shared/models/vehicle.interface.ts:9`

**WHY**: Current or home location of vehicle. Used for:
- Geographic filtering
- Display in tables/lists
- Facility assignment

**WHEN**: Displayed in vehicle lists, used in filtering

**HOW**: String value (e.g., "New York", "Chicago")

**WHICH**: String property for location tracking

#### `cost: number`
**WHERE**: `src/app/shared/models/vehicle.interface.ts:10`

**WHY**: Operational cost for the vehicle. Used for:
- Dashboard operational cost calculation
- Cost reporting
- Budget tracking

**WHEN**: Updated when costs are recorded, displayed in dashboard

**HOW**: Accumulated from various cost sources

**WHICH**: Numeric property for financial tracking

**Note**: Represents total operational cost, not per-period

---

### Company Properties

#### `companyId: string`
**WHERE**: `src/app/shared/models/vehicle.interface.ts:11`

**WHY**: Links vehicle to a company entity. Required for:
- Multi-tenant support
- Company-based filtering
- Data isolation

**WHEN**: Used in company filtering, data scoping

**HOW**: Foreign key to Company entity

**WHICH**: Relationship identifier

#### `companyName?: string`
**WHERE**: `src/app/shared/models/vehicle.interface.ts:12`

**WHY**: Optional company name for display. Denormalized for performance (avoids joins).

**WHEN**: Displayed in UI without needing company lookup

**HOW**: Populated from Company entity, kept in sync

**WHICH**: Optional property (`?` = may be undefined)

**Note**: Optional (`?`) because it's denormalized data

---

### Maintenance Properties

#### `daysBetweenWorkOrders?: number`
**WHERE**: `src/app/shared/models/vehicle.interface.ts:13`

**WHY**: Average days between work orders. Used for:
- Maintenance scheduling
- Dashboard metrics
- Preventive maintenance planning

**WHEN**: Calculated from work order history

**HOW**: Computed: `totalDays / workOrderCount`

**WHICH**: Optional numeric property

**Note**: Only present if vehicle has work order history

#### `lastMaintenanceDate?: Date | string`
**WHERE**: `src/app/shared/models/vehicle.interface.ts:14`

**WHY**: Date of last maintenance. Used for:
- Maintenance due calculations
- Display in vehicle details
- Scheduling next maintenance

**WHEN**: Updated when maintenance is completed

**HOW**: Stored as Date object or ISO string (for API compatibility)

**WHICH**: Flexible date format (Date | string)

**Note**: Union type allows both Date objects and ISO strings

**Documentation Links:**
- [TypeScript Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)

---

### Timestamp Properties

#### `createdAt?: Date | string`
**WHERE**: `src/app/shared/models/vehicle.interface.ts:15`

**WHY**: Record creation timestamp. Used for:
- Audit trail
- Sorting by creation date
- Age calculations

**WHEN**: Set when vehicle record is created

**HOW**: Assigned by backend or client on creation

**WHICH**: Optional timestamp (Date | string)

#### `updatedAt?: Date | string`
**WHERE**: `src/app/shared/models/vehicle.interface.ts:16`

**WHY**: Last update timestamp. Used for:
- Change tracking
- Sync conflict resolution
- Audit logs

**WHEN**: Updated every time vehicle data changes

**HOW**: Set by backend on each update

**WHICH**: Optional timestamp (Date | string)

---

### Extended Properties (Optional)

#### `make?: string`, `model?: string`, `year?: number`
**WHERE**: `src/app/shared/models/vehicle.interface.ts:18-20`

**WHY**: Vehicle identification details. Used for:
- Vehicle detail views
- Filtering/searching
- Reporting

**WHEN**: Displayed in vehicle detail pages

**HOW**: Optional properties that may not be present initially

**WHICH**: Optional properties pattern

#### `imageUrls?: string[]`
**WHERE**: `src/app/shared/models/vehicle.interface.ts:25`

**WHY**: Array of vehicle image URLs. Used for:
- Vehicle galleries
- Visual identification
- Documentation

**WHEN**: Loaded in vehicle detail views

**HOW**: Array of URL strings

**WHICH**: Optional array property

**Note**: Replaces deprecated `imageUrl` (line 24)

---

## 🔧 Maintenance Interfaces

The file also defines several maintenance-related interfaces:

### MaintenancePhase Interface
**WHERE**: `src/app/shared/models/vehicle.interface.ts:43-50`

**WHY**: Represents a single phase in the maintenance workflow

**Properties**:
- `phase`: Type of phase (INTAKE, DIAGNOSTICS, REPAIR, etc.)
- `status`: Phase status (COMPLETE, IN_PROGRESS, PENDING, LOCKED)
- `progress`: Percentage completion (0-100)

### MaintenanceWorkflow Interface
**WHERE**: `src/app/shared/models/vehicle.interface.ts:53-60`

**WHY**: Represents the complete maintenance workflow for a vehicle

**Properties**:
- `vehicleId`: Links to vehicle
- `currentPhase`: Current phase in workflow
- `phases`: Array of all phases
- `overallProgress`: Overall completion percentage

### VehicleMetrics Interface
**WHERE**: `src/app/shared/models/vehicle.interface.ts:63-74`

**WHY**: Real-time vehicle metrics (odometer, fuel, power unit)

**Properties**:
- `odometer`: Total miles
- `fuelLevel`: Fuel percentage (0-100)
- `powerUnitStatus`: Power unit health status
- `daysSinceLastService`: Maintenance tracking

---

## 📊 Usage Examples

### Creating a Vehicle Object

```typescript
// WHERE: In FleetService or components
// WHY: To create a new vehicle record
// WHEN: When importing data or adding new vehicle
// HOW: Create object matching Vehicle interface
// WHICH: TypeScript interface enforcement

const newVehicle: Vehicle = {
  id: '1',
  vehicleId: 'VH-001',
  status: 'Active',
  healthScore: 85,
  workOrderCount: 2,
  location: 'New York',
  cost: 45000,
  companyId: '1',
  companyName: 'FleetCorp',
  daysBetweenWorkOrders: 45,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
```

### Filtering Vehicles by Status

```typescript
// WHERE: In FleetService.getVehicles()
// WHY: To get vehicles by status
// WHEN: When filtering dashboard or list views
// HOW: Use filter with status property
// WHICH: TypeScript type narrowing

const activeVehicles = vehicles.filter(
  (v: Vehicle) => v.status === 'Active'
);
```

### Calculating Dashboard Stats

```typescript
// WHERE: In FleetService.calculateDashboardStats()
// WHY: To compute dashboard statistics
// WHEN: When loading dashboard data
// HOW: Aggregate vehicle data
// WHICH: Array methods, TypeScript types

const totalFleetUnits = vehicles.length;
const avgHealthScore = vehicles.length > 0
  ? vehicles.reduce((sum, v) => sum + v.healthScore, 0) / vehicles.length
  : 0;
```

---

## 🔗 Related Files

- **Used by**: `src/app/shared/services/fleet.service.ts`
- **Used by**: `src/app/components/dashboard/workspace-dashboard/workspace-dashboard.component.ts`
- **Used by**: `src/app/components/vehicle-management/vehicle-management.component.ts`

---

## 📚 Documentation Links

### TypeScript
- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
- [Optional Properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties)
- [String Literal Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)

### Related Documentation
- [Fleet Service](../Services/fleet.service.md)
- [Workspace Dashboard Component](../Components/workspace-dashboard/workspace-dashboard.component.ts.md)

---

**Next**: Read [Dashboard Stats Interface](./dashboard-stats.interface.md) or [Workspace Interface](./workspace.interface.md)
