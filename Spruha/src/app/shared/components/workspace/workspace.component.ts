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
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { WorkspaceState, WidgetFrame, WorkspaceLayout } from '../../models/workspace.interface';
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
  styleUrl: './workspace.component.scss'
})
export class WorkspaceComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() workspaceId: string = 'default';
  @Input() userId?: string;
  @Input() widgets: WidgetFrame[] = [];
  @Input() initialLayout?: WorkspaceLayout;

  @Output() widgetAdded = new EventEmitter<WidgetFrame>();
  @Output() widgetRemoved = new EventEmitter<string>();
  @Output() widgetMoved = new EventEmitter<{ id: string; position: any }>();
  @Output() widgetResized = new EventEmitter<{ id: string; size: any }>();

  @ViewChild('workspaceContainer', { static: false }) container!: ElementRef<HTMLElement>;

  currentLayout: WorkspaceLayout = {
    columns: 12,
    gap: 16,
    breakpoint: 'desktop',
    minWidgetWidth: 280
  };

  displayedWidgets: WidgetFrame[] = [];
  isEditMode = false;
  private destroy$ = new Subject<void>();
  private resizeObserver?: ResizeObserver;

  constructor(
    private stateService: WorkspaceStateService,
    private gridService: GridLayoutService,
    private modeService: WorkspaceModeService,
    private animationService: WorkspaceAnimationService,
    private widgetRegistry: WidgetRegistryService
  ) {}

  ngOnInit(): void {
    // Subscribe to mode changes
    this.modeService.mode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(mode => {
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
    const state = this.stateService.loadWorkspaceState(this.workspaceId, this.userId);
    
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
   */
  private calculateLayout(): void {
    if (!this.container?.nativeElement) return;

    const containerWidth = this.container.nativeElement.clientWidth;
    const layout = this.gridService.calculateLayout(
      containerWidth,
      this.currentLayout.minWidgetWidth
    );

    this.currentLayout = { ...this.currentLayout, ...layout };
    this.updateLayoutInState();
  }

  /**
   * Setup ResizeObserver to recalculate layout on container resize
   */
  private setupResizeObserver(): void {
    if (!this.container?.nativeElement || typeof ResizeObserver === 'undefined') {
      // Fallback to window resize event
      fromEvent(window, 'resize')
        .pipe(
          debounceTime(250),
          takeUntil(this.destroy$)
        )
        .subscribe(() => this.calculateLayout());
      return;
    }

    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
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

    moveItemInArray(this.displayedWidgets, event.previousIndex, event.currentIndex);

    // Update widget order
    this.displayedWidgets.forEach((widget, index) => {
      widget.order = index;
    });

    // Recalculate positions
    this.updateWidgetPositions();

    // Save state
    this.saveWorkspaceState();
  }

  /**
   * Handle widget resize
   */
  onWidgetResize(event: { id: string; size: { columnSpan: number; rowSpan: number } }): void {
    const widget = this.displayedWidgets.find(w => w.id === event.id);
    if (!widget) return;

    widget.size.width = event.size.columnSpan;
    widget.size.height = event.size.rowSpan;
    widget.position.columnSpan = event.size.columnSpan;
    widget.position.rowSpan = event.size.rowSpan;

    this.updateWidgetPositions();
    this.saveWorkspaceState();
    this.widgetResized.emit(event);
  }

  /**
   * Handle widget deletion
   */
  onWidgetDelete(widgetId: string): void {
    this.stateService.removeWidget(this.workspaceId, widgetId, this.userId);
    this.displayedWidgets = this.displayedWidgets.filter(w => w.id !== widgetId);
    this.updateWidgetPositions();
    this.saveWorkspaceState();
    this.widgetRemoved.emit(widgetId);
  }

  /**
   * Handle widget minimize
   */
  onWidgetMinimize(widgetId: string): void {
    const widget = this.displayedWidgets.find(w => w.id === widgetId);
    if (widget) {
      widget.isMinimized = !widget.isMinimized;
      this.saveWorkspaceState();
    }
  }

  /**
   * Handle widget maximize
   */
  onWidgetMaximize(widgetId: string): void {
    const widget = this.displayedWidgets.find(w => w.id === widgetId);
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
    return this.displayedWidgets.find(w => w.id === widgetId);
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
        rowSpan: widgetConfig.defaultSize.rowSpan
      },
      size: {
        width: widgetConfig.defaultSize.columnSpan,
        height: widgetConfig.defaultSize.rowSpan
      },
      isMinimized: false,
      isMaximized: false,
      config: config || {},
      order: this.displayedWidgets.length
    };

    // Find available position
    const existingPositions = this.displayedWidgets.map(w => w.position);
    const availablePosition = this.gridService.findNextAvailablePosition(
      existingPositions,
      {
        columnSpan: newWidget.size.width,
        rowSpan: newWidget.size.height
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
   * Update widget positions to ensure no collisions
   */
  private updateWidgetPositions(): void {
    // Sort by order
    this.displayedWidgets.sort((a, b) => a.order - b.order);

    // Auto-arrange if needed
    const widgetData = this.displayedWidgets.map(w => ({
      id: w.id,
      size: {
        columnSpan: w.size.width,
        rowSpan: w.size.height
      }
    }));

    const newPositions = this.gridService.autoArrangeWidgets(
      widgetData,
      this.currentLayout.columns
    );

    // Update widget positions
    this.displayedWidgets.forEach(widget => {
      const newPosition = newPositions.get(widget.id);
      if (newPosition) {
        widget.position = newPosition;
        widget.size.width = newPosition.columnSpan;
        widget.size.height = newPosition.rowSpan;
      }
    });
  }

  /**
   * Save workspace state
   */
  private saveWorkspaceState(): void {
    const state: WorkspaceState = {
      workspaceId: this.workspaceId,
      userId: this.userId,
      widgets: [...this.displayedWidgets],
      layout: { ...this.currentLayout },
      lastModified: new Date(),
      version: '1.0.0',
      isEditMode: this.isEditMode
    };

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
   */
  get gridTemplateColumns(): string {
    return this.gridService.generateGridTemplateColumns(
      this.currentLayout.columns,
      this.currentLayout.gap
    );
  }

  /**
   * Get grid gap CSS value
   */
  get gridGap(): string {
    return `${this.currentLayout.gap}px`;
  }
}
