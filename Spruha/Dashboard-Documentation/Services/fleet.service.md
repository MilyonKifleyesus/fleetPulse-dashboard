# Fleet Service - Complete Documentation

## 📄 File Information

- **File Path**: `src/app/shared/services/fleet.service.ts`
- **Purpose**: Manages vehicle data with localStorage persistence
- **Dependencies**: 
  - `Vehicle` interface
  - `DashboardStats` interface
  - `Activity` interface
  - RxJS Observables
- **Used By**: 
  - `WorkspaceDashboardComponent`
  - `DashboardComponent`
  - All components that need vehicle data

## 🎯 Service Overview

### WHERE
**Location**: `src/app/shared/services/fleet.service.ts`

### WHY
Central service for all vehicle data operations. Provides:
- CRUD operations for vehicles
- Dashboard statistics calculation
- Activity tracking
- localStorage persistence
- Observable data streams for reactive updates

### WHEN
Used whenever:
- Loading vehicle data
- Calculating dashboard statistics
- Managing activities
- Persisting data to localStorage

### HOW
Uses Angular's dependency injection and RxJS Observables for reactive data management.

### WHICH
**Concepts Used:**
- Angular Injectable service
- RxJS Observables and operators
- localStorage API
- TypeScript interfaces

**Documentation Links:**
- [Angular Services](https://angular.io/guide/dependency-injection)
- [RxJS Observables](https://rxjs.dev/guide/observable)

---

## 🔑 Key Methods

### `getVehicles(): Observable<Vehicle[]>`
**WHERE**: Lines 36-139

**WHY**: Returns all vehicles as Observable. Uses localStorage with fallback to mock data.

**WHEN**: Called when components need vehicle data

**HOW**: 
1. Loads from localStorage
2. If empty, returns mock data
3. Returns Observable with delay simulation

**WHICH**: RxJS Observable pattern with error handling

### `calculateDashboardStats(vehicles: Vehicle[]): DashboardStats`
**WHERE**: Lines 435-477

**WHY**: Calculates dashboard statistics from vehicle data

**WHEN**: Called when dashboard needs updated statistics

**HOW**: Aggregates vehicle data (count, status distribution, costs, health scores)

**WHICH**: Pure function pattern for calculations

### `saveVehiclesToStorage(vehicles: Vehicle[]): void`
**WHERE**: Lines 307-315

**WHY**: Persists vehicles to localStorage for data persistence

**WHEN**: Called after any vehicle data changes

**HOW**: Serializes to JSON and stores in localStorage

**WHICH**: localStorage API for browser storage

---

## 📚 Documentation Links

- [Angular Dependency Injection](https://angular.io/guide/dependency-injection)
- [RxJS Observables](https://rxjs.dev/guide/observable)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Next**: Read [Workspace State Service](./workspace-state.service.md)
