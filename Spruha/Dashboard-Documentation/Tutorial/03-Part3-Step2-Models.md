# Step 2: Creating Core Models/Interfaces

## What You'll Learn

- How to create TypeScript interfaces
- Understanding data structures
- Type safety in Angular

## Why It Matters

Interfaces define data structures, ensuring:
- Type safety at compile time
- Clear contracts between components
- Better IDE autocomplete
- Reduced runtime errors

## Prerequisites

- Basic TypeScript knowledge
- Understanding of objects and types
- Angular project created

## Step-by-Step Instructions

### 2.1 Create Vehicle Interface

**WHERE**: `src/app/shared/models/vehicle.interface.ts`

**WHY**: Defines the structure for all vehicle data

**WHEN**: Before creating services that use vehicles

**HOW**: Create file with TypeScript interface

**WHICH**: TypeScript interface pattern

**Full Code with Explanations**:

```typescript
// WHERE: src/app/shared/models/vehicle.interface.ts
// WHY: Define Vehicle data structure
// WHEN: Used throughout the application for vehicle data
// HOW: TypeScript interface with properties
// WHICH: TypeScript interface pattern

// Line 1: Define VehicleStatus as union type
// WHY: Restricts status to only valid values ('Active', 'Maintenance', 'Standby', 'Critical')
// WHEN: Used when assigning or checking vehicle status
// HOW: Union type with string literals
// WHICH: TypeScript union type pattern
// Documentation: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types
export type VehicleStatus = 'Active' | 'Maintenance' | 'Standby' | 'Critical';

// Line 3-27: Define Vehicle interface
// WHY: Core data structure for vehicles in the fleet
// WHEN: Used when creating, reading, updating vehicle data
// HOW: TypeScript interface with typed properties
// WHICH: TypeScript interface pattern
// Documentation: https://www.typescriptlang.org/docs/handbook/2/objects.html
export interface Vehicle {
  // Line 4: id - unique system identifier
  // WHY: Database/system ID for internal operations
  // WHEN: Used for lookups, updates, deletions
  // HOW: String type
  // WHICH: Standard ID pattern
  id: string;

  // Line 5: vehicleId - human-readable identifier
  // WHY: User-facing identifier like "VH-001"
  // WHEN: Displayed in UI, used in search/filter
  // HOW: String type
  // WHICH: Business identifier pattern
  vehicleId: string;

  // Line 6: status - current operational status
  // WHY: Determines which widgets/columns display vehicle
  // WHEN: Updated when status changes, used for filtering
  // HOW: VehicleStatus union type (defined above)
  // WHICH: Type-safe enum-like pattern
  status: VehicleStatus;

  // Line 7: healthScore - vehicle condition (0-100)
  // WHY: Overall health metric for dashboard calculations
  // WHEN: Calculated from multiple factors, displayed in metrics
  // HOW: Number type (0-100 range)
  // WHICH: Numeric metric pattern
  healthScore: number;

  // Line 8: workOrderCount - number of active work orders
  // WHY: Used for maintenance queue priority and statistics
  // WHEN: Updated when work orders created/completed
  // HOW: Number type (count)
  // WHICH: Counter pattern
  workOrderCount: number;

  // Line 9: location - vehicle location
  // WHY: Geographic tracking and filtering
  // WHEN: Displayed in lists/tables, used in filtering
  // HOW: String type
  // WHICH: String property pattern
  location: string;

  // Line 10: cost - operational cost
  // WHY: Financial tracking and dashboard metrics
  // WHEN: Updated when costs recorded, displayed in dashboard
  // HOW: Number type (currency amount)
  // WHICH: Numeric property pattern
  cost: number;

  // Line 11: companyId - company identifier
  // WHY: Multi-tenant support and data scoping
  // WHEN: Used in filtering by company
  // HOW: String type
  // WHICH: Foreign key pattern
  companyId: string;

  // Line 12: companyName - optional company name
  // WHY: Display without additional lookup (denormalized)
  // WHEN: Displayed in UI without joining to company table
  // HOW: Optional string property (? = may be undefined)
  // WHICH: Optional property pattern
  // Documentation: https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties
  companyName?: string;

  // Line 13: daysBetweenWorkOrders - optional maintenance metric
  // WHY: Maintenance scheduling and efficiency calculations
  // WHEN: Calculated from work order history
  // HOW: Optional number property
  // WHICH: Optional property pattern
  daysBetweenWorkOrders?: number;

  // Line 14: lastMaintenanceDate - optional date
  // WHY: Maintenance due calculations
  // WHEN: Updated when maintenance completed
  // HOW: Optional Date or string (union type for API compatibility)
  // WHICH: Flexible date pattern (Date | string)
  // Documentation: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types
  lastMaintenanceDate?: Date | string;

  // Line 15: createdAt - record creation timestamp
  // WHY: Audit trail and sorting
  // WHEN: Set when record created
  // HOW: Optional Date or string
  // WHICH: Timestamp pattern
  createdAt?: Date | string;

  // Line 16: updatedAt - last update timestamp
  // WHY: Change tracking and sync conflict resolution
  // WHEN: Updated on each modification
  // HOW: Optional Date or string
  // WHICH: Timestamp pattern
  updatedAt?: Date | string;

  // Lines 18-26: Extended properties (all optional)
  // WHY: Additional vehicle details for detail views
  // WHEN: Displayed in vehicle detail pages
  // HOW: Optional properties
  // WHICH: Optional properties pattern
  make?: string;
  model?: string;
  year?: number;
  vinCode?: string;
  licensePlate?: string;
  specifications?: string[];
  imageUrls?: string[];  // Array of image URLs
  qrCode?: string;
}
```

**Checkpoint**: 
1. Create file: `src/app/shared/models/vehicle.interface.ts`
2. Copy code above
3. Verify no TypeScript errors: `ng build --configuration development`

**Common Mistakes**:
- Forgetting `export` keyword (won't be usable elsewhere)
- Using incorrect types (e.g., `number` instead of `string` for ID)
- Forgetting optional `?` for optional properties

**Documentation Links**:
- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
- [Optional Properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties)

---

### 2.2 Create Dashboard Stats Interface

**WHERE**: `src/app/shared/models/dashboard-stats.interface.ts`

**WHY**: Defines structure for dashboard statistics

**WHEN**: Before creating dashboard statistics calculations

**HOW**: Create file with interfaces

**WHICH**: TypeScript interface with nested objects

**Full Code**:

```typescript
// WHERE: src/app/shared/models/dashboard-stats.interface.ts
// WHY: Define dashboard statistics structure
// WHEN: Used when calculating/displaying dashboard metrics
// HOW: TypeScript interfaces
// WHICH: Interface with nested object pattern

// Lines 1-17: DashboardStats interface
// WHY: Complete dashboard statistics structure
// WHEN: Returned from FleetService.getDashboardStats()
// HOW: Interface with metrics and nested statusDistribution
// WHICH: Interface with nested object pattern
// Documentation: https://www.typescriptlang.org/docs/handbook/2/objects.html#object-types
export interface DashboardStats {
  // Line 2: Total fleet units count
  // WHY: Primary metric for dashboard
  // WHEN: Calculated from vehicles array length
  // HOW: Number type
  // WHICH: Counter pattern
  totalFleetUnits: number;

  // Line 3: Percentage change from previous period
  // WHY: Shows fleet growth/decline trend
  // WHEN: Calculated comparing current vs previous data
  // HOW: Number type (percentage)
  // WHICH: Trend calculation pattern
  totalFleetUnitsTrend: number; // percentage change

  // Line 4: Count of vehicles in maintenance
  // WHY: Maintenance efficiency metric
  // WHEN: Calculated from vehicles with 'Maintenance' or 'Critical' status
  // HOW: Number type (count)
  // WHICH: Filtered count pattern
  maintenanceEfficiency: number; // count of vehicles in maintenance

  // Line 5: Maintenance efficiency trend
  // WHY: Shows if maintenance load is increasing/decreasing
  // WHEN: Calculated comparing current vs previous
  // HOW: Number type (percentage)
  // WHICH: Trend calculation pattern
  maintenanceEfficiencyTrend: number; // percentage change

  // Lines 6-9: Operational cost metrics
  // WHY: Financial tracking
  // WHEN: Calculated from vehicle costs
  // HOW: Number types
  // WHICH: Financial metric pattern
  operationalCost: number;
  operationalCostTrend: number; // percentage change

  // Lines 8-9: Efficiency index (average health score)
  // WHY: Overall fleet health metric
  // WHEN: Calculated as average of all vehicle health scores
  // HOW: Number type (0-100 average)
  // WHICH: Average calculation pattern
  efficiencyIndex: number; // average health score
  efficiencyIndexTrend: number; // percentage change

  // Lines 10-15: Status distribution object
  // WHY: Breakdown of vehicles by status for charts
  // WHEN: Calculated from vehicle statuses
  // HOW: Nested object with number properties
  // WHICH: Nested object pattern
  // Documentation: https://www.typescriptlang.org/docs/handbook/2/objects.html#object-types
  statusDistribution: {
    active: number;
    maintenance: number;
    standby: number;
    critical: number;
  };

  // Line 16: Utilization percentage
  // WHY: Shows percentage of fleet in use
  // WHEN: Calculated as (Active + Maintenance) / Total * 100
  // HOW: Number type (percentage 0-100)
  // WHICH: Percentage calculation pattern
  utilization: number; // percentage: (Active + Maintenance) / Total
}

// Lines 19-23: HistoricalDataPoint interface
// WHY: Single data point for time-series charts
// WHEN: Used in historical data for charts
// HOW: Interface with period and metrics
// WHICH: Data point pattern
export interface HistoricalDataPoint {
  period: string; // month or date label (e.g., "Jan", "2024-01")
  activeVehicles: number;
  vehiclesInService: number; // Active + Maintenance
}

// Lines 25-28: HistoricalData interface
// WHY: Complete historical data for charts
// WHEN: Returned from FleetService.getHistoricalData()
// HOW: Interface with array and period
// WHICH: Data collection pattern
export interface HistoricalData {
  dataPoints: HistoricalDataPoint[];  // Array of data points
  period: '30d' | 'quarter' | 'year';  // Union type for period
}
```

**Checkpoint**: Verify file created and no TypeScript errors

**Documentation Links**:
- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)

---

### 2.3 Create Workspace Interface

**WHERE**: `src/app/shared/models/workspace.interface.ts`

**WHY**: Defines workspace system types for widget management

**WHEN**: Before creating workspace components and services

**HOW**: Create file with multiple related interfaces

**WHICH**: Multiple related interfaces pattern

**Key Interfaces**:

1. **WidgetType** (Lines 1-7): Union type for widget types
   - **WHERE**: Line 1
   - **WHY**: Restricts widget types to valid values
   - **WHICH**: Union type pattern

2. **GridPosition** (Lines 9-14): Widget position in grid
   - **WHERE**: Lines 9-14
   - **WHY**: Defines widget position with column/row and span
   - **WHICH**: Grid position pattern

3. **WidgetFrame** (Lines 21-32): Complete widget structure
   - **WHERE**: Lines 21-32
   - **WHY**: Core interface for all widgets
   - **WHICH**: Widget structure pattern

4. **WorkspaceState** (Lines 41-49): Complete workspace state
   - **WHERE**: Lines 41-49
   - **WHY**: Persisted state structure for localStorage
   - **WHICH**: State persistence pattern

**Full Code**: See [Workspace Interface Documentation](../Models/workspace.interface.md) for complete code with explanations.

---

### 2.4 Create Activity Interface

**WHERE**: `src/app/shared/models/activity.interface.ts`

**WHY**: Defines activity feed data structure

**WHEN**: Before creating activity feed components

**HOW**: Create file with union type and interface

**WHICH**: Union type + interface pattern

**Full Code**: See [Activity Interface Documentation](../Models/activity.interface.md) for complete code with explanations.

---

## Checkpoints

After completing Step 2:

1. ✅ All 4 interface files created
2. ✅ No TypeScript compilation errors
3. ✅ All interfaces exported
4. ✅ Interfaces can be imported in other files

**Verification**:
```bash
# Check for TypeScript errors
ng build --configuration development

# If successful, you'll see "Build completed successfully"
```

---

## Common Mistakes

1. **Forgetting `export` keyword** - Interfaces won't be accessible elsewhere
2. **Wrong property types** - Causes type errors in services/components
3. **Missing optional `?`** - Properties required when they should be optional
4. **Incorrect union types** - TypeScript won't allow invalid values

---

## Next Steps

1. ✅ Step 2 Complete - Models/Interfaces created
2. → Continue to [Step 3: Building Core Services](./04-Part3-Step3-Services.md)

**Documentation Links**:
- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Model Documentation](../Models/README.md)

---

**Next**: Continue to [Step 3: Building Core Services](./04-Part3-Step3-Services.md)
