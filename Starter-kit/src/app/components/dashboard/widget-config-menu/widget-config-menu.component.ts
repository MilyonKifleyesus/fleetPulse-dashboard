import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WidgetConfig } from '../../../shared/models/dashboard-widget.interface';

@Component({
  selector: 'app-widget-config-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './widget-config-menu.component.html',
  styleUrl: './widget-config-menu.component.scss',
})
export class WidgetConfigMenuComponent implements OnInit {
  private _widgetConfig!: WidgetConfig;
  @Input()
  set widgetConfig(value: WidgetConfig) {
    this._widgetConfig = value;
    this.initializeConfig();
  }
  get widgetConfig(): WidgetConfig {
    return this._widgetConfig;
  }
  @Output() sizeChange = new EventEmitter<{
    widgetId: string;
    gridColumnStart: number;
    gridColumnEnd: number;
    gridRowStart: number;
    gridRowEnd: number;
  }>();

  config: {
    gridColumnStart: number;
    gridColumnEnd: number;
    gridRowStart: number;
    gridRowEnd: number;
  } = {
    gridColumnStart: 1,
    gridColumnEnd: 5,
    gridRowStart: 1,
    gridRowEnd: 2,
  };

  presetSizes = [
    { name: 'Small', cols: 3, rows: 1 },
    { name: 'Medium', cols: 6, rows: 2 },
    { name: 'Large', cols: 12, rows: 3 },
  ];

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.initializeConfig();
  }

  private initializeConfig(): void {
    if (this._widgetConfig) {
      this.config = {
        gridColumnStart: this._widgetConfig.gridColumnStart,
        gridColumnEnd: this._widgetConfig.gridColumnEnd,
        gridRowStart: this._widgetConfig.gridRowStart,
        gridRowEnd: this._widgetConfig.gridRowEnd,
      };
    }
  }

  applyPresetSize(size: { name: string; cols: number; rows: number }): void {
    const startCol = this.config.gridColumnStart;
    this.config.gridColumnEnd = startCol + size.cols;
    this.config.gridRowEnd = this.config.gridRowStart + size.rows;
  }

  save(): void {
    if (this.widgetConfig) {
      this.sizeChange.emit({
        widgetId: this.widgetConfig.id,
        gridColumnStart: this.config.gridColumnStart,
        gridColumnEnd: this.config.gridColumnEnd,
        gridRowStart: this.config.gridRowStart,
        gridRowEnd: this.config.gridRowEnd,
      });
      this.activeModal.close('save');
    }
  }

  cancel(): void {
    this.activeModal.dismiss('cancel');
  }

  get columnSpan(): number {
    return this.config.gridColumnEnd - this.config.gridColumnStart;
  }

  get rowSpan(): number {
    return this.config.gridRowEnd - this.config.gridRowStart;
  }
}
