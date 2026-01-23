# Widget System - Architecture

## 🎯 Overview

This document explains the widget system architecture.

## 📋 Widget System Concepts

### Widget Types
**WHERE**: WidgetType union type

**WHY**: Defines allowed widget types

**WHEN**: When creating/registering widgets

**HOW**: Union type: `'metric-card' | 'chart-widget' | 'table-widget'`

**WHICH**: TypeScript union type pattern

### Widget Registry
**WHERE**: WidgetRegistryService

**WHY**: Central registry for widget configurations

**WHEN**: When creating widgets

**HOW**: Map of widget type to configuration

**WHICH**: Registry pattern

### Widget Frame
**WHERE**: WidgetFrameComponent

**WHY**: Universal wrapper for all widgets

**WHEN**: Every widget is wrapped

**HOW**: Content projection with controls

**WHICH**: Wrapper component pattern

### Widget State
**WHERE**: WorkspaceStateService

**WHY**: Persists widget positions/sizes

**WHEN**: After any widget change

**HOW**: Saved to localStorage

**WHICH**: State persistence pattern

---

## 📚 Documentation Links

- [TypeScript Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)

---

**Next**: Explore [Appendices Documentation](../Appendices/README.md)
