# Glossary - Terminology Dictionary

## 📚 Terms and Definitions

### A

**Angular CDK** - Angular Component Dev Kit, provides drag-drop functionality
- Used in: WorkspaceComponent
- Documentation: [Angular CDK](https://material.angular.io/cdk)

### B

**BehaviorSubject** - RxJS Observable that emits current value on subscribe
- Used in: WorkspaceStateService, WorkspaceModeService
- Documentation: [RxJS BehaviorSubject](https://rxjs.dev/guide/subject#behaviorsubject)

### C

**CSS Grid** - Two-dimensional layout system for widgets
- Used in: WorkspaceComponent
- Documentation: [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

**Content Projection** - Angular pattern for projecting parent content into child
- Used in: WidgetFrameComponent, WorkspaceComponent
- Documentation: [Content Projection](https://angular.io/guide/content-projection)

### D

**Dependency Injection** - Angular pattern for providing dependencies
- Used in: All services and components
- Documentation: [DI](https://angular.io/guide/dependency-injection)

### F

**forkJoin** - RxJS operator that combines multiple Observables
- Used in: WorkspaceDashboardComponent.loadData()
- Documentation: [forkJoin](https://rxjs.dev/api/index/function/forkJoin)

### G

**Grid Layout** - CSS Grid system for widget positioning
- Used in: WorkspaceComponent
- Documentation: [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

### L

**localStorage** - Browser storage API for persisting data
- Used in: WorkspaceStateService, FleetService
- Documentation: [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### O

**Observable** - RxJS pattern for asynchronous data streams
- Used in: All services
- Documentation: [Observables](https://rxjs.dev/guide/observable)

### S

**Standalone Component** - Angular component without NgModule
- Used in: All components
- Documentation: [Standalone Components](https://angular.io/guide/standalone-components)

### T

**takeUntil** - RxJS operator for unsubscribing on destroy
- Used in: All components with subscriptions
- Documentation: [takeUntil](https://rxjs.dev/api/operators/takeUntil)

### W

**Widget** - Resizable, draggable dashboard component
- Used in: Workspace system
- Documentation: [Widget System](../Concepts/Widget-System.md)

**Workspace** - Grid container that manages widget layout
- Used in: WorkspaceComponent
- Documentation: [Workspace Component](../Components/workspace/README.md)

---

**Next**: Check [Quick Reference](./Quick-Reference.md)
