import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// #region agent log
console.error('DEBUG: dashboard.routes.ts module file loaded');
// #endregion

export const admin: Routes = [
  // #region agent log
  // Log route configuration load
  // #endregion
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./workspace-dashboard/workspace-dashboard.component').then(
        (m) => m.WorkspaceDashboardComponent
      ),
  },
  {
    path: 'facility-management-dashboard',
    loadComponent: () =>
      import('./facility-dashboard/facility-dashboard.component').then(
        (m) => m.FacilityDashboardComponent
      ),
  },
  {
    path: 'facility-dashboard',
    loadComponent: () => {
      // #region agent log
      console.error(
        '=== DEBUG: Route loadComponent called for facility-dashboard ==='
      );
      // #endregion
      return import('./facility-dashboard/facility-dashboard.component')
        .then((m) => {
          // #region agent log
          console.error('=== DEBUG: Component imported successfully ===', {
            hasComponent: !!m.FacilityDashboardComponent,
          });
          // #endregion
          if (!m.FacilityDashboardComponent) {
            throw new Error('FacilityDashboardComponent not found');
          }
          return m.FacilityDashboardComponent;
        })
        .catch((err) => {
          // #region agent log
          console.error('=== DEBUG: Component import failed ===', err);
          // #endregion
          throw err;
        });
    },
  },
  {
    path: 'facility-operations/:facilityId',
    loadComponent: () =>
      import('./facility-operations/facility-operations.component').then(
        (m) => m.FacilityOperationsComponent
      ),
  },
  {
    path: 'facility-management',
    loadComponent: () => {
      // #region agent log
      console.error(
        'DEBUG: Route loadComponent called for facility-management'
      );
      fetch(
        'http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'dashboard.routes.ts:24',
            message: 'Route loadComponent called for facility-management',
            data: { path: 'facility-management' },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run2',
            hypothesisId: 'A',
          }),
        }
      ).catch((e) => console.error('DEBUG: Log fetch failed', e));
      // #endregion
      return import('./facility-dashboard/facility-dashboard.component')
        .then((m) => {
          // #region agent log
          console.error('DEBUG: Component module loaded', {
            hasComponent: !!m.FacilityDashboardComponent,
          });
          fetch(
            'http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                location: 'dashboard.routes.ts:28',
                message: 'Component module loaded successfully',
                data: {
                  hasComponent: !!m.FacilityDashboardComponent,
                  moduleKeys: Object.keys(m),
                },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run2',
                hypothesisId: 'A',
              }),
            }
          ).catch((e) => console.error('DEBUG: Log fetch failed', e));
          // #endregion
          if (!m.FacilityDashboardComponent) {
            console.error(
              'DEBUG: FacilityDashboardComponent not found in module',
              m
            );
            throw new Error(
              'FacilityDashboardComponent not exported from module'
            );
          }
          return m.FacilityDashboardComponent;
        })
        .catch((err) => {
          // #region agent log
          console.error('DEBUG: Component load failed', err);
          fetch(
            'http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                location: 'dashboard.routes.ts:32',
                message: 'Component load failed',
                data: {
                  error: err.message,
                  stack: err.stack,
                  name: err.name,
                },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run2',
                hypothesisId: 'A',
              }),
            }
          ).catch((e) => console.error('DEBUG: Log fetch failed', e));
          // #endregion
          throw err;
        });
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(admin)],
  exports: [RouterModule],
})
export class dashboardRoutingModule {
  static routes = admin;
}
