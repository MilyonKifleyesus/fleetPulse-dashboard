# Angular Basics - Concepts Used

## 🎯 Overview

This document explains Angular concepts used in FleetPulse Dashboard.

## 📋 Angular Features Used

### Standalone Components
**WHERE**: Used throughout all components

**WHY**: Modern Angular approach - no NgModules needed

**WHEN**: All components use standalone pattern

**HOW**: `standalone: true` in component decorator (or default in Angular 19+)

**WHICH**: Angular standalone components pattern

**Documentation**: [Angular Standalone Components](https://angular.io/guide/standalone-components)

### Dependency Injection
**WHERE**: Constructor injection in services/components

**WHY**: Provides dependencies without manual instantiation

**WHEN**: Used for all services

**HOW**: `constructor(private service: ServiceName) {}`

**WHICH**: Angular DI pattern

**Documentation**: [Angular Dependency Injection](https://angular.io/guide/dependency-injection)

### Component Lifecycle
**WHERE**: `ngOnInit`, `ngOnDestroy` hooks

**WHY**: Initialize and clean up component resources

**WHEN**: OnInit for init, OnDestroy for cleanup

**HOW**: Implements lifecycle interfaces

**WHICH**: Angular lifecycle hooks pattern

**Documentation**: [Angular Lifecycle Hooks](https://angular.io/guide/lifecycle-hooks)

### Content Projection
**WHERE**: `<ng-content>` in WidgetFrameComponent

**WHY**: Projects parent content into child component

**WHEN**: When parent provides content for child

**HOW**: Uses `<ng-content>` slot

**WHICH**: Angular content projection pattern

**Documentation**: [Content Projection](https://angular.io/guide/content-projection)

### Control Flow (`@if`, `@for`)
**WHERE**: Templates use `@if`, `@for` syntax

**WHY**: Modern Angular control flow (replaces `*ngIf`, `*ngFor`)

**WHEN**: For conditional rendering and loops

**HOW**: `@if (condition) { ... }`, `@for (item of items; track item.id) { ... }`

**WHICH**: Angular 17+ control flow syntax

**Documentation**: [Angular Control Flow](https://angular.io/guide/control-flow)

---

## 📚 Documentation Links

- [Angular Documentation](https://angular.io/docs)
- [Standalone Components](https://angular.io/guide/standalone-components)
- [Dependency Injection](https://angular.io/guide/dependency-injection)

---

**Next**: Read [RxJS Patterns](./RxJS-Patterns.md)
