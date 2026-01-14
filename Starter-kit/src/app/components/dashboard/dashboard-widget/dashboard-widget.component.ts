import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { WidgetConfig } from '../../../shared/models/dashboard-widget.interface';

@Component({
  selector: 'app-dashboard-widget',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './dashboard-widget.component.html',
  styleUrl: './dashboard-widget.component.scss',
})
export class DashboardWidgetComponent implements OnInit, OnChanges {
  @Input() widgetConfig!: WidgetConfig;
  @Input() editMode: boolean = false;
  @Output() positionChange = new EventEmitter<{
    widgetId: string;
    gridColumnStart: number;
    gridColumnEnd: number;
    gridRowStart: number;
    gridRowEnd: number;
  }>();
  @Output() sizeChange = new EventEmitter<{
    widgetId: string;
    gridColumnStart: number;
    gridColumnEnd: number;
    gridRowStart: number;
    gridRowEnd: number;
  }>();
  @Output() configClick = new EventEmitter<string>();

  gridStyles: { [key: string]: string } = {};

  ngOnInit(): void {
    this.updateGridStyles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['widgetConfig']) {
      this.updateGridStyles();
    }
  }

  private updateGridStyles(): void {
    if (this.widgetConfig) {
      this.gridStyles = {
        'grid-column-start': this.widgetConfig.gridColumnStart.toString(),
        'grid-column-end': this.widgetConfig.gridColumnEnd.toString(),
        'grid-row-start': this.widgetConfig.gridRowStart.toString(),
        'grid-row-end': this.widgetConfig.gridRowEnd.toString(),
      };
    }
  }

  onDragDropped(event: CdkDragDrop<any>): void {
    // Position changes are handled by the parent component
    // This component just emits the event
  }

  onConfigClick(): void {
    this.configClick.emit(this.widgetConfig.id);
  }

  getGridColumnSpan(): number {
    return this.widgetConfig.gridColumnEnd - this.widgetConfig.gridColumnStart;
  }

  getGridRowSpan(): number {
    return this.widgetConfig.gridRowEnd - this.widgetConfig.gridRowStart;
  }
}
