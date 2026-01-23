# Dashboard Stats Interface - Complete Documentation

## 📄 File Information

- **File Path**: `src/app/shared/models/dashboard-stats.interface.ts`
- **Purpose**: Defines dashboard statistics and metrics data structures
- **Dependencies**: None (pure TypeScript interfaces)
- **Used By**: 
  - `FleetService` - For calculating statistics
  - `WorkspaceDashboardComponent` - For displaying metrics
  - `DashboardComponent` - For dashboard statistics display

## 🎯 DashboardStats Interface

### WHERE
**Location**: `src/app/shared/models/dashboard-stats.interface.ts:1-17`

### WHY
Defines the structure for dashboard statistics calculated from vehicle data. Ensures:
- Consistent statistics format across the application
- Type safety for metric calculations
- Clear contract for dashboard components
- Accurate metric display

### WHEN
Used when:
- Calculating dashboard statistics from vehicles
- Displaying metrics in dashboard widgets
- Updating dashboard after data changes
- Loading historical data

### HOW
Interface defines all dashboard metrics and their types:
```typescript
export interface DashboardStats {
  totalFleetUnits: number;
  totalFleetUnitsTrend: number;
  maintenanceEfficiency: number;
  maintenanceEfficiencyTrend: number;
  operationalCost: number;
  operationalCostTrend: number;
  efficiencyIndex: number;
  efficiencyIndexTrend: number;
  statusDistribution: { active: number; maintenance: number; standby: number; critical: number; };
  utilization: number;
}
```

### WHICH
**Concepts Used:**
- TypeScript Interfaces
- Nested objects for complex data
- Percentage calculations for trends

**Documentation Links:**
- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#object-types)

---

## 📊 Property Explanations

### `totalFleetUnits: number`
**WHERE**: Line 2

**WHY**: Total count of vehicles in the fleet. Primary metric for dashboard.

**WHEN**: Calculated whenever vehicles are loaded or updated

**HOW**: `vehicles.length`

**WHICH**: Simple counter metric

### `totalFleetUnitsTrend: number`
**WHERE**: Line 3

**WHY**: Percentage change from previous period. Shows fleet growth/decline.

**WHEN**: Calculated when comparing current vs previous period data

**HOW**: `((current - previous) / previous) * 100`

**WHICH**: Percentage calculation for trend analysis

### `statusDistribution: { active: number; ... }`
**WHERE**: Lines 10-15

**WHY**: Breakdown of vehicles by status. Used for charts and status indicators.

**WHEN**: Calculated from vehicle statuses

**HOW**: `vehicles.filter(v => v.status === 'Active').length` for each status

**WHICH**: Object with computed properties pattern

### `utilization: number`
**WHERE**: Line 16

**WHY**: Percentage of fleet in use. Calculated as `(Active + Maintenance) / Total * 100`

**WHEN**: Displayed in utilization widget/chart

**HOW**: `((active + maintenance) / total) * 100`

**WHICH**: Calculated percentage metric

---

## 📈 HistoricalData Interface

### WHERE
**Location**: `src/app/shared/models/dashboard-stats.interface.ts:25-28`

### WHY
Defines historical data structure for charts showing trends over time.

### WHEN
Used when displaying time-series charts (30 days, quarter, year)

### HOW
```typescript
export interface HistoricalData {
  dataPoints: HistoricalDataPoint[];
  period: '30d' | 'quarter' | 'year';
}
```

### WHICH
- Union type for period (`'30d' | 'quarter' | 'year'`)
- Array of data points for time series

---

## 🔗 Related Files

- [Fleet Service](../Services/fleet.service.md) - Calculates these stats
- [Workspace Dashboard Component](../Components/workspace-dashboard/workspace-dashboard.component.ts.md) - Uses these stats

---

## 📚 Documentation Links

- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)

---

**Next**: Read [Workspace Interface](./workspace.interface.md)
