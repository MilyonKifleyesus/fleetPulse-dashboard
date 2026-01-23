# Drag & Drop System - Implementation

## 🎯 Overview

This document explains the drag & drop implementation using Angular CDK.

## 📋 Drag & Drop Concepts

### Angular CDK DragDrop
**WHERE**: WorkspaceComponent

**WHY**: Provides drag & drop functionality

**WHEN**: In edit mode for widget reordering

**HOW**: Uses `cdkDrag` and `cdkDropList` directives

**WHICH**: Angular CDK drag-drop pattern

**Documentation**: [Angular CDK DragDrop](https://material.angular.io/cdk/drag-drop/overview)

### cdkDrag Directive
**WHERE**: WidgetFrameComponent in template

**WHY**: Makes element draggable

**WHEN**: In edit mode

**HOW**: `<app-widget-frame cdkDrag>`

**WHICH**: Angular CDK directive pattern

### cdkDropList Directive
**WHERE**: WorkspaceComponent grid container

**WHY**: Defines drop zone

**WHEN**: Always active on grid

**HOW**: `<div cdkDropList (cdkDropListDropped)="onWidgetDrop($event)">`

**WHICH**: Angular CDK drop list pattern

---

## 📚 Documentation Links

- [Angular CDK DragDrop](https://material.angular.io/cdk/drag-drop/overview)

---

**Next**: Read [Widget System](./Widget-System.md)
