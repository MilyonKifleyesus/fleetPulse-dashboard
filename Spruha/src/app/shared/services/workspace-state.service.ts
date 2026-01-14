import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { WorkspaceState, WidgetFrame, WorkspaceLayout } from '../models/workspace.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceStateService {
  private readonly localStorageKeyPrefix = 'fleetpulse-workspace';
  private readonly defaultVersion = '1.0.0';
  private readonly saveDebounceTime = 300; // ms

  private stateSubject = new BehaviorSubject<WorkspaceState | null>(null);
  public state$: Observable<WorkspaceState | null> = this.stateSubject.asObservable();

  private saveSubject = new BehaviorSubject<WorkspaceState | null>(null);

  constructor() {
    // Debounce saves to prevent excessive localStorage writes
    this.saveSubject.pipe(
      debounceTime(this.saveDebounceTime)
    ).subscribe(state => {
      if (state) {
        this.saveToLocalStorage(state);
      }
    });
  }

  /**
   * Save workspace state to localStorage with user-specific namespacing
   */
  saveWorkspaceState(state: WorkspaceState): void {
    state.lastModified = new Date().toISOString();
    this.stateSubject.next(state);
    this.saveSubject.next(state);
  }

  /**
   * Load workspace state from localStorage
   */
  loadWorkspaceState(workspaceId: string, userId?: string): WorkspaceState | null {
    try {
      const key = this.getStorageKey(workspaceId, userId);
      const stored = localStorage.getItem(key);
      
      if (stored) {
        const state = JSON.parse(stored) as WorkspaceState;
        // Convert lastModified string back to Date if needed
        if (typeof state.lastModified === 'string') {
          state.lastModified = new Date(state.lastModified);
        }
        this.stateSubject.next(state);
        return state;
      }
    } catch (error) {
      console.error('Error loading workspace state from localStorage:', error);
    }
    
    return null;
  }

  /**
   * Reset workspace state to default
   */
  resetWorkspaceState(workspaceId: string, userId?: string): void {
    const key = this.getStorageKey(workspaceId, userId);
    localStorage.removeItem(key);
    this.stateSubject.next(null);
  }

  /**
   * Export workspace state as JSON string
   */
  exportWorkspaceState(workspaceId: string, userId?: string): string | null {
    const state = this.loadWorkspaceState(workspaceId, userId);
    if (state) {
      return JSON.stringify(state, null, 2);
    }
    return null;
  }

  /**
   * Import workspace state from JSON string
   */
  importWorkspaceState(json: string, workspaceId: string, userId?: string): WorkspaceState | null {
    try {
      const state = JSON.parse(json) as WorkspaceState;
      state.workspaceId = workspaceId;
      if (userId) {
        state.userId = userId;
      }
      state.version = state.version || this.defaultVersion;
      this.saveWorkspaceState(state);
      return state;
    } catch (error) {
      console.error('Error importing workspace state:', error);
      return null;
    }
  }

  /**
   * Update a single widget in the workspace state
   */
  updateWidget(workspaceId: string, widget: WidgetFrame, userId?: string): void {
    const currentState = this.stateSubject.getValue();
    
    if (!currentState || currentState.workspaceId !== workspaceId) {
      // Load existing state or create new
      const existingState = this.loadWorkspaceState(workspaceId, userId);
      if (!existingState) {
        // Create new state with default layout
        const newState: WorkspaceState = {
          workspaceId,
          userId,
          widgets: [widget],
          layout: this.getDefaultLayout(),
          lastModified: new Date(),
          version: this.defaultVersion,
          isEditMode: false
        };
        this.saveWorkspaceState(newState);
        return;
      }
    }

    const state = currentState || this.loadWorkspaceState(workspaceId, userId);
    if (!state) return;

    const widgetIndex = state.widgets.findIndex(w => w.id === widget.id);
    
    if (widgetIndex >= 0) {
      state.widgets[widgetIndex] = widget;
    } else {
      state.widgets.push(widget);
    }

    // Sort widgets by order
    state.widgets.sort((a, b) => a.order - b.order);
    
    this.saveWorkspaceState(state);
  }

  /**
   * Remove a widget from the workspace state
   */
  removeWidget(workspaceId: string, widgetId: string, userId?: string): void {
    const state = this.stateSubject.getValue() || this.loadWorkspaceState(workspaceId, userId);
    if (!state) return;

    state.widgets = state.widgets.filter(w => w.id !== widgetId);
    this.saveWorkspaceState(state);
  }

  /**
   * Update layout configuration
   */
  updateLayout(workspaceId: string, layout: Partial<WorkspaceLayout>, userId?: string): void {
    const state = this.stateSubject.getValue() || this.loadWorkspaceState(workspaceId, userId);
    if (!state) {
      // Create new state with provided layout
      const newState: WorkspaceState = {
        workspaceId,
        userId,
        widgets: [],
        layout: { ...this.getDefaultLayout(), ...layout },
        lastModified: new Date(),
        version: this.defaultVersion,
        isEditMode: false
      };
      this.saveWorkspaceState(newState);
      return;
    }

    state.layout = { ...state.layout, ...layout };
    this.saveWorkspaceState(state);
  }

  /**
   * Get current state synchronously
   */
  getCurrentState(): WorkspaceState | null {
    return this.stateSubject.getValue();
  }

  /**
   * Get default layout configuration
   */
  private getDefaultLayout(): WorkspaceLayout {
    return {
      columns: 12,
      gap: 16,
      breakpoint: 'desktop',
      minWidgetWidth: 280
    };
  }

  /**
   * Get localStorage key with namespacing
   */
  private getStorageKey(workspaceId: string, userId?: string): string {
    if (userId) {
      return `${this.localStorageKeyPrefix}-${userId}-${workspaceId}`;
    }
    return `${this.localStorageKeyPrefix}-${workspaceId}`;
  }

  /**
   * Save to localStorage
   */
  private saveToLocalStorage(state: WorkspaceState): void {
    try {
      const key = this.getStorageKey(state.workspaceId, state.userId);
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving workspace state to localStorage:', error);
    }
  }
}
