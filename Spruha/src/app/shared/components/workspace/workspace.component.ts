import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import {
  WorkspaceState,
  WidgetFrame,
  WorkspaceLayout,
} from '../../models/workspace.interface';
import { WorkspaceStateService } from '../../services/workspace-state.service';
import { GridLayoutService } from '../../services/grid-layout.service';
import { WorkspaceModeService } from '../../services/workspace-mode.service';
import { WorkspaceAnimationService } from '../../services/workspace-animation.service';
import { WidgetRegistryService } from '../../services/widget-registry.service';
import { WidgetFrameComponent } from '../widget-frame/widget-frame.component';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, DragDropModule, WidgetFrameComponent],
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @Input() workspaceId: string = 'default';
  @Input() userId?: string;
  @Input() widgets: WidgetFrame[] = [];
  @Input() initialLayout?: WorkspaceLayout;

  @Output() widgetAdded = new EventEmitter<WidgetFrame>();
  @Output() widgetRemoved = new EventEmitter<string>();
  @Output() widgetMoved = new EventEmitter<{ id: string; position: any }>();
  @Output() widgetResized = new EventEmitter<{ id: string; size: any }>();

  @ViewChild('workspaceContainer', { static: false })
  container!: ElementRef<HTMLElement>;

  currentLayout: WorkspaceLayout = {
    columns: 12,
    gap: 24, // Match blueprint: gap-6 = 24px
    breakpoint: 'desktop',
    minWidgetWidth: 280,
  };

  displayedWidgets: WidgetFrame[] = [];
  isEditMode = false;
  private destroy$ = new Subject<void>();
  private resizeObserver?: ResizeObserver;

  gridTemplateColumnsValue: string = '';
  gridGapValue: string = '24px';

  /**
   * Check if any widget is maximized
   * Used to hide all non-maximized widgets when one is maximized
   */
  get hasMaximizedWidget(): boolean {
    return this.displayedWidgets.some((widget) => widget.isMaximized);
  }

  /**
   * Get filtered widgets for display
   * When any widget is maximized, only show the maximized widget(s)
   * Otherwise, show all widgets
   */
  get filteredWidgets(): WidgetFrame[] {
    if (this.hasMaximizedWidget) {
      // Only show maximized widgets when any widget is maximized
      return this.displayedWidgets.filter((widget) => widget.isMaximized);
    }
    // Show all widgets when none are maximized
    return this.displayedWidgets;
  }

  constructor(
    private stateService: WorkspaceStateService,
    private gridService: GridLayoutService,
    private modeService: WorkspaceModeService,
    private animationService: WorkspaceAnimationService,
    private widgetRegistry: WidgetRegistryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to mode changes
    this.modeService.mode$.pipe(takeUntil(this.destroy$)).subscribe((mode) => {
      this.isEditMode = mode === 'edit';
    });

    // Load workspace state
    this.loadWorkspaceState();

    // Initialize widgets
    if (this.widgets.length > 0) {
      this.displayedWidgets = [...this.widgets];
    } else {
      this.displayedWidgets = [];
    }

    // Set initial layout
    if (this.initialLayout) {
      this.currentLayout = { ...this.initialLayout };
    }
  }

  ngAfterViewInit(): void {
    if (this.container?.nativeElement) {
      this.calculateLayout();
      this.updateGridTemplate();
      this.setupResizeObserver();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['widgets'] && !changes['widgets'].firstChange) {
      this.displayedWidgets = [...this.widgets];
      this.updateWidgetPositions();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.resizeObserver?.disconnect();
  }

  /**
   * Load workspace state from service
   */
  private loadWorkspaceState(): void {
    const state = this.stateService.loadWorkspaceState(
      this.workspaceId,
      this.userId
    );

    if (state) {
      this.currentLayout = state.layout;
      if (state.widgets.length > 0) {
        this.displayedWidgets = [...state.widgets];
      }
      this.isEditMode = state.isEditMode || false;
      if (this.isEditMode) {
        this.modeService.setMode('edit');
      }
    }
  }

  /**
   * Calculate grid layout based on container width
   * This ensures responsive layout that auto-wraps widgets to new rows
   */
  private calculateLayout(): void {
    if (!this.container?.nativeElement) return;

    const containerWidth = this.container.nativeElement.clientWidth;
    const oldColumns = this.currentLayout.columns;
    const layout = this.gridService.calculateLayout(
      containerWidth,
      this.currentLayout.minWidgetWidth
    );

    this.currentLayout = { ...this.currentLayout, ...layout };
    this.updateGridTemplate();
    this.updateLayoutInState();

    // If column count changed, re-arrange widgets to wrap to new rows
    if (oldColumns !== layout.columns && this.displayedWidgets.length > 0) {
      this.updateWidgetPositions();
      // Animate layout shift when responsive breakpoint changes
      setTimeout(() => {
        if (this.container?.nativeElement) {
          this.animationService.animateLayoutShift(
            this.container.nativeElement
          );
        }
      }, 0);
    }
  }

  /**
   * Setup ResizeObserver to recalculate layout on container resize
   * This ensures widgets auto-wrap to new rows when screen gets narrow
   */
  private setupResizeObserver(): void {
    if (
      !this.container?.nativeElement ||
      typeof ResizeObserver === 'undefined'
    ) {
      // Fallback to window resize event
      fromEvent(window, 'resize')
        .pipe(debounceTime(250), takeUntil(this.destroy$))
        .subscribe(() => {
          // calculateLayout() will trigger widget re-arrangement if columns change
          this.calculateLayout();
        });
      return;
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // calculateLayout() will trigger widget re-arrangement if columns change
        this.calculateLayout();
      }
    });

    this.resizeObserver.observe(this.container.nativeElement);
  }

  /**
   * Handle widget drag and drop
   */
  onWidgetDrop(event: CdkDragDrop<WidgetFrame[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    moveItemInArray(
      this.displayedWidgets,
      event.previousIndex,
      event.currentIndex
    );

    // Update widget order
    this.displayedWidgets.forEach((widget, index) => {
      widget.order = index;
    });

    // Recalculate positions with auto-arrange
    this.updateWidgetPositions();

    // Animate the layout shift after drag-drop
    if (this.container?.nativeElement) {
      // Use setTimeout to ensure DOM has updated before animating
      setTimeout(() => {
        this.animationService.animateLayoutShift(this.container.nativeElement);
      }, 0);
    }

    // Save state
    this.saveWorkspaceState();
  }

  /**
   * Handle widget resize (supports discrete size changes 1-4 columns/rows)
   */
  onWidgetResize(event: {
    id: string;
    size: { columnSpan: number; rowSpan: number };
  }): void {
    const widget = this.displayedWidgets.find((w) => w.id === event.id);
    if (!widget) return;

    // Validate size constraints (1-4 for both dimensions)
    const columnSpan = Math.max(1, Math.min(4, event.size.columnSpan));
    const rowSpan = Math.max(1, Math.min(4, event.size.rowSpan));

    // Only update if size actually changed
    if (
      widget.size.width === columnSpan &&
      widget.size.height === rowSpan &&
      widget.position.columnSpan === columnSpan &&
      widget.position.rowSpan === rowSpan
    ) {
      return;
    }

    // Update widget size and position
    widget.size.width = columnSpan;
    widget.size.height = rowSpan;
    widget.position.columnSpan = columnSpan;
    widget.position.rowSpan = rowSpan;

    // Trigger layout recalculation with auto-arrange (fills gaps)
    // This ensures surrounding widgets realign perfectly - the "self-adjusting layout"
    // ALL widgets are repositioned (not just the resized one) to ensure no gaps
    this.updateWidgetPositions();

    // Animate the layout shift after size change
    // Changes are NOT instant or "snappy" - uses animation utility for "really smooth" transitions
    // Widget moves in "CSS grid row fashion" with fluid movement
    if (this.container?.nativeElement) {
      // Use setTimeout to ensure DOM has updated before animating
      setTimeout(() => {
        this.animationService.animateLayoutShift(this.container.nativeElement);
      }, 0);
    }

    // Save state - the new "where" of the widget is synced with local storage
    // This ensures the application "remembers the state of your dashboard"
    this.saveWorkspaceState();
    this.widgetResized.emit({ id: event.id, size: { columnSpan, rowSpan } });
  }

  /**
   * Handle widget deletion
   */
  onWidgetDelete(widgetId: string): void {
    this.stateService.removeWidget(this.workspaceId, widgetId, this.userId);
    this.displayedWidgets = this.displayedWidgets.filter(
      (w) => w.id !== widgetId
    );

    // Update positions with auto-arrange (fills the gap left by deleted widget)
    this.updateWidgetPositions();

    // Animate the layout shift after deletion
    if (this.container?.nativeElement) {
      // Use setTimeout to ensure DOM has updated before animating
      setTimeout(() => {
        this.animationService.animateLayoutShift(this.container.nativeElement);
      }, 0);
    }

    // Save state
    this.saveWorkspaceState();
    this.widgetRemoved.emit(widgetId);
  }

  /**
   * Handle widget minimize
   */
  onWidgetMinimize(widgetId: string): void {
    const widget = this.displayedWidgets.find((w) => w.id === widgetId);
    if (widget) {
      widget.isMinimized = !widget.isMinimized;
      this.saveWorkspaceState();
    }
  }

  /**
   * Handle widget maximize
   */
  onWidgetMaximize(widgetId: string): void {
    const widget = this.displayedWidgets.find((w) => w.id === widgetId);
    if (widget) {
      widget.isMaximized = !widget.isMaximized;
      this.saveWorkspaceState();
    }
  }

  /**
   * Handle widget settings
   */
  onWidgetSettings(widgetId: string): void {
    // Emit event for parent component to handle
    console.log('Widget settings requested:', widgetId);
  }

  /**
   * Get widget by ID
   */
  getWidget(widgetId: string): WidgetFrame | undefined {
    return this.displayedWidgets.find((w) => w.id === widgetId);
  }

  /**
   * Add a new widget
   */
  addWidget(type: string, config?: any): void {
    const widgetConfig = this.widgetRegistry.getWidgetConfig(type as any);
    if (!widgetConfig) return;

    const newWidget: WidgetFrame = {
      id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: type as any,
      title: widgetConfig.name,
      icon: widgetConfig.icon,
      position: {
        column: 1,
        row: 1,
        columnSpan: widgetConfig.defaultSize.columnSpan,
        rowSpan: widgetConfig.defaultSize.rowSpan,
      },
      size: {
        width: widgetConfig.defaultSize.columnSpan,
        height: widgetConfig.defaultSize.rowSpan,
      },
      isMinimized: false,
      isMaximized: false,
      config: config || {},
      order: this.displayedWidgets.length,
    };

    // Find available position
    const existingPositions = this.displayedWidgets.map((w) => w.position);
    const availablePosition = this.gridService.findNextAvailablePosition(
      existingPositions,
      {
        columnSpan: newWidget.size.width,
        rowSpan: newWidget.size.height,
      },
      this.currentLayout.columns
    );

    if (availablePosition) {
      newWidget.position = availablePosition;
    }

    this.displayedWidgets.push(newWidget);
    this.updateWidgetPositions();
    this.saveWorkspaceState();
    this.widgetAdded.emit(newWidget);
  }

  /**
   * Update widget positions to ensure no collisions and auto-arrange
   * This fills gaps and ensures widgets wrap to new rows when needed
   *
   * IMPORTANT: This re-arranges ALL widgets (not just the resized one)
   * to ensure surrounding widgets realign perfectly and no gaps are left.
   * This is the "self-adjusting layout" behavior.
   */
  private updateWidgetPositions(): void {
    // Sort by order to maintain widget sequence
    this.displayedWidgets.sort((a, b) => a.order - b.order);

    // Auto-arrange ALL widgets to fill gaps and wrap to new rows
    // This ensures surrounding widgets move to accommodate changes
    const widgetData = this.displayedWidgets.map((w) => ({
      id: w.id,
      size: {
        columnSpan: w.size.width,
        rowSpan: w.size.height,
      },
    }));

    // Get new positions for ALL widgets (compact layout, no gaps)
    const newPositions = this.gridService.autoArrangeWidgets(
      widgetData,
      this.currentLayout.columns
    );

    // Update ALL widget positions
    // This ensures surrounding widgets realign when one is resized
    this.displayedWidgets.forEach((widget) => {
      const newPosition = newPositions.get(widget.id);
      if (newPosition) {
        widget.position = newPosition;
        // Ensure size matches position
        widget.size.width = newPosition.columnSpan;
        widget.size.height = newPosition.rowSpan;
      }
    });
  }

  /**
   * Save workspace state
   * Called after every widget change to ensure layout memory persists
   *
   * State includes:
   * - Widget positions (column, row, columnSpan, rowSpan) - the "where" of each widget
   * - Widget sizes (width, height) - the dimensions of each widget
   * - Layout configuration (columns, gap, breakpoint)
   *
   * This ensures the application "remembers the state of your dashboard"
   * and widgets remain in their new size and position after page refresh.
   */
  private saveWorkspaceState(): void {
    const state: WorkspaceState = {
      workspaceId: this.workspaceId,
      userId: this.userId,
      widgets: [...this.displayedWidgets], // Includes position and size for each widget
      layout: { ...this.currentLayout },
      lastModified: new Date(),
      version: '1.0.0',
      isEditMode: this.isEditMode,
    };

    // Save to localStorage (debounced in service)
    // This ensures custom layout is remembered after closing settings and page refresh
    // The new "where" of each widget is synced with local storage
    this.stateService.saveWorkspaceState(state);
  }

  /**
   * Update layout in state service
   */
  private updateLayoutInState(): void {
    this.stateService.updateLayout(
      this.workspaceId,
      this.currentLayout,
      this.userId
    );
  }

  /**
   * Get grid template columns CSS value
   * Use cached value to avoid ExpressionChangedAfterItHasBeenCheckedError
   */
  get gridTemplateColumns(): string {
    if (!this.gridTemplateColumnsValue) {
      // Synchronously compute initial value to avoid flicker
      this.gridTemplateColumnsValue =
        this.gridService.generateGridTemplateColumns(
          this.currentLayout.columns,
          this.currentLayout.gap
        );
      // Then update asynchronously for refinement
      this.updateGridTemplate();
    }
    return this.gridTemplateColumnsValue;
  }

  /**
   * Get grid gap CSS value
   */
  get gridGap(): string {
    return this.gridGapValue;
  }

  /**
   * Update grid template columns (called after view init or on layout change)
   * Uses setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
   */
  private updateGridTemplate(): void {
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.gridTemplateColumnsValue =
          this.gridService.generateGridTemplateColumns(
            this.currentLayout.columns,
            this.currentLayout.gap
          );
        this.gridGapValue = `${this.currentLayout.gap}px`;
        // Only trigger change detection if value actually changed
        this.cdr.markForCheck();
      }, 0);
    });
  }
}
