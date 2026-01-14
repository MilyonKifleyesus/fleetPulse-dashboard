import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  RouterOutlet,
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { App_Route } from './app.routes';
import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ToastrModule } from 'ngx-toastr';
// import { NgDragDropModule } from 'ng-drag-drop';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgSelectModule } from '@ng-select/ng-select';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

// Helper function to check if Firebase config is valid
function isFirebaseConfigValid(config: any): boolean {
  if (!config) return false;
  const apiKey = config.apiKey || '';
  // Check if apiKey contains only asterisks (placeholder) or is empty
  return apiKey.length > 0 && !apiKey.match(/^\*+$/);
}

// Prepare providers array
const providers: any[] = [
  provideRouter(App_Route, withComponentInputBinding()),
  RouterOutlet,
  ColorPickerModule,
  ColorPickerService,
  provideAnimations(),
  provideCharts(withDefaultRegisterables()),
];

// Import providers
const importProviders: any[] = [
  NgSelectModule,
  ToastrModule.forRoot({
    timeOut: 15000, // 15 seconds
    closeButton: true,
    progressBar: true,
  }),
  CalendarModule.forRoot({
    provide: DateAdapter,
    useFactory: adapterFactory,
  }),
  NgCircleProgressModule.forRoot(),
];

// Only initialize Firebase if config is valid
if (isFirebaseConfigValid(environment.firebase)) {
  try {
    importProviders.push(
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireDatabaseModule,
      AngularFirestoreModule,
      AngularFireAuthModule
    );
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
}

providers.push(importProvidersFrom(...importProviders));

export const appConfig: ApplicationConfig = {
  providers: providers,
};
