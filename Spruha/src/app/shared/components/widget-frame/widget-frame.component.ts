import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetFrame, GridPosition } from '../../models/workspace.interface';
import { WorkspaceModeService } from '../../services/workspace-mode.service';
import { WorkspaceAnimationService } from '../../services/workspace-animation.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-widget-frame',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-frame.component.html',
  styleUrl: './widget-frame.component.scss',
})
export class WidgetFrameComponent implements OnInit, OnDestroy {
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

  @HostBinding('style.grid-area') get gridAreaStyle(): string {
    return this.gridArea;
  }

  @HostBinding('attr.data-widget-id') get widgetId(): string {
    return this.widget.id;
  }

  isEditMode = false;
  isResizing = false;
  private destroy$ = new Subject<void>();

  constructor(
    private modeService: WorkspaceModeService,
    private animationService: WorkspaceAnimationService
  ) {}

  ngOnInit(): void {
    this.modeService.mode$.pipe(takeUntil(this.destroy$)).subscribe((mode) => {
      this.isEditMode = mode === 'edit';
    });
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
    this.settings.emit(this.widget.id);
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
}
