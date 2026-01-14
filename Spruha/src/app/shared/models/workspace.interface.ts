export type WidgetType = 
  | 'metric-card' 
  | 'chart-widget' 
  | 'table-widget' 
  | 'activity-feed' 
  | 'status-indicator'
  | 'custom';

export interface GridPosition {
  column: number;
  row: number;
  columnSpan: number; // 1-12
  rowSpan: number; // 1-8
}

export interface GridSize {
  width: number; // columns (1-12)
  height: number; // rows (1-8)
}

export interface WidgetFrame {
  id: string;
  type: WidgetType;
  title: string;
  icon?: string;
  position: GridPosition;
  size: GridSize;
  isMinimized: boolean;
  isMaximized: boolean;
  config: Record<string, any>;
  order: number; // For maintaining order in array
}

export interface WorkspaceLayout {
  columns: number;
  gap: number;
  breakpoint: string;
  minWidgetWidth: number;
}

export interface WorkspaceState {
  userId?: string;
  workspaceId: string;
  widgets: WidgetFrame[];
  layout: WorkspaceLayout;
  lastModified: Date | string;
  version: string;
  isEditMode: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}
