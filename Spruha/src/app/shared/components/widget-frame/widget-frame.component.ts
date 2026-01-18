import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  HostBinding,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetFrame, GridPosition } from '../../models/workspace.interface';
import { WorkspaceModeService } from '../../services/workspace-mode.service';
import { WorkspaceAnimationService } from '../../services/workspace-animation.service';
import { WidgetSettingsPopupComponent } from '../widget-settings-popup/widget-settings-popup.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-widget-frame',
  standalone: true,
  imports: [CommonModule, WidgetSettingsPopupComponent],
  templateUrl: './widget-frame.component.html',
  styleUrl: './widget-frame.component.scss',
})
export class WidgetFrameComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() widget!: WidgetFrame;
  @Input() gridColumns: number = 12;
  @Output() resize = new EventEmitter<{
    id: string;
    size: { columnSpan: number; rowSpan: number };
  }>();
  @Output() delete = new EventEmitter<string>();
  @Output() minimize = new EventEmitter<string>();
  @Output() maximize = new EventEmitter<string>();
  @Output() settings = new EventEmitter<string>();

  @ViewChild('frameElement', { static: false })
  frameElement!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    // Ensure data-widget-id is set after view init
    if (this.frameElement?.nativeElement && this.widget?.id) {
      this.frameElement.nativeElement.setAttribute(
        'data-widget-id',
        this.widget.id
      );
    }
  }

  @HostBinding('style.grid-area') get gridAreaStyle(): string {
    // Don't apply grid-area when maximized - it conflicts with fixed positioning
    if (this.widget?.isMaximized) {
      return '';
    }
    return this.gridArea;
  }

  @HostBinding('attr.data-widget-id') get widgetId(): string {
    return this.widget?.id || '';
  }

  @HostBinding('attr.id') get widgetElementId(): string {
    return `widget-frame-${this.widget?.id || ''}`;
  }

  isEditMode = false;
  isResizing = false;
  isSettingsPopupOpen = false;
  private destroy$ = new Subject<void>();

  constructor(
    private modeService: WorkspaceModeService,
    private animationService: WorkspaceAnimationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.modeService.mode$.pipe(takeUntil(this.destroy$)).subscribe((mode) => {
      this.isEditMode = mode === 'edit';
      if (!this.isEditMode) {
        this.isSettingsPopupOpen = false; // Close popup when exiting edit mode
      }
    });

    // Set widget ID as data attribute for CSS/JS targeting
    if (this.frameElement?.nativeElement && this.widget?.id) {
      this.frameElement.nativeElement.setAttribute(
        'data-widget-id',
        this.widget.id
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDelete(): void {
    if (this.frameElement?.nativeElement) {
      this.animationService.animateWidgetOut(
        this.frameElement.nativeElement,
        () => this.delete.emit(this.widget.id)
      );
    } else {
      this.delete.emit(this.widget.id);
    }
  }

  onMinimize(): void {
    this.minimize.emit(this.widget.id);
  }

  onMaximize(): void {
    this.maximize.emit(this.widget.id);
  }

  onSettings(): void {
    // If not in edit mode, transition to edit mode first
    if (!this.isEditMode) {
      this.modeService.setMode('edit');
      // Wait for edit mode to activate before opening popup
      setTimeout(() => {
        this.isSettingsPopupOpen = true;
        this.cdr.detectChanges();
      }, 0);
    } else {
      // Toggle popup visibility in edit mode
      this.isSettingsPopupOpen = !this.isSettingsPopupOpen;
      this.cdr.detectChanges();
    }

    // Always emit settings event for parent component awareness
    this.settings.emit(this.widget.id);
  }

  onSettingsSizeChange(event: { columnSpan: number; rowSpan: number }): void {
    this.resize.emit({
      id: this.widget.id,
      size: event,
    });
  }

  onSettingsDelete(): void {
    this.onDelete();
  }

  onSettingsClose(): void {
    this.isSettingsPopupOpen = false;
    // State is automatically saved by workspace component after any change
    // This ensures layout memory persists after closing settings popup
  }

  onResizeStart(
    event: MouseEvent,
    direction: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
  ): void {
    if (!this.isEditMode) return;

    event.preventDefault();
    event.stopPropagation();
    this.isResizing = true;

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = this.widget.size.width;
    const startHeight = this.widget.size.height;
    const gridColumnWidth = this.calculateGridColumnWidth();

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      // Calculate new dimensions based on direction
      if (direction.includes('e')) {
        const columnsToAdd = Math.round(deltaX / gridColumnWidth);
        newWidth = Math.max(2, Math.min(12, startWidth + columnsToAdd));
      }
      if (direction.includes('w')) {
        const columnsToAdd = Math.round(-deltaX / gridColumnWidth);
        newWidth = Math.max(2, Math.min(12, startWidth + columnsToAdd));
      }
      if (direction.includes('s')) {
        const rowsToAdd = Math.round(deltaY / 50); // Approximate row height
        newHeight = Math.max(2, Math.min(8, startHeight + rowsToAdd));
      }
      if (direction.includes('n')) {
        const rowsToAdd = Math.round(-deltaY / 50);
        newHeight = Math.max(2, Math.min(8, startHeight + rowsToAdd));
      }

      if (
        newWidth !== this.widget.size.width ||
        newHeight !== this.widget.size.height
      ) {
        this.resize.emit({
          id: this.widget.id,
          size: {
            columnSpan: newWidth,
            rowSpan: newHeight,
          },
        });
      }
    };

    const onMouseUp = () => {
      this.isResizing = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  private calculateGridColumnWidth(): number {
    if (!this.frameElement?.nativeElement) return 0;
    const container =
      this.frameElement.nativeElement.closest('.workspace-grid');
    if (!container) return 0;
    const containerWidth = container.clientWidth;
    const gap = 16;
    return (containerWidth - gap * (this.gridColumns + 1)) / this.gridColumns;
  }

  get gridArea(): string {
    return `${this.widget.position.row} / ${this.widget.position.column} / ${
      this.widget.position.row + this.widget.position.rowSpan
    } / ${this.widget.position.column + this.widget.position.columnSpan}`;
  }

  getIconName(): string {
    if (!this.widget?.icon) return 'dashboard';

    // Map widget icons to Material Symbols
    const iconMap: Record<string, string> = {
      'fe fe-box': 'dashboard',
      'fe fe-bar-chart': 'bar_chart',
      'fe fe-bar-chart-2': 'bar_chart',
      'fe fe-trending-up': 'trending_up',
      'fe fe-users': 'people',
      'fe fe-truck': 'local_shipping',
      'fe fe-wrench': 'build',
      'fe fe-dollar-sign': 'attach_money',
      'fe fe-home': 'home',
      'fe fe-activity': 'activity',
      'fe fe-pie-chart': 'pie_chart',
      'fe fe-layers': 'layers',
      'fe fe-list': 'list',
    };

    // Try to find mapped icon
    const mappedIcon = iconMap[this.widget.icon];
    if (mappedIcon) return mappedIcon;

    // If widget has an icon property that's not a class, try to use it directly
    if (this.widget.icon && !this.widget.icon.startsWith('fe')) {
      return this.widget.icon;
    }

    // Default icon based on widget type
    if (this.widget.type === 'metric-card') return 'dashboard';
    if (this.widget.type === 'chart-widget') return 'bar_chart';
    if (this.widget.type === 'activity-feed') return 'activity';
    if (this.widget.type === 'table-widget') return 'list';

    return 'dashboard';
  }
}
