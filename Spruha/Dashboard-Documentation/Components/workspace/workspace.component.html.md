# Workspace Component HTML - Complete Documentation

## 📄 File Information

- **File Path**: `src/app/shared/components/workspace/workspace.component.html`
- **Purpose**: Template structure for CSS Grid container
- **Dependencies**: WorkspaceComponent TypeScript, WidgetFrameComponent

## 🎯 Template Overview

### WHERE
**Location**: `src/app/shared/components/workspace/workspace.component.html`

### WHY
Defines the CSS Grid container structure that:
- Creates grid layout
- Projects widget content via `<ng-content>`
- Handles drag & drop with CDK directives

### WHEN
Rendered when WorkspaceComponent is instantiated

### HOW
Uses CSS Grid with dynamic `grid-template-columns`, CDK drag directives

### WHICH
**Concepts Used:**
- Angular Template Syntax
- Content Projection (`<ng-content>`)
- Angular CDK Directives
- CSS Grid

**Documentation Links:**
- [Angular Templates](https://angular.io/guide/template-syntax)
- [Content Projection](https://angular.io/guide/content-projection)

---

## 📋 Template Structure

```html
<div class="workspace-grid"
     [style.grid-template-columns]="gridTemplateColumns"
     [style.gap]="gridGap"
     cdkDropList
     (cdkDropListDropped)="onWidgetDrop($event)">
  @for (widget of filteredWidgets; track widget.id) {
    <app-widget-frame
      [widget]="widget"
      (resize)="onWidgetResize($event)"
      ...
      cdkDrag>
      <ng-content></ng-content>
    </app-widget-frame>
  }
</div>
```

### Key Elements

#### `<div class="workspace-grid">`
**WHY**: Main grid container with dynamic CSS Grid properties

**WHICH**: CSS Grid container pattern

#### `<ng-content>`
**WHY**: Content projection for widget content from parent

**WHICH**: Angular content projection pattern

#### `cdkDrag` / `cdkDropList`
**WHY**: Angular CDK directives for drag & drop functionality

**WHICH**: Angular CDK drag-drop pattern

---

## 📚 Documentation Links

- [Angular Templates](https://angular.io/guide/template-syntax)
- [Angular CDK DragDrop](https://material.angular.io/cdk/drag-drop/overview)

---

**Next**: Read [Styles](./workspace.component.scss.md)
