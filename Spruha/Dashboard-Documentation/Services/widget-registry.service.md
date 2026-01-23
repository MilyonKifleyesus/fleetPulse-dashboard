# Widget Registry Service - Complete Documentation

## 📄 File Information

- **File Path**: `src/app/shared/services/widget-registry.service.ts`
- **Purpose**: Central registry for widget types and configurations
- **Dependencies**: `WidgetType` interface
- **Used By**: `WorkspaceComponent`, `WorkspaceDashboardComponent`

## 🎯 Service Overview

### WHERE
**Location**: `src/app/shared/services/widget-registry.service.ts`

### WHY
Provides centralized widget type registry. Ensures:
- Consistent widget configurations
- Default widget sizes
- Widget type validation
- Easy widget creation

### WHEN
Used when:
- Creating new widgets
- Getting widget configurations
- Validating widget types

### HOW
Uses Map to store widget configurations, registers default widget types in constructor.

### WHICH
**Concepts Used:**
- Registry pattern
- TypeScript Map
- Factory pattern

**Documentation Links:**
- [TypeScript Map](https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html#map)

---

## 🔑 Key Methods

### `registerWidget(config: WidgetConfig): void`
**WHERE**: Lines 37-39

**WHY**: Registers a widget type configuration

**WHEN**: Called during initialization or dynamically

**HOW**: Stores config in Map by widget type

**WHICH**: Registry pattern

### `getWidgetConfig(type: WidgetType): WidgetConfig | undefined`
**WHERE**: Lines 44-46

**WHY**: Retrieves widget configuration by type

**WHEN**: Called when creating widgets

**HOW**: Looks up configuration in Map

**WHICH**: Map lookup pattern

---

## 📚 Documentation Links

- [Registry Pattern](https://refactoring.guru/design-patterns/registry)

---

**Next**: Explore [Components Documentation](../Components/README.md)
