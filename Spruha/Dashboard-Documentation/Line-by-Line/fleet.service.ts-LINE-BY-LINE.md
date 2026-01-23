# FleetService - Line-by-Line Complete Explanation

## 📄 File Information

- **File Path**: `src/app/shared/services/fleet.service.ts`
- **Total Lines**: 479
- **Purpose**: Central service for managing vehicle data, dashboard statistics, activities, and localStorage persistence
- **Dependencies**: RxJS, Angular Injectable, Vehicle/Company/Activity interfaces, DashboardStats interface

---

## 📋 Table of Contents

1. [Import Statements (Lines 1-11)](#import-statements-lines-1-11)
2. [Injectable Decorator (Lines 13-15)](#injectable-decorator-lines-13-15)
3. [Class Declaration & Properties (Lines 16-23)](#class-declaration--properties-lines-16-23)
4. [Constructor (Lines 25-30)](#constructor-lines-25-30)
5. [getVehicles Method (Lines 32-139)](#getvehicles-method-lines-32-139)
6. [getDashboardStats Method (Lines 141-159)](#getdashboardstats-method-lines-141-159)
7. [getHistoricalData Method (Lines 161-217)](#gethistoricaldata-method-lines-161-217)
8. [getCompanyStats Method (Lines 219-269)](#getcompanystats-method-lines-219-269)
9. [getRecentActivities Method (Lines 271-295)](#getrecentactivities-method-lines-271-295)
10. [refreshData Method (Lines 297-302)](#refreshdata-method-lines-297-302)
11. [Storage Methods (Lines 304-329)](#storage-methods-lines-304-329)
12. [Upsert Methods (Lines 331-397)](#upsert-methods-lines-331-397)
13. [Activity Methods (Lines 399-430)](#activity-methods-lines-399-430)
14. [calculateDashboardStats Method (Lines 432-477)](#calculatedashboardstats-method-lines-432-477)

---

## Import Statements (Lines 1-11)

### Line 1: `import { Injectable } from '@angular/core';`

**WHERE**: `src/app/shared/services/fleet.service.ts:1`

**WHY**: Imports the `Injectable` decorator from Angular core. This decorator tells Angular that this class can be injected as a dependency into other components/services.

**WHEN**: Used immediately when TypeScript compiles this file. Angular reads this decorator to register the service.

**HOW**: TypeScript import statement that brings in the `Injectable` decorator from Angular's core package.

**WHICH**: Angular Dependency Injection pattern - makes this class available for injection.

**Documentation Links**:
- [Angular Injectable](https://angular.io/api/core/Injectable)

---

### Line 2: `import { Observable, of, throwError, BehaviorSubject, interval } from 'rxjs';`

**WHERE**: `src/app/shared/services/fleet.service.ts:2`

**WHY**: Imports RxJS (Reactive Extensions) utilities for handling asynchronous operations:
- `Observable`: A stream of data that can be subscribed to
- `of`: Creates an Observable from a value
- `throwError`: Creates an Observable that emits an error
- `BehaviorSubject`: A type of Subject that holds the current value and emits it to new subscribers
- `interval`: Creates an Observable that emits numbers at regular intervals

**WHEN**: Used throughout the service for all data operations that return Observables.

**HOW**: TypeScript import from the RxJS library (reactive programming library).

**WHICH**: RxJS reactive programming pattern for handling asynchronous data streams.

**Documentation Links**:
- [RxJS Observable](https://rxjs.dev/api/index/class/Observable)
- [RxJS of](https://rxjs.dev/api/index/function/of)
- [RxJS throwError](https://rxjs.dev/api/index/function/throwError)
- [RxJS BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject)
- [RxJS interval](https://rxjs.dev/api/index/function/interval)

---

### Line 3: `import { catchError, delay } from 'rxjs/operators';`

**WHERE**: `src/app/shared/services/fleet.service.ts:3`

**WHY**: Imports RxJS operators for transforming Observable streams:
- `catchError`: Catches errors in an Observable stream and handles them gracefully
- `delay`: Delays the emission of values from an Observable (simulates network delay)

**WHEN**: Used in Observable pipes to add error handling and simulate network delays.

**HOW**: TypeScript import from RxJS operators package.

**WHICH**: RxJS operator pattern for transforming Observable streams.

**Documentation Links**:
- [RxJS catchError](https://rxjs.dev/api/operators/catchError)
- [RxJS delay](https://rxjs.dev/api/operators/delay)

---

### Line 4: `import { Vehicle } from '../models/vehicle.interface';`

**WHERE**: `src/app/shared/services/fleet.service.ts:4`

**WHY**: Imports the `Vehicle` interface/type definition. This defines the structure of vehicle data (what properties a vehicle object must have).

**WHEN**: Used as a type annotation throughout the service to ensure type safety.

**HOW**: TypeScript import statement that imports a type definition from a relative path (`../models/` means go up one folder, then into models folder).

**WHICH**: TypeScript interface pattern for type safety.

**Documentation Links**:
- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)

---

### Line 5: `import { Company } from '../models/company.interface';`

**WHERE**: `src/app/shared/services/fleet.service.ts:5`

**WHY**: Imports the `Company` interface that defines the structure of company data.

**WHEN**: Used in the `getCompanyStats()` method to return properly typed company data.

**HOW**: TypeScript import from relative path to models folder.

**WHICH**: TypeScript interface pattern.

---

### Lines 6-10: Multi-line import from dashboard-stats.interface

**WHERE**: `src/app/shared/services/fleet.service.ts:6-10`

**WHY**: Imports multiple interfaces from the dashboard-stats file:
- `DashboardStats`: Structure for dashboard statistics data
- `HistoricalData`: Structure for historical chart data
- `HistoricalDataPoint`: Structure for individual historical data points

**WHEN**: Used in methods that return dashboard statistics and historical data.

**HOW**: Multi-line import statement (split across lines for readability) from relative path.

**WHICH**: TypeScript multi-line import pattern.

---

### Line 11: `import { Activity } from '../models/activity.interface';`

**WHERE**: `src/app/shared/services/fleet.service.ts:11`

**WHY**: Imports the `Activity` interface that defines the structure of activity/event data.

**WHEN**: Used in methods that handle activity data (getRecentActivities, saveActivity).

**HOW**: TypeScript import from relative path.

**WHICH**: TypeScript interface pattern.

---

## Injectable Decorator (Lines 13-15)

### Line 13: `@Injectable({`

**WHERE**: `src/app/shared/services/fleet.service.ts:13`

**WHY**: This is a decorator (starts with `@`) that marks this class as an Angular service that can be injected into other components/services.

**WHEN**: Angular reads this decorator when the application starts to register the service.

**HOW**: Decorator syntax - Angular processes this before the class is used.

**WHICH**: Angular Injectable decorator pattern.

**Documentation Links**:
- [Angular Injectable](https://angular.io/api/core/Injectable)

---

### Line 14: `providedIn: 'root',`

**WHERE**: `src/app/shared/services/fleet.service.ts:14`

**WHY**: Tells Angular to provide this service at the root level. This means:
- Only ONE instance of this service exists in the entire application (singleton pattern)
- Any component/service can inject it
- No need to add it to providers array in modules

**WHEN**: Angular uses this configuration when the service is first requested.

**HOW**: Property of the Injectable decorator configuration object.

**WHICH**: Angular root-level service injection pattern.

**Documentation Links**:
- [Angular providedIn](https://angular.io/api/core/Injectable#providedIn)

---

### Line 15: `})`

**WHERE**: `src/app/shared/services/fleet.service.ts:15`

**WHY**: Closes the Injectable decorator configuration object.

**WHEN**: TypeScript parser uses this to know where the decorator ends.

**HOW**: Closing brace for the object literal.

**WHICH**: JavaScript/TypeScript object literal syntax.

---

## Class Declaration & Properties (Lines 16-23)

### Line 16: `export class FleetService {`

**WHERE**: `src/app/shared/services/fleet.service.ts:16`

**WHY**: Declares and exports the `FleetService` class. The `export` keyword makes it available for import in other files.

**WHEN**: This class is instantiated by Angular's dependency injection system when first requested.

**HOW**: TypeScript class declaration with export keyword.

**WHICH**: TypeScript class pattern with module export.

**Documentation Links**:
- [TypeScript Classes](https://www.typescriptlang.org/docs/handbook/classes.html)
- [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

---

### Line 17: `private dataRefreshSubject = new BehaviorSubject<Date>(new Date());`

**WHERE**: `src/app/shared/services/fleet.service.ts:17`

**WHY**: Creates a private BehaviorSubject that holds the current refresh date/time. 
- `private`: Only accessible within this class
- `BehaviorSubject`: A type of RxJS Subject that stores the current value
- `<Date>`: TypeScript generic - this Subject emits Date objects
- `new Date()`: Initial value is the current date/time

**WHEN**: Created when the service is instantiated. Used to notify subscribers when data should be refreshed.

**HOW**: Creates a new BehaviorSubject instance with initial value of current date.

**WHICH**: RxJS BehaviorSubject pattern for state management.

**Documentation Links**:
- [RxJS BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject)

---

### Line 18: `public dataRefresh$ = this.dataRefreshSubject.asObservable();`

**WHERE**: `src/app/shared/services/fleet.service.ts:18`

**WHY**: Creates a public Observable that other components can subscribe to for refresh notifications.
- `public`: Accessible from outside this class
- `dataRefresh$`: The `$` suffix is a naming convention for Observables
- `asObservable()`: Converts the BehaviorSubject to a read-only Observable (prevents external code from calling `.next()`)

**WHEN**: Created when service is instantiated. Components subscribe to this to know when to refresh data.

**HOW**: Calls the `asObservable()` method on the BehaviorSubject to create a read-only Observable.

**WHICH**: RxJS Observable pattern for reactive data streams.

**Documentation Links**:
- [RxJS Observable](https://rxjs.dev/api/index/class/Observable)

---

### Line 20: `// localStorage keys`

**WHERE**: `src/app/shared/services/fleet.service.ts:20`

**WHY**: Comment explaining that the following constants are keys used for localStorage.

**WHEN**: This is just a comment - it doesn't execute, just helps developers understand the code.

**HOW**: Single-line comment syntax in TypeScript/JavaScript.

**WHICH**: Code documentation pattern.

---

### Line 21: `private readonly VEHICLES_KEY = 'fleetpulse-vehicles';`

**WHERE**: `src/app/shared/services/fleet.service.ts:21`

**WHY**: Defines a constant string used as the key when storing/retrieving vehicles from localStorage.
- `private`: Only accessible within this class
- `readonly`: Cannot be changed after initialization
- `VEHICLES_KEY`: Constant name (UPPER_CASE is convention for constants)
- `'fleetpulse-vehicles'`: The actual key string used in localStorage

**WHEN**: Used whenever saving or loading vehicles from localStorage.

**HOW**: TypeScript constant declaration with readonly modifier.

**WHICH**: Constant pattern for avoiding magic strings.

---

### Line 22: `private readonly ACTIVITIES_KEY = 'fleetpulse-activities';`

**WHERE**: `src/app/shared/services/fleet.service.ts:22`

**WHY**: Constant for the localStorage key used for activities data.

**WHEN**: Used in `saveActivity()` and `getActivitiesFromStorage()` methods.

**HOW**: Same pattern as line 21.

**WHICH**: Constant pattern.

---

### Line 23: `private readonly LAST_SYNC_KEY = 'fleetpulse-last-sync';`

**WHERE**: `src/app/shared/services/fleet.service.ts:23`

**WHY**: Constant for the localStorage key used to store the last synchronization timestamp.

**WHEN**: Used in `saveVehiclesToStorage()` to track when data was last saved.

**HOW**: Same pattern as previous constants.

**WHICH**: Constant pattern.

---

## Constructor (Lines 25-30)

### Line 25: `constructor() {`

**WHERE**: `src/app/shared/services/fleet.service.ts:25`

**WHY**: Constructor method - runs automatically when the service is first created/instantiated.

**WHEN**: Executed once when Angular creates the service instance (when first injected).

**HOW**: TypeScript class constructor syntax.

**WHICH**: TypeScript constructor pattern.

**Documentation Links**:
- [TypeScript Constructors](https://www.typescriptlang.org/docs/handbook/classes.html#constructors)

---

### Line 26: `// Auto-refresh every 5 minutes (300000 ms)`

**WHERE**: `src/app/shared/services/fleet.service.ts:26`

**WHY**: Comment explaining the auto-refresh mechanism.

**WHEN**: Just a comment, doesn't execute.

**HOW**: Comment syntax.

**WHICH**: Code documentation.

---

### Line 27: `interval(300000).subscribe(() => {`

**WHERE**: `src/app/shared/services/fleet.service.ts:27`

**WHY**: Creates an Observable that emits a value every 300,000 milliseconds (5 minutes).
- `interval(300000)`: Creates an Observable that emits numbers every 5 minutes
- `.subscribe()`: Subscribes to the Observable to receive emissions
- `() => {`: Arrow function that runs each time the interval emits

**WHEN**: Starts immediately when service is created and continues running.

**HOW**: RxJS interval function creates a timer Observable, then subscribes to it.

**WHICH**: RxJS interval pattern for periodic operations.

**Documentation Links**:
- [RxJS interval](https://rxjs.dev/api/index/function/interval)

---

### Line 28: `this.dataRefreshSubject.next(new Date());`

**WHERE**: `src/app/shared/services/fleet.service.ts:28`

**WHY**: Emits a new Date value through the BehaviorSubject, notifying all subscribers that data should be refreshed.
- `this.dataRefreshSubject`: References the BehaviorSubject created on line 17
- `.next()`: Method to emit a new value
- `new Date()`: Creates a new Date object with current timestamp

**WHEN**: Executes every 5 minutes (when interval emits).

**HOW**: Calls the `next()` method on the BehaviorSubject with a new Date.

**WHICH**: RxJS Subject emission pattern.

**Documentation Links**:
- [RxJS Subject.next](https://rxjs.dev/api/index/class/Subject#next)

---

### Line 29: `});`

**WHERE**: `src/app/shared/services/fleet.service.ts:29`

**WHY**: Closes the arrow function and the subscribe call.

**WHEN**: Part of the subscription setup.

**HOW**: Closing braces for the function and method call.

**WHICH**: JavaScript/TypeScript syntax.

---

### Line 30: `}`

**WHERE**: `src/app/shared/services/fleet.service.ts:30`

**WHY**: Closes the constructor method.

**WHEN**: Marks the end of constructor execution.

**HOW**: Closing brace for the constructor.

**WHICH**: TypeScript syntax.

---

## getVehicles Method (Lines 32-139)

### Lines 32-35: Method documentation and signature

**WHERE**: `src/app/shared/services/fleet.service.ts:32-35`

**WHY**: 
- Lines 32-35: JSDoc comment explaining what the method does
- Line 36: Method signature that returns an Observable of Vehicle array

**WHEN**: Called when components need to load vehicle data.

**HOW**: Method declaration with return type annotation.

**WHICH**: TypeScript method pattern with Observable return type.

---

### Line 37: `const storedVehicles = this.loadVehiclesFromStorage();`

**WHERE**: `src/app/shared/services/fleet.service.ts:37`

**WHY**: Calls the `loadVehiclesFromStorage()` method to get vehicles from localStorage and stores the result in a constant.

**WHEN**: Executes immediately when `getVehicles()` is called.

**HOW**: Method call that returns an array of vehicles (or empty array if none stored).

**WHICH**: Method call pattern.

---

### Line 39: `// If no stored data, return mock data for initial setup`

**WHERE**: `src/app/shared/services/fleet.service.ts:39`

**WHY**: Comment explaining the fallback logic.

**WHEN**: Just a comment.

**HOW**: Comment syntax.

**WHICH**: Code documentation.

---

### Line 40: `if (storedVehicles.length === 0) {`

**WHERE**: `src/app/shared/services/fleet.service.ts:40`

**WHY**: Checks if there are no stored vehicles (empty array). If true, we'll return mock data.

**WHEN**: Evaluates immediately after loading from storage.

**HOW**: Conditional statement checking array length.

**WHICH**: JavaScript conditional pattern.

---

### Line 41: `const mockVehicles: Vehicle[] = [`

**WHERE**: `src/app/shared/services/fleet.service.ts:41`

**WHY**: Declares a constant array of Vehicle objects. The `: Vehicle[]` is a type annotation saying this array contains Vehicle objects.

**WHEN**: Only executes if no stored vehicles exist.

**HOW**: TypeScript array declaration with type annotation.

**WHICH**: TypeScript typed array pattern.

---

### Lines 42-55: First Mock Vehicle (VH-001)

**WHERE**: `src/app/shared/services/fleet.service.ts:42-55`

**WHY**: Creates the first mock vehicle object with all required properties:
- `id: '1'`: Unique identifier
- `vehicleId: 'VH-001'`: Human-readable vehicle ID
- `status: 'Active'`: Current status
- `healthScore: 85`: Health score out of 100
- `workOrderCount: 2`: Number of work orders
- `location: 'New York'`: Vehicle location
- `cost: 45000`: Vehicle cost
- `companyId: '1'`: ID of owning company
- `companyName: 'FleetCorp'`: Name of owning company
- `daysBetweenWorkOrders: 45`: Days between work orders
- `createdAt`: ISO timestamp when created
- `updatedAt`: ISO timestamp when last updated

**WHEN**: Only if no stored vehicles exist.

**HOW**: Object literal with all Vehicle interface properties.

**WHICH**: TypeScript object literal pattern.

---

### Lines 56-69: Second Mock Vehicle (VH-002)

**WHERE**: `src/app/shared/services/fleet.service.ts:56-69`

**WHY**: Second mock vehicle with different data (Los Angeles, higher health score, etc.).

**WHEN**: Only if no stored vehicles exist.

**HOW**: Same pattern as first vehicle.

**WHICH**: Object literal pattern.

---

### Lines 70-83: Third Mock Vehicle (VH-003)

**WHERE**: `src/app/shared/services/fleet.service.ts:70-83`

**WHY**: Third mock vehicle with 'Maintenance' status, lower health score.

**WHEN**: Only if no stored vehicles exist.

**HOW**: Same pattern.

**WHICH**: Object literal pattern.

---

### Lines 84-97: Fourth Mock Vehicle (VH-004)

**WHERE**: `src/app/shared/services/fleet.service.ts:84-97`

**WHY**: Fourth mock vehicle with 'Critical' status, very low health score (42).

**WHEN**: Only if no stored vehicles exist.

**HOW**: Same pattern.

**WHICH**: Object literal pattern.

---

### Lines 98-111: Fifth Mock Vehicle (VH-005)

**WHERE**: `src/app/shared/services/fleet.service.ts:98-111`

**WHY**: Fifth mock vehicle with 'Active' status, good health score (88).

**WHEN**: Only if no stored vehicles exist.

**HOW**: Same pattern.

**WHICH**: Object literal pattern.

---

### Lines 112-125: Sixth Mock Vehicle (VH-006)

**WHERE**: `src/app/shared/services/fleet.service.ts:112-125`

**WHY**: Sixth mock vehicle with 'Standby' status, no work orders.

**WHEN**: Only if no stored vehicles exist.

**HOW**: Same pattern.

**WHICH**: Object literal pattern.

---

### Line 126: `];`

**WHERE**: `src/app/shared/services/fleet.service.ts:126`

**WHY**: Closes the mockVehicles array.

**WHEN**: Marks end of array definition.

**HOW**: Closing bracket for array literal.

**WHICH**: JavaScript array syntax.

---

### Line 127: `return of(mockVehicles).pipe(delay(100));`

**WHERE**: `src/app/shared/services/fleet.service.ts:127`

**WHY**: Returns the mock vehicles as an Observable with a 100ms delay.
- `of(mockVehicles)`: Creates an Observable that emits the mockVehicles array
- `.pipe(delay(100))`: Adds a 100ms delay to simulate network latency

**WHEN**: Executes if no stored vehicles exist.

**HOW**: RxJS `of()` creates Observable, `pipe()` chains operators, `delay()` adds delay.

**WHICH**: RxJS Observable creation and operator chaining pattern.

**Documentation Links**:
- [RxJS of](https://rxjs.dev/api/index/function/of)
- [RxJS pipe](https://rxjs.dev/api/index/function/pipe)
- [RxJS delay](https://rxjs.dev/api/operators/delay)

---

### Line 128: `}`

**WHERE**: `src/app/shared/services/fleet.service.ts:128`

**WHY**: Closes the `if` statement block.

**WHEN**: Marks end of conditional block.

**HOW**: Closing brace.

**WHICH**: JavaScript syntax.

---

### Line 130: `return of(storedVehicles).pipe(`

**WHERE**: `src/app/shared/services/fleet.service.ts:130`

**WHY**: Returns stored vehicles as an Observable. This executes if vehicles were found in localStorage.

**WHEN**: Executes if `storedVehicles.length > 0` (there are stored vehicles).

**HOW**: Creates Observable from stored vehicles array.

**WHICH**: RxJS Observable pattern.

---

### Line 131: `delay(100), // Simulate network delay`

**WHERE**: `src/app/shared/services/fleet.service.ts:131`

**WHY**: Adds 100ms delay to simulate network latency (makes it feel like a real API call).

**WHEN**: Part of the Observable pipe chain.

**HOW**: RxJS delay operator.

**WHICH**: RxJS operator pattern.

---

### Lines 132-137: Error handling

**WHERE**: `src/app/shared/services/fleet.service.ts:132-137`

**WHY**: Catches any errors that occur and returns a user-friendly error message.
- `catchError((error) => {`: Catches errors in the Observable stream
- `console.error(...)`: Logs error to console for debugging
- `return throwError(...)`: Returns an Observable that emits an error

**WHEN**: Executes if an error occurs during the Observable chain.

**HOW**: RxJS catchError operator handles errors gracefully.

**WHICH**: RxJS error handling pattern.

**Documentation Links**:
- [RxJS catchError](https://rxjs.dev/api/operators/catchError)

---

### Line 138: `);`

**WHERE**: `src/app/shared/services/fleet.service.ts:138`

**WHY**: Closes the pipe() method call.

**WHEN**: Marks end of Observable chain.

**HOW**: Closing parenthesis.

**WHICH**: JavaScript syntax.

---

### Line 139: `}`

**WHERE**: `src/app/shared/services/fleet.service.ts:139`

**WHY**: Closes the `getVehicles()` method.

**WHEN**: Marks end of method.

**HOW**: Closing brace.

**WHICH**: TypeScript syntax.

---

## getDashboardStats Method (Lines 141-159)

### Lines 141-144: Method documentation

**WHERE**: `src/app/shared/services/fleet.service.ts:141-144`

**WHY**: JSDoc comment explaining the method calculates dashboard statistics from stored vehicles.

**WHEN**: Documentation only.

**HOW**: Comment syntax.

**WHICH**: Code documentation.

---

### Line 145: `getDashboardStats(period?: string): Observable<DashboardStats> {`

**WHERE**: `src/app/shared/services/fleet.service.ts:145`

**WHY**: Method signature that:
- Takes optional `period` parameter (the `?` makes it optional)
- Returns an Observable of DashboardStats type

**WHEN**: Called when dashboard needs statistics.

**HOW**: Method declaration with optional parameter and Observable return type.

**WHICH**: TypeScript method with optional parameter pattern.

---

### Line 146: `const vehicles = this.loadVehiclesFromStorage();`

**WHERE**: `src/app/shared/services/fleet.service.ts:146`

**WHY**: Loads vehicles from localStorage to calculate stats from.

**WHEN**: Executes when method is called.

**HOW**: Method call to load vehicles.

**WHICH**: Method call pattern.

---

### Line 147: `const stats = this.calculateDashboardStats(vehicles);`

**WHERE**: `src/app/shared/services/fleet.service.ts:147`

**WHY**: Calls the `calculateDashboardStats()` method (defined later in the file) to compute statistics from the vehicles array.

**WHEN**: Executes after loading vehicles.

**HOW**: Method call passing vehicles array.

**WHICH**: Method call pattern.

---

### Line 149: `return of(stats).pipe(`

**WHERE**: `src/app/shared/services/fleet.service.ts:149`

**WHY**: Returns the calculated stats as an Observable.

**WHEN**: Executes after stats are calculated.

**HOW**: Creates Observable from stats object.

**WHICH**: RxJS Observable pattern.

---

### Line 150: `delay(100),`

**WHERE**: `src/app/shared/services/fleet.service.ts:150`

**WHY**: Adds 100ms delay to simulate network latency.

**WHEN**: Part of Observable chain.

**HOW**: RxJS delay operator.

**WHICH**: RxJS operator pattern.

---

### Lines 151-157: Error handling

**WHERE**: `src/app/shared/services/fleet.service.ts:151-157`

**WHY**: Catches errors and returns user-friendly error message, same pattern as in getVehicles().

**WHEN**: If error occurs.

**HOW**: catchError operator.

**WHICH**: RxJS error handling pattern.

---

### Line 158: `);`

**WHERE**: `src/app/shared/services/fleet.service.ts:158`

**WHY**: Closes pipe() call.

**WHEN**: End of Observable chain.

**HOW**: Closing parenthesis.

**WHICH**: JavaScript syntax.

---

### Line 159: `}`

**WHERE**: `src/app/shared/services/fleet.service.ts:159`

**WHY**: Closes getDashboardStats() method.

**WHEN**: End of method.

**HOW**: Closing brace.

**WHICH**: TypeScript syntax.

---

## getHistoricalData Method (Lines 161-217)

### Lines 161-164: Method documentation

**WHERE**: `src/app/shared/services/fleet.service.ts:161-164`

**WHY**: Explains method generates historical data for charts (simplified implementation).

**WHEN**: Documentation only.

**HOW**: Comment.

**WHICH**: Code documentation.

---

### Lines 165-167: Method signature

**WHERE**: `src/app/shared/services/fleet.service.ts:165-167`

**WHY**: Method that:
- Takes a `period` parameter with specific allowed values ('30d', 'quarter', 'year')
- Default value is '30d' (the `= '30d'` part)
- Returns Observable of HistoricalData

**WHEN**: Called when charts need historical data.

**HOW**: Method with union type parameter and default value.

**WHICH**: TypeScript union type and default parameter pattern.

---

### Line 168: `const vehicles = this.loadVehiclesFromStorage();`

**WHERE**: `src/app/shared/services/fleet.service.ts:168`

**WHY**: Loads vehicles to generate historical data from.

**WHEN**: When method is called.

**HOW**: Method call.

**WHICH**: Method call pattern.

---

### Lines 170-171: Comments

**WHERE**: `src/app/shared/services/fleet.service.ts:170-171`

**WHY**: Explains this is a simplified approach - real implementation would use time-series data.

**WHEN**: Documentation only.

**HOW**: Comments.

**WHICH**: Code documentation.

---

### Line 172: `const currentActive = vehicles.filter((v) => v.status === 'Active').length;`

**WHERE**: `src/app/shared/services/fleet.service.ts:172`

**WHY**: Counts how many vehicles have 'Active' status.
- `vehicles.filter(...)`: Creates new array with only vehicles matching condition
- `(v) => v.status === 'Active'`: Arrow function that checks if vehicle status is 'Active'
- `.length`: Gets count of filtered vehicles

**WHEN**: Executes when method is called.

**HOW**: Array filter method with arrow function.

**WHICH**: JavaScript array filter pattern.

**Documentation Links**:
- [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

---

### Lines 173-175: Count vehicles in service

**WHERE**: `src/app/shared/services/fleet.service.ts:173-175`

**WHY**: Counts vehicles that are either 'Active' OR 'Maintenance' (vehicles in service).
- `||`: Logical OR operator
- Multi-line for readability

**WHEN**: When method is called.

**HOW**: Array filter with OR condition.

**WHICH**: JavaScript array filter with logical operators.

---

### Lines 177-178: Comments

**WHERE**: `src/app/shared/services/fleet.service.ts:177-178`

**WHY**: Explains this generates mock historical points.

**WHEN**: Documentation.

**HOW**: Comments.

**WHICH**: Code documentation.

---

### Lines 179-192: Months array

**WHERE**: `src/app/shared/services/fleet.service.ts:179-192`

**WHY**: Creates an array of month abbreviations (Jan, Feb, Mar, etc.) used to generate 12 months of historical data.

**WHEN**: When method is called.

**HOW**: Array literal with 12 string values.

**WHICH**: JavaScript array literal pattern.

---

### Line 193: `const dataPoints: HistoricalDataPoint[] = months.map((month, index) => {`

**WHERE**: `src/app/shared/services/fleet.service.ts:193`

**WHY**: Transforms the months array into historical data points.
- `months.map(...)`: Creates new array by transforming each month
- `(month, index) => {`: Arrow function receives month name and its index (0-11)
- `HistoricalDataPoint[]`: Type annotation for array of data points

**WHEN**: When method is called.

**HOW**: Array map method with arrow function.

**WHICH**: JavaScript array map pattern.

**Documentation Links**:
- [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

---

### Line 194: `// Simulate slight variations from current state`

**WHERE**: `src/app/shared/services/fleet.service.ts:194`

**WHY**: Comment explaining the variation calculation.

**WHEN**: Documentation.

**HOW**: Comment.

**WHICH**: Code documentation.

---

### Line 195: `const variation = (index % 3) - 1; // -1, 0, or 1`

**WHERE**: `src/app/shared/services/fleet.service.ts:195`

**WHY**: Calculates a variation value that cycles through -1, 0, 1.
- `index % 3`: Modulo operator - remainder when index is divided by 3
- Results: 0%3=0, 1%3=1, 2%3=2, 3%3=0, 4%3=1, etc.
- `- 1`: Shifts to -1, 0, 1 pattern

**WHEN**: For each month in the map function.

**HOW**: Modulo arithmetic.

**WHICH**: JavaScript modulo operator pattern.

**Documentation Links**:
- [Modulo Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder)

---

### Lines 196-200: Return data point object

**WHERE**: `src/app/shared/services/fleet.service.ts:196-200`

**WHY**: Creates a data point object for each month:
- `period: month`: Month name (Jan, Feb, etc.)
- `activeVehicles: Math.max(0, currentActive + variation * 2)`: Active vehicles with variation, never negative
- `vehiclesInService: Math.max(0, currentInService + variation)`: In-service vehicles with variation

**WHEN**: For each month in map.

**HOW**: Object literal with calculated values.

**WHICH**: JavaScript object literal pattern.

**Documentation Links**:
- [Math.max](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max)

---

### Line 201: `});`

**WHERE**: `src/app/shared/services/fleet.service.ts:201`

**WHY**: Closes the map function's arrow function.

**WHEN**: End of map transformation.

**HOW**: Closing braces.

**WHICH**: JavaScript syntax.

---

### Lines 203-206: Create historical data object

**WHERE**: `src/app/shared/services/fleet.service.ts:203-206`

**WHY**: Creates the final HistoricalData object:
- `dataPoints`: Array of monthly data points
- `period`: The time period requested

**WHEN**: After data points are generated.

**HOW**: Object literal.

**WHICH**: TypeScript object literal pattern.

---

### Line 208: `return of(historicalData).pipe(`

**WHERE**: `src/app/shared/services/fleet.service.ts:208`

**WHY**: Returns historical data as Observable.

**WHEN**: After data is created.

**HOW**: RxJS of() creates Observable.

**WHICH**: RxJS Observable pattern.

---

### Lines 209-216: Delay and error handling

**WHERE**: `src/app/shared/services/fleet.service.ts:209-216`

**WHY**: Adds delay and error handling, same pattern as other methods.

**WHEN**: Part of Observable chain.

**HOW**: RxJS operators.

**WHICH**: RxJS operator pattern.

---

### Line 217: `}`

**WHERE**: `src/app/shared/services/fleet.service.ts:217`

**WHY**: Closes getHistoricalData() method.

**WHEN**: End of method.

**HOW**: Closing brace.

**WHICH**: TypeScript syntax.

---

## getCompanyStats Method (Lines 219-269)

### Lines 219-222: Method documentation

**WHERE**: `src/app/shared/services/fleet.service.ts:219-222`

**WHY**: Explains method returns company statistics, with TODO to connect to backend API.

**WHEN**: Documentation.

**HOW**: Comments.

**WHICH**: Code documentation.

---

### Line 223: `getCompanyStats(): Observable<Company[]> {`

**WHERE**: `src/app/shared/services/fleet.service.ts:223`

**WHY**: Method that returns Observable of Company array.

**WHEN**: Called when company statistics are needed.

**HOW**: Method declaration.

**WHICH**: TypeScript method pattern.

---

### Lines 224-225: Comments

**WHERE**: `src/app/shared/services/fleet.service.ts:224-225`

**WHY**: Notes this is mock data and should be replaced with HTTP call when backend is ready.

**WHEN**: Documentation.

**HOW**: Comments.

**WHICH**: Code documentation.

---

### Line 226: `const mockCompanies: Company[] = [`

**WHERE**: `src/app/shared/services/fleet.service.ts:226`

**WHY**: Declares array of mock Company objects.

**WHEN**: When method is called.

**HOW**: Typed array declaration.

**WHICH**: TypeScript array pattern.

---

### Lines 227-236: First Mock Company (FleetCorp)

**WHERE**: `src/app/shared/services/fleet.service.ts:227-236`

**WHY**: Creates first company object with:
- `id: '1'`: Company ID
- `name: 'FleetCorp'`: Short name
- `entityName: 'FleetCorp Inc.'`: Full legal name
- `activeUnits: 150`: Number of active vehicles
- `maintenanceLoad: 5.2`: Maintenance load percentage
- `totalUnits: 158`: Total vehicles
- `systemStatus: 'Optimal'`: System status
- `efficiency: 85`: Efficiency percentage

**WHEN**: When method is called.

**HOW**: Object literal.

**WHICH**: TypeScript object pattern.

---

### Lines 237-246: Second Mock Company (TransLog)

**WHERE**: `src/app/shared/services/fleet.service.ts:237-246`

**WHY**: Second company with different stats (Warning status, lower efficiency).

**WHEN**: When method is called.

**HOW**: Object literal.

**WHICH**: Object pattern.

---

### Lines 247-256: Third Mock Company (Pacific Fleet)

**WHERE**: `src/app/shared/services/fleet.service.ts:247-256`

**WHY**: Third company with different stats.

**WHEN**: When method is called.

**HOW**: Object literal.

**WHICH**: Object pattern.

---

### Line 257: `];`

**WHERE**: `src/app/shared/services/fleet.service.ts:257`

**WHY**: Closes mockCompanies array.

**WHEN**: End of array.

**HOW**: Closing bracket.

**WHICH**: JavaScript syntax.

---

### Lines 259-268: Return Observable with delay and error handling

**WHERE**: `src/app/shared/services/fleet.service.ts:259-268`

**WHY**: Returns companies as Observable with delay and error handling, same pattern as other methods.

**WHEN**: After companies array is created.

**HOW**: RxJS Observable pattern.

**WHICH**: RxJS pattern.

---

### Line 269: `}`

**WHERE**: `src/app/shared/services/fleet.service.ts:269`

**WHY**: Closes getCompanyStats() method.

**WHEN**: End of method.

**HOW**: Closing brace.

**WHICH**: TypeScript syntax.

---

## getRecentActivities Method (Lines 271-295)

### Lines 271-274: Method documentation

**WHERE**: `src/app/shared/services/fleet.service.ts:271-274`

**WHY**: Explains method gets recent activities from localStorage.

**WHEN**: Documentation.

**HOW**: Comments.

**WHICH**: Code documentation.

---

### Line 275: `getRecentActivities(limit: number = 10): Observable<Activity[]> {`

**WHERE**: `src/app/shared/services/fleet.service.ts:275`

**WHY**: Method that:
- Takes `limit` parameter (defaults to 10 if not provided)
- Returns Observable of Activity array

**WHEN**: Called when recent activities are needed.

**HOW**: Method with default parameter.

**WHICH**: TypeScript default parameter pattern.

---

### Line 276: `const activities = this.getActivitiesFromStorage();`

**WHERE**: `src/app/shared/services/fleet.service.ts:276`

**WHY**: Loads all activities from localStorage.

**WHEN**: When method is called.

**HOW**: Method call.

**WHICH**: Method call pattern.

---

### Line 277: `// Sort by timestamp descending and limit`

**WHERE**: `src/app/shared/services/fleet.service.ts:277`

**WHY**: Comment explaining sorting and limiting logic.

**WHEN**: Documentation.

**HOW**: Comment.

**WHICH**: Code documentation.

---

### Lines 278-284: Sort and limit activities

**WHERE**: `src/app/shared/services/fleet.service.ts:278-284`

**WHY**: Sorts activities by timestamp (newest first) and limits to requested number.
- `.sort((a, b) => { ... })`: Sorts array
- `new Date(a.timestamp).getTime()`: Converts timestamp to number (milliseconds since epoch)
- `return dateB - dateA`: Descending order (newest first - larger number minus smaller)
- `.slice(0, limit)`: Takes only first `limit` items

**WHEN**: After activities are loaded.

**HOW**: Array sort and slice methods.

**WHICH**: JavaScript array manipulation pattern.

**Documentation Links**:
- [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [Array.slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)

---

### Lines 286-294: Return Observable with delay and error handling

**WHERE**: `src/app/shared/services/fleet.service.ts:286-294`

**WHY**: Returns sorted activities as Observable with delay and error handling.

**WHEN**: After sorting and limiting.

**HOW**: RxJS Observable pattern.

**WHICH**: RxJS pattern.

---

### Line 295: `}`

**WHERE**: `src/app/shared/services/fleet.service.ts:295`

**WHY**: Closes getRecentActivities() method.

**WHEN**: End of method.

**HOW**: Closing brace.

**WHICH**: TypeScript syntax.

---

## refreshData Method (Lines 297-302)

### Lines 297-299: Method documentation

**WHERE**: `src/app/shared/services/fleet.service.ts:297-299`

**WHY**: Explains method triggers data refresh.

**WHEN**: Documentation.

**HOW**: Comments.

**WHICH**: Code documentation.

---

### Line 300: `refreshData(): void {`

**WHERE**: `src/app/shared/services/fleet.service.ts:300`

**WHY**: Method that doesn't return anything (`void`).

**WHEN**: Called when manual refresh is needed.

**HOW**: Method declaration with void return type.

**WHICH**: TypeScript void return type pattern.

---

### Line 301: `this.dataRefreshSubject.next(new Date());`

**WHERE**: `src/app/shared/services/fleet.service.ts:301`

**WHY**: Emits a new Date through the BehaviorSubject, notifying all subscribers to refresh their data.

**WHEN**: When method is called.

**HOW**: BehaviorSubject.next() call.

**WHICH**: RxJS Subject emission pattern.

---

### Line 302: `}`

**WHERE**: `src/app/shared/services/fleet.service.ts:302`

**WHY**: Closes refreshData() method.

**WHEN**: End of method.

**HOW**: Closing brace.

**WHICH**: TypeScript syntax.

---

## Storage Methods (Lines 304-329)

### Lines 304-306: saveVehiclesToStorage documentation

**WHERE**: `src/app/shared/services/fleet.service.ts:304-306`

**WHY**: Explains method saves vehicles to localStorage.

**WHEN**: Documentation.

**HOW**: Comments.

**WHICH**: Code documentation.

---

### Line 307: `saveVehiclesToStorage(vehicles: Vehicle[]): void {`

**WHERE**: `src/app/shared/services/fleet.service.ts:307`

**WHY**: Method that takes array of vehicles and saves to localStorage.

**WHEN**: Called whenever vehicles need to be persisted.

**HOW**: Method with Vehicle array parameter.

**WHICH**: TypeScript method pattern.

---

### Line 308: `try {`

**WHERE**: `src/app/shared/services/fleet.service.ts:308`

**WHY**: Starts try-catch block to handle errors gracefully.

**WHEN**: When method is called.

**HOW**: JavaScript try-catch syntax.

**WHICH**: Error handling pattern.

**Documentation Links**:
- [try-catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)

---

### Line 309: `localStorage.setItem(this.VEHICLES_KEY, JSON.stringify(vehicles));`

**WHERE**: `src/app/shared/services/fleet.service.ts:309`

**WHY**: Saves vehicles to browser's localStorage.
- `localStorage.setItem(key, value)`: Browser API to store data
- `this.VEHICLES_KEY`: The constant key ('fleetpulse-vehicles')
- `JSON.stringify(vehicles)`: Converts JavaScript object/array to JSON string (localStorage only stores strings)

**WHEN**: When saving vehicles.

**HOW**: Browser localStorage API with JSON serialization.

**WHICH**: Browser localStorage pattern.

**Documentation Links**:
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

---

### Line 310: `localStorage.setItem(this.LAST_SYNC_KEY, new Date().toISOString());`

**WHERE**: `src/app/shared/services/fleet.service.ts:310`

**WHY**: Saves the current timestamp to track when data was last synced.
- `new Date()`: Current date/time
- `.toISOString()`: Converts to ISO 8601 string format (e.g., "2024-01-15T10:30:00.000Z")

**WHEN**: When saving vehicles.

**HOW**: Date creation and ISO string conversion.

**WHICH**: Date handling pattern.

**Documentation Links**:
- [Date.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString)

---

### Lines 311-314: Error handling

**WHERE**: `src/app/shared/services/fleet.service.ts:311-314`

**WHY**: Catches errors (like storage full) and throws user-friendly error.
- `catch (error) {`: Catches any errors from try block
- `console.error(...)`: Logs error for debugging
- `throw new Error(...)`: Throws new error with message

**WHEN**: If localStorage operation fails.

**HOW**: catch block with error logging and re-throwing.

**WHICH**: Error handling pattern.

---

### Line 315: `}`

**WHERE**: `src/app/shared/services/fleet.service.ts:315`

**WHY**: Closes saveVehiclesToStorage() method.

**WHEN**: End of method.

**HOW**: Closing brace.

**WHICH**: TypeScript syntax.

---

### Lines 317-319: loadVehiclesFromStorage documentation

**WHERE**: `src/app/shared/services/fleet.service.ts:317-319`

**WHY**: Explains method loads vehicles from localStorage.

**WHEN**: Documentation.

**HOW**: Comments.

**WHICH**: Code documentation.

---

### Line 320: `loadVehiclesFromStorage(): Vehicle[] {`

**WHERE**: `src/app/shared/services/fleet.service.ts:320`

**WHY**: Method that returns array of Vehicle objects from localStorage.

**WHEN**: Called whenever vehicles need to be loaded.

**HOW**: Method with Vehicle array return type.

**WHICH**: TypeScript method pattern.

---

### Line 321: `try {`

**WHERE**: `src/app/shared/services/fleet.service.ts:321`

**WHY**: Starts try-catch for error handling.

**WHEN**: When method is called.

**HOW**: try-catch syntax.

**WHICH**: Error handling pattern.

---

### Line 322: `const stored = localStorage.getItem(this.VEHICLES_KEY);`

**WHERE**: `src/app/shared/services/fleet.service.ts:322`

**WHY**: Retrieves stored vehicles string from localStorage.
- `localStorage.getItem(key)`: Browser API to get stored value
- Returns string or null if key doesn't exist

**WHEN**: When loading vehicles.

**HOW**: Browser localStorage API.

**WHICH**: Browser localStorage pattern.

**Documentation Links**:
- [localStorage.getItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem)

---

### Line 323: `if (!stored) return [];`

**WHERE**: `src/app/shared/services/fleet.service.ts:323`

**WHY**: If nothing is stored (null or empty), return empty array immediately.
- `!stored`: Logical NOT - true if stored is null/undefined/empty
- `return []`: Early return with empty array

**WHEN**: If no data in localStorage.

**HOW**: Early return pattern.

**WHICH**: JavaScript early return pattern.

---

### Line 324: `return JSON.parse(stored);`

**WHERE**: `src/app/shared/services/fleet.service.ts:324`

**WHY**: Converts JSON string back to JavaScript array/object.
- `JSON.parse(string)`: Parses JSON string into JavaScript object/array

**WHEN**: If data exists in localStorage.

**HOW**: JSON parsing.

**WHICH**: JSON parsing pattern.

**Documentation Links**:
- [JSON.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

---

### Lines 325-328: Error handling

**WHERE**: `src/app/shared/services/fleet.service.ts:325-328`

**WHY**: Catches parsing errors and returns empty array (graceful degradation).

**WHEN**: If JSON.parse fails (corrupted data).

**HOW**: catch block with fallback.

**WHICH**: Error handling with fallback pattern.

---

### Line 329: `}`

**WHERE**: `src/app/shared/services/fleet.service.ts:329`

**WHY**: Closes loadVehiclesFromStorage() method.

**WHEN**: End of method.

**HOW**: Closing brace.

**WHICH**: TypeScript syntax.

---

## Upsert Methods (Lines 331-397)

### Lines 331-333: upsertVehicle documentation

**WHERE**: `src/app/shared/services/fleet.service.ts:331-333`

**WHY**: Explains "upsert" means update if exists, insert if new.

**WHEN**: Documentation.

**HOW**: Comments.

**WHICH**: Code documentation.

---

### Line 334: `upsertVehicle(vehicle: Vehicle): void {`

**WHERE**: `src/app/shared/services/fleet.service.ts:334`

**WHY**: Method that updates existing vehicle or adds new one.

**WHEN**: Called when vehicle data changes.

**HOW**: Method with Vehicle parameter.

**WHICH**: TypeScript method pattern.

---

### Line 335: `const vehicles = this.loadVehiclesFromStorage();`

**WHERE**: `src/app/shared/services/fleet.service.ts:335`

**WHY**: Loads all existing vehicles.

**WHEN**: When method is called.

**HOW**: Method call.

**WHICH**: Method call pattern.

---

### Lines 336-338: Find existing vehicle

**WHERE**: `src/app/shared/services/fleet.service.ts:336-338`

**WHY**: Searches for vehicle with matching vehicleId.
- `vehicles.findIndex(...)`: Returns index if found, -1 if not found
- `(v) => v.vehicleId === vehicle.vehicleId`: Arrow function checks if IDs match

**WHEN**: After loading vehicles.

**HOW**: Array findIndex method.

**WHICH**: JavaScript array search pattern.

**Documentation Links**:
- [Array.findIndex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)

---

### Line 340: `if (existingIndex >= 0) {`

**WHERE**: `src/app/shared/services/fleet.service.ts:340`

**WHY**: Checks if vehicle exists (findIndex returns >= 0 if found).

**WHEN**: After searching.

**HOW**: Conditional check.

**WHICH**: JavaScript conditional pattern.

---

### Lines 341-348: Update existing vehicle

**WHERE**: `src/app/shared/services/fleet.service.ts:341-348`

**WHY**: Updates existing vehicle while preserving original ID and createdAt timestamp.
- `const existing = vehicles[existingIndex]`: Gets the existing vehicle
- `...vehicle`: Spread operator - copies all properties from new vehicle
- `id: existing.id`: Keeps original ID
- `createdAt: existing.createdAt || new Date().toISOString()`: Keeps original createdAt, or uses current date if missing
- `updatedAt: new Date().toISOString()`: Sets new updated timestamp

**WHEN**: If vehicle exists.

**HOW**: Object spread and property assignment.

**WHICH**: JavaScript object spread pattern.

**Documentation Links**:
- [Spread Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

---

### Lines 349-356: Insert new vehicle

**WHERE**: `src/app/shared/services/fleet.service.ts:349-356`

**WHY**: Adds new vehicle if it doesn't exist.
- `vehicles.push(...)`: Adds to end of array
- `...vehicle`: Spreads vehicle properties
- `createdAt` and `updatedAt`: Sets timestamps

**WHEN**: If vehicle doesn't exist.

**HOW**: Array push with object spread.

**WHICH**: JavaScript array manipulation pattern.

---

### Line 358: `this.saveVehiclesToStorage(vehicles);`

**WHERE**: `src/app/shared/services/fleet.service.ts:358`

**WHY**: Saves updated vehicles array back to localStorage.

**WHEN**: After update or insert.

**HOW**: Method call.

**WHICH**: Method call pattern.

---

### Line 359: `}`

**WHERE**: `src/app/shared/services/fleet.service.ts:359`

**WHY**: Closes upsertVehicle() method.

**WHEN**: End of method.

**HOW**: Closing brace.

**WHICH**: TypeScript syntax.

---

### Lines 361-363: upsertVehicles documentation

**WHERE**: `src/app/shared/services/fleet.service.ts:361-363`

**WHY**: Explains method upserts multiple vehicles.

**WHEN**: Documentation.

**HOW**: Comments.

**WHICH**: Code documentation.

---

### Line 364: `upsertVehicles(newVehicles: Vehicle[]): void {`

**WHERE**: `src/app/shared/services/fleet.service.ts:364`

**WHY**: Method that upserts multiple vehicles at once (more efficient than calling upsertVehicle multiple times).

**WHEN**: Called when multiple vehicles need updating.

**HOW**: Method with Vehicle array parameter.

**WHICH**: TypeScript method pattern.

---

### Line 365: `const existingVehicles = this.loadVehiclesFromStorage();`

**WHERE**: `src/app/shared/services/fleet.service.ts:365`

**WHY**: Loads existing vehicles.

**WHEN**: When method is called.

**HOW**: Method call.

**WHICH**: Method call pattern.

---

### Line 366: `const vehicleMap = new Map<string, Vehicle>();`

**WHERE**: `src/app/shared/services/fleet.service.ts:366`

**WHY**: Creates a Map data structure for efficient lookups.
- `Map<string, Vehicle>`: Map with string keys (vehicleId) and Vehicle values
- More efficient than array.find() for multiple lookups

**WHEN**: When method is called.

**HOW**: Map constructor.

**WHICH**: JavaScript Map pattern.

**Documentation Links**:
- [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

---

### Lines 368-371: Add existing to map

**WHERE**: `src/app/shared/services/fleet.service.ts:368-371`

**WHY**: Adds all existing vehicles to the map for quick lookup.
- `existingVehicles.forEach(...)`: Iterates through each vehicle
- `vehicleMap.set(v.vehicleId, v)`: Adds vehicle to map with vehicleId as key

**WHEN**: After creating map.

**HOW**: Array forEach with Map.set.

**WHICH**: JavaScript iteration pattern.

**Documentation Links**:
- [Array.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)

---

### Lines 373-392: Upsert new vehicles

**WHERE**: `src/app/shared/services/fleet.service.ts:373-392`

**WHY**: Processes each new vehicle, updating existing or adding new ones to the map.
- `newVehicles.forEach(...)`: Iterates through new vehicles
- `vehicleMap.get(vehicle.vehicleId)`: Checks if vehicle exists in map
- If exists: Updates in map preserving ID and createdAt
- If not: Adds new to map with timestamps

**WHEN**: After existing vehicles are in map.

**HOW**: forEach with Map operations.

**WHICH**: JavaScript iteration and Map pattern.

---

### Lines 394-396: Convert map to array and save

**WHERE**: `src/app/shared/services/fleet.service.ts:394-396`

**WHY**: Converts map back to array and saves.
- `Array.from(vehicleMap.values())`: Converts map values to array
- `this.saveVehiclesToStorage(...)`: Saves to localStorage

**WHEN**: After all vehicles processed.

**HOW**: Array.from with Map.values().

**WHICH**: JavaScript array conversion pattern.

**Documentation Links**:
- [Array.from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from)

---

### Line 397: `}`

**WHERE**: `src/app/shared/services/fleet.service.ts:397`

**WHY**: Closes upsertVehicles() method.

**WHEN**: End of method.

**HOW**: Closing brace.

**WHICH**: TypeScript syntax.

---

## Activity Methods (Lines 399-430)

### Lines 399-401: saveActivity documentation

**WHERE**: `src/app/shared/services/fleet.service.ts:399-401`

**WHY**: Explains method saves activity to localStorage.

**WHEN**: Documentation.

**HOW**: Comments.

**WHICH**: Code documentation.

---

### Line 402: `saveActivity(activity: Activity): void {`

**WHERE**: `src/app/shared/services/fleet.service.ts:402`

**WHY**: Method that saves a single activity.

**WHEN**: Called when new activity occurs.

**HOW**: Method with Activity parameter.

**WHICH**: TypeScript method pattern.

---

### Line 403: `try {`

**WHERE**: `src/app/shared/services/fleet.service.ts:403`

**WHY**: Starts try-catch for error handling.

**WHEN**: When method is called.

**HOW**: try-catch syntax.

**WHICH**: Error handling pattern.

---

### Line 404: `const activities = this.getActivitiesFromStorage();`

**WHERE**: `src/app/shared/services/fleet.service.ts:404`

**WHY**: Loads existing activities.

**WHEN**: When saving.

**HOW**: Method call.

**WHICH**: Method call pattern.

---

### Lines 405-411: Add activity with ID and timestamp

**WHERE**: `src/app/shared/services/fleet.service.ts:405-411`

**WHY**: Adds new activity to array with auto-generated ID and timestamp if not provided.
- `activities.push(...)`: Adds to array
- `...activity`: Spreads activity properties
- `id: activity.id || ...`: Uses provided ID or generates unique one
- `activity-${Date.now()}-${Math.random()...}`: Generates unique ID using timestamp and random string
- `timestamp: activity.timestamp || new Date().toISOString()`: Uses provided timestamp or current time

**WHEN**: When saving activity.

**HOW**: Array push with object spread and ID generation.

**WHICH**: JavaScript array and ID generation pattern.

---

### Line 412: `localStorage.setItem(this.ACTIVITIES_KEY, JSON.stringify(activities));`

**WHERE**: `src/app/shared/services/fleet.service.ts:412`

**WHY**: Saves updated activities array to localStorage.

**WHEN**: After adding activity.

**HOW**: localStorage API.

**WHICH**: Browser localStorage pattern.

---

### Lines 413-415: Error handling

**WHERE**: `src/app/shared/services/fleet.service.ts:413-415`

**WHY**: Catches errors and logs them (doesn't throw - fails silently for activities).

**WHEN**: If save fails.

**HOW**: catch block with logging.

**WHICH**: Error handling pattern.

---

### Line 416: `}`

**WHERE**: `src/app/shared/services/fleet.service.ts:416`

**WHY**: Closes saveActivity() method.

**WHEN**: End of method.

**HOW**: Closing brace.

**WHICH**: TypeScript syntax.

---

### Lines 418-420: getActivitiesFromStorage documentation

**WHERE**: `src/app/shared/services/fleet.service.ts:418-420`

**WHY**: Explains method loads activities from localStorage.

**WHEN**: Documentation.

**HOW**: Comments.

**WHICH**: Code documentation.

---

### Line 421: `getActivitiesFromStorage(): Activity[] {`

**WHERE**: `src/app/shared/services/fleet.service.ts:421`

**WHY**: Method that returns array of Activity objects.

**WHEN**: Called when activities need to be loaded.

**HOW**: Method with Activity array return type.

**WHICH**: TypeScript method pattern.

---

### Lines 422-429: Load and parse activities

**WHERE**: `src/app/shared/services/fleet.service.ts:422-429`

**WHY**: Same pattern as loadVehiclesFromStorage() - loads from localStorage, parses JSON, handles errors.

**WHEN**: When method is called.

**HOW**: localStorage API with JSON parsing.

**WHICH**: Browser localStorage pattern.

---

### Line 430: `}`

**WHERE**: `src/app/shared/services/fleet.service.ts:430`

**WHY**: Closes getActivitiesFromStorage() method.

**WHEN**: End of method.

**HOW**: Closing brace.

**WHICH**: TypeScript syntax.

---

## calculateDashboardStats Method (Lines 432-477)

### Lines 432-434: Method documentation

**WHERE**: `src/app/shared/services/fleet.service.ts:432-434`

**WHY**: Explains method calculates dashboard statistics from vehicles.

**WHEN**: Documentation.

**HOW**: Comments.

**WHICH**: Code documentation.

---

### Line 435: `calculateDashboardStats(vehicles: Vehicle[]): DashboardStats {`

**WHERE**: `src/app/shared/services/fleet.service.ts:435`

**WHY**: Method that takes vehicles array and returns calculated statistics.

**WHEN**: Called by getDashboardStats() method.

**HOW**: Method with Vehicle array parameter and DashboardStats return type.

**WHICH**: TypeScript method pattern.

---

### Line 436: `const totalFleetUnits = vehicles.length;`

**WHERE**: `src/app/shared/services/fleet.service.ts:436`

**WHY**: Gets total count of vehicles (simple array length).

**WHEN**: When method is called.

**HOW**: Array length property.

**WHICH**: JavaScript array property.

---

### Lines 438-443: Status distribution

**WHERE**: `src/app/shared/services/fleet.service.ts:438-443`

**WHY**: Counts vehicles by status using filter and length.
- `vehicles.filter((v) => v.status === 'Active').length`: Counts Active vehicles
- Same pattern for Maintenance, Standby, Critical
- Creates object with counts for each status

**WHEN**: When method is called.

**HOW**: Multiple array filter operations.

**WHICH**: JavaScript array filter pattern.

---

### Lines 445-446: Maintenance efficiency

**WHERE**: `src/app/shared/services/fleet.service.ts:445-446`

**WHY**: Calculates total vehicles needing maintenance (Maintenance + Critical).

**WHEN**: When method is called.

**HOW**: Addition of two counts.

**WHICH**: JavaScript arithmetic.

---

### Line 448: `const operationalCost = vehicles.reduce((sum, v) => sum + (v.cost || 0), 0);`

**WHERE**: `src/app/shared/services/fleet.service.ts:448`

**WHY**: Calculates total operational cost by summing all vehicle costs.
- `vehicles.reduce(...)`: Reduces array to single value
- `(sum, v) => sum + (v.cost || 0)`: Adds each vehicle's cost to sum
- `v.cost || 0`: Uses 0 if cost is missing/null
- `0`: Initial sum value

**WHEN**: When method is called.

**HOW**: Array reduce method.

**WHICH**: JavaScript array reduce pattern.

**Documentation Links**:
- [Array.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

---

### Lines 450-454: Efficiency index

**WHERE**: `src/app/shared/services/fleet.service.ts:450-454`

**WHY**: Calculates average health score (efficiency index).
- `vehicles.length > 0`: Checks if vehicles exist (avoid division by zero)
- `vehicles.reduce((sum, v) => sum + (v.healthScore || 0), 0)`: Sums all health scores
- `/ vehicles.length`: Divides by count to get average
- `: 0`: Returns 0 if no vehicles

**WHEN**: When method is called.

**HOW**: Conditional with array reduce and division.

**WHICH**: JavaScript conditional and arithmetic pattern.

---

### Lines 456-461: Utilization

**WHERE**: `src/app/shared/services/fleet.service.ts:456-461`

**WHY**: Calculates utilization percentage (Active + Maintenance vehicles / Total * 100).
- `totalFleetUnits > 0`: Avoids division by zero
- `(statusDistribution.active + statusDistribution.maintenance)`: Vehicles in use
- `/ totalFleetUnits * 100`: Converts to percentage
- `: 0`: Returns 0 if no vehicles

**WHEN**: When method is called.

**HOW**: Conditional with percentage calculation.

**WHICH**: JavaScript percentage calculation pattern.

---

### Lines 463-464: Comments

**WHERE**: `src/app/shared/services/fleet.service.ts:463-464`

**WHY**: Notes trends are simplified (would need historical data for accurate trends).

**WHEN**: Documentation.

**HOW**: Comments.

**WHICH**: Code documentation.

---

### Lines 465-476: Return stats object

**WHERE**: `src/app/shared/services/fleet.service.ts:465-476`

**WHY**: Returns DashboardStats object with all calculated values.
- All calculated metrics included
- Trend values set to 0 (simplified - would need historical data)
- Matches DashboardStats interface structure

**WHEN**: After all calculations.

**HOW**: Object literal return.

**WHICH**: TypeScript object return pattern.

---

### Line 477: `}`

**WHERE**: `src/app/shared/services/fleet.service.ts:477`

**WHY**: Closes calculateDashboardStats() method.

**WHEN**: End of method.

**HOW**: Closing brace.

**WHICH**: TypeScript syntax.

---

### Line 478: `}`

**WHERE**: `src/app/shared/services/fleet.service.ts:478`

**WHY**: Closes the FleetService class.

**WHEN**: End of class definition.

**HOW**: Closing brace.

**WHICH**: TypeScript syntax.

---

## 📚 Summary

This FleetService provides:

1. **Data Management**: CRUD operations for vehicles and activities
2. **localStorage Persistence**: Saves/loads data from browser storage
3. **Statistics Calculation**: Computes dashboard metrics from vehicle data
4. **Reactive Data Streams**: Uses RxJS Observables for async operations
5. **Error Handling**: Graceful error handling throughout
6. **Auto-refresh**: Automatic data refresh every 5 minutes
7. **Mock Data**: Provides fallback mock data for initial setup

**Key Patterns Used**:
- Angular Injectable service
- RxJS Observables and operators
- localStorage API
- TypeScript interfaces and types
- Error handling with try-catch
- Array manipulation (filter, map, reduce, forEach)
- Object spread operator
- Map data structure for efficient lookups

---

**Documentation Links**:
- [Angular Services](https://angular.io/guide/dependency-injection)
- [RxJS Documentation](https://rxjs.dev/)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

**Next**: Explore other services or components that use FleetService!
