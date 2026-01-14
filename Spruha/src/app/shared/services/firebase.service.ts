import { Injectable } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../../../environments/environment';

// Helper function to check if Firebase config is valid
function isFirebaseConfigValid(config: any): boolean {
  if (!config) return false;
  const apiKey = config.apiKey || '';
  // Check if apiKey contains only asterisks (placeholder) or is empty
  return apiKey.length > 0 && !apiKey.match(/^\*+$/);
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private isFirebaseAvailable = false;

  constructor() {
    if (isFirebaseConfigValid(environment.firebase)) {
      try {
        AngularFireModule.initializeApp(environment.firebase);
        this.isFirebaseAvailable = true;
      } catch (error) {
        console.warn('Firebase initialization failed:', error);
        this.isFirebaseAvailable = false;
      }
    } else {
      console.warn('Firebase configuration is not valid. Firebase features will be disabled.');
      this.isFirebaseAvailable = false;
    }
  }

  getFirestore() {
    return this.isFirebaseAvailable ? AngularFirestoreModule : null;
  }

  getDatabase() {
    return this.isFirebaseAvailable ? AngularFireDatabaseModule : null;
  }

  getAuth() {
    return this.isFirebaseAvailable ? AngularFireAuthModule : null;
  }

  get isAvailable(): boolean {
    return this.isFirebaseAvailable;
  }
}
