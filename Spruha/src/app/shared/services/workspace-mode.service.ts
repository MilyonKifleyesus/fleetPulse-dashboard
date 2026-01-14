import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type WorkspaceMode = 'view' | 'edit';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceModeService {
  private modeSubject = new BehaviorSubject<WorkspaceMode>('view');
  public mode$: Observable<WorkspaceMode> = this.modeSubject.asObservable();

  constructor() {
    // Listen for keyboard shortcut (Ctrl/Cmd + E)
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
          event.preventDefault();
          this.toggleMode();
        }
      });
    }
  }

  /**
   * Get current mode
   */
  getCurrentMode(): WorkspaceMode {
    return this.modeSubject.getValue();
  }

  /**
   * Set mode
   */
  setMode(mode: WorkspaceMode): void {
    this.modeSubject.next(mode);
  }

  /**
   * Toggle between view and edit mode
   */
  toggleMode(): void {
    const currentMode = this.modeSubject.getValue();
    this.setMode(currentMode === 'view' ? 'edit' : 'view');
  }

  /**
   * Check if in edit mode
   */
  isEditMode(): boolean {
    return this.modeSubject.getValue() === 'edit';
  }

  /**
   * Check if in view mode
   */
  isViewMode(): boolean {
    return this.modeSubject.getValue() === 'view';
  }
}
