import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  AfterViewChecked,
  HostListener,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetFrame } from '../../models/workspace.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-widget-settings-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-settings-popup.component.html',
  styleUrl: './widget-settings-popup.component.scss',
})
export class WidgetSettingsPopupComponent
  implements OnInit, OnChanges, AfterViewInit, AfterViewChecked, OnDestroy
{
  @Input() widget!: WidgetFrame;
  @Input() isOpen: boolean = false;

  @Output() sizeChange = new EventEmitter<{
    columnSpan: number;
    rowSpan: number;
  }>();
  @Output() delete = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  @ViewChild('popup', { static: false }) popupElement!: ElementRef<HTMLElement>;

  currentWidth: number = 1;
  currentHeight: number = 1;
  popupStyle: { top?: string; left?: string; transform?: string } = {};
  private destroy$ = new Subject<void>();
  private positionUpdatePending = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('[WidgetSettingsPopup] ngOnInit', {
      isOpen: this.isOpen,
      widgetId: this.widget?.id,
    });
    this.updateCurrentSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('[WidgetSettingsPopup] ngOnChanges', {
      isOpen: this.isOpen,
      hasIsOpenChange: !!changes['isOpen'],
      widgetId: this.widget?.id,
    });

    this.updateCurrentSize();
    if (changes['isOpen'] && this.isOpen) {
      console.log(
        '[WidgetSettingsPopup] isOpen changed to true, updating position'
      );
      this.positionUpdatePending = true;
      // Use setTimeout to ensure DOM is ready after @if condition renders
      setTimeout(() => {
        this.updatePopupPosition();
        this.positionUpdatePending = false;
        this.cdr.detectChanges();
      }, 0);
    }

    // If widget size changed, reposition popup to stay inside widget
    // This ensures popup adjusts automatically when widget is resized
    if (changes['widget'] && this.isOpen) {
      setTimeout(() => {
        this.updatePopupPosition();
      }, 0);
    }
  }

  ngAfterViewInit(): void {
    console.log('[WidgetSettingsPopup] ngAfterViewInit', {
      isOpen: this.isOpen,
      widgetId: this.widget?.id,
      popupElementExists: !!this.popupElement?.nativeElement,
    });
    if (this.isOpen) {
      this.positionUpdatePending = true;
      // Use double setTimeout to ensure DOM is fully rendered
      setTimeout(() => {
        setTimeout(() => {
          this.updatePopupPosition();
          this.positionUpdatePending = false;
        }, 0);
      }, 0);
    }
  }

  ngAfterViewChecked(): void {
    // If position update is pending and popup element is now available, update position
    if (
      this.positionUpdatePending &&
      this.isOpen &&
      this.popupElement?.nativeElement
    ) {
      console.log(
        '[WidgetSettingsPopup] ngAfterViewChecked - popup element now available, updating position'
      );
      this.updatePopupPosition();
      this.positionUpdatePending = false;
      this.cdr.detectChanges();
    }
  }

  private updatePopupPosition(): void {
    console.log('[WidgetSettingsPopup] updatePopupPosition called', {
      widgetId: this.widget?.id,
      popupElementExists: !!this.popupElement?.nativeElement,
    });

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      if (this.widget) {
        let widgetElement: HTMLElement | null = null;

        // Strategy 1: Try finding by data-widget-id attribute (most reliable)
        widgetElement = document.querySelector(
          `.widget-frame[data-widget-id="${this.widget.id}"]`
        ) as HTMLElement;

        // Strategy 2: Try finding by widget-frame ID attribute
        if (!widgetElement) {
          widgetElement = document.querySelector(
            `#widget-frame-${this.widget.id}`
          ) as HTMLElement;
        }

        // Strategy 3: Try finding by data-widget-id on any element
        if (!widgetElement) {
          widgetElement = document.querySelector(
            `[data-widget-id="${this.widget.id}"]`
          ) as HTMLElement;
        }

        // Strategy 4: Try finding by closest widget-frame ancestor from popup element
        if (!widgetElement && this.popupElement?.nativeElement) {
          widgetElement = this.popupElement.nativeElement.closest(
            '.widget-frame'
          ) as HTMLElement;
        }

        // Strategy 5: Try finding by parent element if popup is inside widget
        if (!widgetElement && this.popupElement?.nativeElement) {
          const parent = this.popupElement.nativeElement.parentElement;
          if (parent && parent.classList.contains('widget-frame')) {
            widgetElement = parent;
          }
        }

        console.log('[WidgetSettingsPopup] Widget element found', {
          widgetElementExists: !!widgetElement,
          widgetId: this.widget.id,
          widgetTagName: widgetElement?.tagName,
          widgetClasses: widgetElement?.className,
        });

        if (widgetElement) {
          // Get widget dimensions (position: absolute is relative to widget frame)
          const widgetRect = widgetElement.getBoundingClientRect();
          const widgetWidth = widgetElement.offsetWidth || widgetRect.width;
          const widgetHeight = widgetElement.offsetHeight || widgetRect.height;
          const popupWidth = 220; // Popup width
          const popupHeight = 200; // Approximate popup height

          // Position popup inside widget, near top-right (where settings button is)
          // Using absolute positioning relative to widget frame (which has position: relative)
          const offsetFromTop = 50; // Space for header + settings button
          const offsetFromRight = 10; // Small margin from right edge

          // Calculate position relative to widget frame (not viewport)
          // Since popup uses position: absolute, these values are relative to the widget frame
          let top = offsetFromTop;
          let left = widgetWidth - popupWidth - offsetFromRight;

          // Ensure popup stays inside widget bounds
          // If widget is too small, adjust position
          if (left < 10) {
            left = 10; // Keep 10px margin from left
          }
          if (top + popupHeight > widgetHeight - 10) {
            top = Math.max(10, widgetHeight - popupHeight - 10); // Keep 10px margin from bottom
          }

          // Ensure minimum position values
          top = Math.max(10, top);
          left = Math.max(10, left);

          // Ensure popup doesn't overflow widget
          if (left + popupWidth > widgetWidth - 10) {
            left = widgetWidth - popupWidth - 10;
          }
          if (left < 10) {
            left = 10;
          }

          this.popupStyle = {
            top: `${top}px`,
            left: `${left}px`,
            transform: 'none', // No transform needed for absolute positioning
          };

          console.log(
            '[WidgetSettingsPopup] Position calculated (inside widget)',
            {
              top: this.popupStyle.top,
              left: this.popupStyle.left,
              widgetDimensions: {
                width: widgetWidth,
                height: widgetHeight,
              },
              popupDimensions: {
                width: popupWidth,
                height: popupHeight,
              },
            }
          );
        } else {
          console.warn(
            '[WidgetSettingsPopup] Widget element not found, using fallback position'
          );
          // Fallback: center on viewport if widget not found
          // But this should rarely happen if data-widget-id is set correctly
          this.popupStyle = {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          };
        }
      }
    });
  }

  private updateCurrentSize(): void {
    if (this.widget) {
      this.currentWidth =
        this.widget.size?.width || this.widget.position?.columnSpan || 1;
      this.currentHeight =
        this.widget.size?.height || this.widget.position?.rowSpan || 1;
      // Ensure values are within 1-4 range
      this.currentWidth = Math.max(1, Math.min(4, this.currentWidth));
      this.currentHeight = Math.max(1, Math.min(4, this.currentHeight));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen) return;

    // Check if click is outside the popup
    if (
      this.popupElement?.nativeElement &&
      !this.popupElement.nativeElement.contains(event.target as Node)
    ) {
      // Also check if it's not the backdrop
      const backdrop = document.querySelector(
        '.widget-settings-popup-backdrop'
      );
      if (backdrop && backdrop.contains(event.target as Node)) {
        return; // Backdrop click is handled by backdrop's own click handler
      }
      this.onClose();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isOpen) {
      this.onClose();
    }
  }

  onWidthChange(width: number): void {
    if (width >= 1 && width <= 4 && width !== this.currentWidth) {
      this.currentWidth = width;
      this.sizeChange.emit({
        columnSpan: width,
        rowSpan: this.currentHeight,
      });
      // Reposition popup after size change to stay inside widget
      setTimeout(() => {
        this.updatePopupPosition();
      }, 100); // Small delay to allow widget to resize
    }
  }

  onHeightChange(height: number): void {
    if (height >= 1 && height <= 4 && height !== this.currentHeight) {
      this.currentHeight = height;
      this.sizeChange.emit({
        columnSpan: this.currentWidth,
        rowSpan: height,
      });
      // Reposition popup after size change to stay inside widget
      setTimeout(() => {
        this.updatePopupPosition();
      }, 100); // Small delay to allow widget to resize
    }
  }

  onDelete(): void {
    this.delete.emit();
    this.onClose();
  }

  onClose(): void {
    // Save state when closing settings popup to ensure layout memory
    this.close.emit();
  }

  isWidthActive(width: number): boolean {
    return this.currentWidth === width;
  }

  isHeightActive(height: number): boolean {
    return this.currentHeight === height;
  }
}
