import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy, signal, computed, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartType } from 'chart.js';

import { SpkChartjs2Component } from '../../../@spk/reusable-charts/spk-chartjs2/spk-chartjs2.component';

import { CATEGORIES, FacilityConfig, FacilityId, CategoryId, } from '../../../data/fleet-store';
import { FleetService } from '../../../data/fleet.service';
import { EditableFacilityInfo, } from '../../../data/facility-meta-store';
import { FacilityMetaService } from '../../../data/facility-meta.service';

// same union as in vehicle-management
type SelectedId = FacilityId | '__ALL__';
type EditableFieldKey = keyof EditableFacilityInfo;

// ---- status breakdown types (for chart rows) ----
type StatusLabel = (typeof CATEGORIES)[number]['label'];
type StatusSegment = { label: StatusLabel; pct: number };

@Component({
  selector: 'app-facility-strips',
  standalone: true,
  imports: [CommonModule, FormsModule, SpkChartjs2Component],
  templateUrl: './facility-strips.component.html',
  styleUrl: './facility-strips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacilityStripsComponent {
  @Input({ required: true }) facilities: readonly FacilityConfig[] = [];
  @Input({ required: true }) selectedFacilityId!: SelectedId;
  @Input({ required: true }) allFacilitiesId!: SelectedId;

  readonly categories = CATEGORIES;

  // which field is currently in "edit" mode
  editing: { facilityId: FacilityId; field: EditableFieldKey } | null = null;

  // ---- Chart data caching per facility ----
  private busModelChartCache = new Map<FacilityId, ChartConfiguration['data']>();
  private statusChartCache = new Map<FacilityId, ChartConfiguration['data']>();
  private lastBusModelBreakdown = new Map<FacilityId, string>();
  private lastStatusBreakdown = new Map<FacilityId, string>();
  
  // Track when to clear cache
  private boardUpdateCounter = 0;

  // ---- chart config for the doughnut charts ----
  readonly doughnutType: ChartType = 'doughnut';

  readonly doughnutOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.6,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        color: '#ffffff',
        anchor: 'center',
        align: 'center',
        clamp: true,
        clip: false,
        formatter: (value: number | string, ctx: any) => {
          const labels = ctx.chart.data.labels as string[] | undefined;
          const label = labels ? labels[ctx.dataIndex] : '';
          return `${label}\n${value}%`;
        },
        font: (_ctx: any) => ({
          size: 9,
          weight: 'bold',
        }),
      } as any,
    } as any,
  };

  private readonly chartColors = [
    '#6259ca',
    '#53caed',
    '#01b8ff',
    '#f16d75',
    '#29ccbb',
    '#19b159',
  ];

  private readonly statusColorByLabel: Record<StatusLabel, string> =
    CATEGORIES.reduce((acc, cat) => {
      acc[cat.label as StatusLabel] = cat.color;
      return acc;
    }, {} as Record<StatusLabel, string>);

  private readonly statusColorById: Record<CategoryId, string> =
    CATEGORIES.reduce((acc, cat) => {
      acc[cat.id] = cat.color;
      return acc;
    }, {} as Record<CategoryId, string>);

  // still OK to keep model colors here (they do not live in fleet-store)
  private readonly modelColorMap: Record<string, string> = {
    '40ft Diesel': '#6259ca',
    '60ft Diesel': '#53caed',
    '40ft Electric': '#01b8ff',
    'Other': '#f16d75',
  };

  constructor(
    private fleet: FleetService,
    private facilityMeta: FacilityMetaService,
    private cdr: ChangeDetectorRef
  ) {}

  /** Public method for parent component to call when board data changes */
  onBoardDataChanged(): void {
    // Clear cache when board data changes
    this.busModelChartCache.clear();
    this.statusChartCache.clear();
    this.lastBusModelBreakdown.clear();
    this.lastStatusBreakdown.clear();
    // Trigger change detection so templates re-evaluate
    this.cdr.markForCheck();
  }

  get isAllView(): boolean {
    return this.selectedFacilityId === this.allFacilitiesId;
  }

  get facilitiesToShow(): readonly FacilityConfig[] {
    if (this.isAllView) return this.facilities;
    const fac = this.facilities.find((f) => f.id === this.selectedFacilityId);
    return fac ? [fac] : [];
  }

  getInfo(fid: FacilityId): EditableFacilityInfo {
    return this.facilityMeta.getEditableInfo(fid);
  }

  // ---- non-editable calculated metrics ----

  vehiclesAssigned(fid: FacilityId): number {
    const board = this.fleet.getBoard(fid);
    return this.categories.reduce(
      (sum, c) => sum + board[c.id].length,
      0
    );
  }

  percentElectric(fid: FacilityId): number {
    return this.facilityMeta.getEvShare(fid);
  }

  statusBreakdown(fid: FacilityId): StatusSegment[] {
    const board = this.fleet.getBoard(fid);
    const total = this.vehiclesAssigned(fid);
    if (!total) return [];

    const rows: (StatusSegment | null)[] = this.categories.map((c) => {
      const count = board[c.id].length;
      if (!count) return null;
      const pct = Math.round((count / total) * 100);
      return { label: c.label as StatusLabel, pct };
    });

    return rows.filter((x): x is StatusSegment => x !== null);
  }

  dummyModelBreakdown(fid: FacilityId) {
    return this.facilityMeta.getModelBreakdown(fid);
  }

  // ---- chart data builders ----

  // Bus Models doughnut - MEMOIZED to prevent unnecessary re-renders
  busModelChartData(fid: FacilityId): ChartConfiguration['data'] {
    const breakdown = this.dummyModelBreakdown(fid);
    const breakdownHash = JSON.stringify(breakdown);
    
    // Return cached data if breakdown hasn't changed
    if (this.lastBusModelBreakdown.get(fid) === breakdownHash && this.busModelChartCache.has(fid)) {
      return this.busModelChartCache.get(fid)!;
    }

    const chartData: ChartConfiguration['data'] = {
      labels: breakdown.map((m) => m.label),
      datasets: [
        {
          data: breakdown.map((m) => m.pct),
          backgroundColor: breakdown.map((m, idx) =>
            this.modelColorMap[m.label] ??
            this.chartColors[idx % this.chartColors.length]
          ),
          borderWidth: 0,
        },
      ],
    };

    // Cache the result
    this.busModelChartCache.set(fid, chartData);
    this.lastBusModelBreakdown.set(fid, breakdownHash);
    
    return chartData;
  }

  // Status of Buses doughnut - MEMOIZED to prevent unnecessary re-renders
  statusChartData(fid: FacilityId): ChartConfiguration['data'] {
    const breakdown = this.statusBreakdown(fid);
    const breakdownHash = JSON.stringify(breakdown);
    
    // Return cached data if breakdown hasn't changed
    if (this.lastStatusBreakdown.get(fid) === breakdownHash && this.statusChartCache.has(fid)) {
      return this.statusChartCache.get(fid)!;
    }

    const chartData: ChartConfiguration['data'] = {
      labels: breakdown.map((s) => s.label),
      datasets: [
        {
          data: breakdown.map((s) => s.pct),
          backgroundColor: breakdown.map((s, idx) =>
            this.statusColorByLabel[s.label] ??
            this.chartColors[idx % this.chartColors.length]
          ),
          borderWidth: 0,
        },
      ],
    };

    // Cache the result
    this.statusChartCache.set(fid, chartData);
    this.lastStatusBreakdown.set(fid, breakdownHash);
    
    return chartData;
  }

  // ---- editing helpers ----

  isEditing(fid: FacilityId, field: EditableFieldKey): boolean {
    return (
      this.editing?.facilityId === fid &&
      this.editing?.field === field
    );
  }

  toggleEdit(fid: FacilityId, field: EditableFieldKey) {
    if (this.isEditing(fid, field)) {
      this.editing = null;
    } else {
      this.editing = { facilityId: fid, field };
    }
  }

  trackByFacilityId = (_: number, f: FacilityConfig) => f.id;
  trackByStatusLabel = (_: number, s: { label: string }) => s.label;
}
