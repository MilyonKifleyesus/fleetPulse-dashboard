# RxJS Patterns - Reactive Programming

## 🎯 Overview

This document explains RxJS patterns used in FleetPulse Dashboard.

## 📋 RxJS Concepts Used

### Observables
**WHERE**: Service methods return `Observable<T>`

**WHY**: Represents asynchronous data streams

**WHEN**: For async operations (data loading, events)

**HOW**: `Observable<T>` type, `.subscribe()` to consume

**WHICH**: RxJS Observable pattern

**Documentation**: [RxJS Observables](https://rxjs.dev/guide/observable)

### BehaviorSubject
**WHERE**: WorkspaceStateService, WorkspaceModeService

**WHY**: Observable with current value, emits on subscribe

**WHEN**: For state that needs current value immediately

**HOW**: `new BehaviorSubject<T>(initialValue)`

**WHICH**: RxJS BehaviorSubject pattern

**Documentation**: [RxJS BehaviorSubject](https://rxjs.dev/guide/subject#behaviorsubject)

### forkJoin
**WHERE**: WorkspaceDashboardComponent.loadData()

**WHY**: Combines multiple Observables, waits for all to complete

**WHEN**: When loading multiple data sources in parallel

**HOW**: `forkJoin({ ... }).subscribe(...)`

**WHICH**: RxJS forkJoin pattern

**Documentation**: [RxJS forkJoin](https://rxjs.dev/api/index/function/forkJoin)

### takeUntil
**WHERE**: Component subscriptions

**WHY**: Unsubscribes when component destroys (prevents memory leaks)

**WHEN**: For component subscriptions

**HOW**: `.pipe(takeUntil(this.destroy$))`

**WHICH**: RxJS unsubscribe pattern

**Documentation**: [RxJS takeUntil](https://rxjs.dev/api/operators/takeUntil)

### debounceTime
**WHERE**: WorkspaceStateService saves

**WHY**: Delays emissions, emits only after silence period

**WHEN**: For frequent operations (saves, searches)

**HOW**: `.pipe(debounceTime(300))`

**WHICH**: RxJS debouncing pattern

**Documentation**: [RxJS debounceTime](https://rxjs.dev/api/operators/debounceTime)

---

## 📚 Documentation Links

- [RxJS Documentation](https://rxjs.dev/)
- [RxJS Observables](https://rxjs.dev/guide/observable)
- [RxJS Operators](https://rxjs.dev/guide/operators)

---

**Next**: Read [CSS Grid Layout](./CSS-Grid-Layout.md)
