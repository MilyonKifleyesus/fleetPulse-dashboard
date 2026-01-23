# State Management - State Patterns

## 🎯 Overview

This document explains state management patterns used in FleetPulse Dashboard.

## 📋 State Management Patterns

### localStorage Persistence
**WHERE**: WorkspaceStateService

**WHY**: Persists widget layout to browser storage

**WHEN**: After any widget change

**HOW**: JSON serialization to localStorage

**WHICH**: Browser storage pattern

**Documentation**: [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### RxJS BehaviorSubject for State
**WHERE**: WorkspaceModeService, WorkspaceStateService

**WHY**: Reactive state that emits current value

**WHEN**: For state that components observe

**HOW**: BehaviorSubject with `.next()` and `.subscribe()`

**WHICH**: RxJS state pattern

**Documentation**: [RxJS BehaviorSubject](https://rxjs.dev/guide/subject#behaviorsubject)

### Service-Based State
**WHERE**: All services manage their own state

**WHY**: Centralized state in services

**WHEN**: For application-wide state

**HOW**: Injectable services with state properties

**WHICH**: Angular service state pattern

**Documentation**: [Angular Services](https://angular.io/guide/services)

---

## 📚 Documentation Links

- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [RxJS BehaviorSubject](https://rxjs.dev/guide/subject#behaviorsubject)

---

**Next**: Read [Drag & Drop System](./Drag-Drop-System.md)
