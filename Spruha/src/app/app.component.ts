import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  Router,
  NavigationStart,
  NavigationEnd,
} from '@angular/router';
import { AppStateService } from './shared/services/app-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'spruha';
  constructor(private appState: AppStateService, private router: Router) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'app.component.ts:16',
        message: 'AppComponent constructor entry',
        data: { timestamp: Date.now() },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'A',
      }),
    }).catch(() => {});
    // #endregion
    this.appState.updateState();
    // #region agent log
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        fetch(
          'http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: 'app.component.ts:21',
              message: 'NavigationStart event',
              data: { url: event.url },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'A',
            }),
          }
        ).catch(() => {});
      }
      if (event instanceof NavigationEnd) {
        fetch(
          'http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: 'app.component.ts:24',
              message: 'NavigationEnd event',
              data: {
                url: event.url,
                urlAfterRedirects: event.urlAfterRedirects,
              },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'A',
            }),
          }
        ).catch(() => {});
      }
    });
    fetch('http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'app.component.ts:28',
        message: 'AppComponent constructor exit',
        data: { timestamp: Date.now() },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'A',
      }),
    }).catch(() => {});
    // #endregion
  }
}
