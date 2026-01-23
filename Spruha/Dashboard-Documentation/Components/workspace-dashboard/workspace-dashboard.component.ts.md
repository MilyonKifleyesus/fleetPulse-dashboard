# Workspace Dashboard Component TypeScript - Complete Documentation

## 📄 File Information

- **File Path**: `src/app/components/dashboard/workspace-dashboard/workspace-dashboard.component.ts`
- **Purpose**: Main dashboard component orchestrating data and widgets
- **Dependencies**: FleetService, WorkspaceStateService, WorkspaceModeService, WidgetRegistryService

## 🎯 Component Overview

### WHERE
**Location**: `src/app/components/dashboard/workspace-dashboard/workspace-dashboard.component.ts`

### WHY
Main dashboard component that:
- Loads vehicle data and statistics
- Initializes widgets
- Calculates metrics and charts
- Manages dashboard state

### WHEN
Rendered when navigating to `/dashboard` route

### HOW
Uses RxJS forkJoin to load data, initializes default widgets, calculates metrics

### WHICH
**Concepts Used:**
- Angular Standalone Component
- RxJS forkJoin for parallel data loading
- Angular Dependency Injection
- Component lifecycle hooks

**Documentation Links:**
- [Angular Standalone Components](https://angular.io/guide/standalone-components)
- [RxJS forkJoin](https://rxjs.dev/api/index/function/forkJoin)

---

## 🔑 Key Methods

### `loadData(): void`
**WHERE**: Lines 255-297

**WHY**: Loads all dashboard data in parallel using forkJoin

**WHEN**: Called on init and when data refresh is needed

**HOW**: 
1. Calls multiple service methods in parallel
2. Combines results with forkJoin
3. Updates component data
4. Calculates metrics/charts

**WHICH**: RxJS forkJoin pattern for parallel async operations

### `calculateCards(): void`
**WHERE**: Lines 304-365

**WHY**: Calculates metric card data from vehicle statistics

**WHEN**: Called after data is loaded

**HOW**: Aggregates vehicle data, calculates trends, creates card objects

**WHICH**: Data transformation pattern

---

## 📚 Documentation Links

- [RxJS forkJoin](https://rxjs.dev/api/index/function/forkJoin)
- [Angular Component Lifecycle](https://angular.io/guide/lifecycle-hooks)

---

**Next**: Read [HTML Template](./workspace-dashboard.component.html.md)
