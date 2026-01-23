# Activity Interface - Complete Documentation

## 📄 File Information

- **File Path**: `src/app/shared/models/activity.interface.ts`
- **Purpose**: Defines activity feed data structure
- **Dependencies**: None (pure TypeScript interfaces)
- **Used By**: 
  - `FleetService` - Activity tracking
  - `WorkspaceDashboardComponent` - Activity feed display

## 🎯 ActivityType Union Type

### WHERE
**Location**: `src/app/shared/models/activity.interface.ts:1-8`

### WHY
Defines allowed activity types. Ensures only valid activity types are created.

### Values
- `'status_change'`: Vehicle status changed
- `'vehicle_added'`: New vehicle added
- `'excel_import'`: Excel file imported
- `'health_score_alert'`: Health score below threshold
- `'maintenance_scheduled'`: Maintenance scheduled
- `'maintenance_completed'`: Maintenance completed
- `'capacity_alert'`: Capacity threshold reached

### WHICH
- Union type for type safety
- String literal types

---

## 📋 Activity Interface

### WHERE
**Location**: `src/app/shared/models/activity.interface.ts:10-19`

### WHY
Defines structure for activity feed entries. Used for:
- Activity feed display
- Activity history tracking
- Audit logging

### Properties

#### `id: string`
**WHY**: Unique activity identifier

#### `type: ActivityType`
**WHY**: Activity type from union above

#### `title: string`
**WHY**: Activity title for display

#### `description: string`
**WHY**: Detailed activity description

#### `vehicleId?: string`
**WHY**: Optional link to vehicle (if vehicle-related)

#### `facilityId?: string`
**WHY**: Optional link to facility (if facility-related)

#### `timestamp: Date | string`
**WHY**: When activity occurred. Union type for API compatibility.

#### `icon?: string`
**WHY**: Optional icon URL for display

---

## 🔗 Related Files

- [Fleet Service](../Services/fleet.service.md) - Manages activities
- [Workspace Dashboard Component](../Components/workspace-dashboard/workspace-dashboard.component.ts.md) - Displays activities

---

## 📚 Documentation Links

- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)

---

**Next**: Explore [Services Documentation](../Services/README.md)
