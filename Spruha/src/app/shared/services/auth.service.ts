import { Injectable, NgZone, Optional } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authState: any;
  afAuth: any;
  afs: any;
  public showLoader: boolean = false;
  private isFirebaseAvailable = false;

  constructor(
    @Optional() private afu: AngularFireAuth | null,
    private router: Router,
    public ngZone: NgZone
  ) {
    if (this.afu) {
      this.isFirebaseAvailable = true;
      this.afAuth = this.afu; // Set afAuth to afu for backward compatibility
      this.afu.authState.subscribe((auth: any) => {
        this.authState = auth;
      });
    } else {
      console.warn(
        'AngularFireAuth is not available. Firebase authentication features will be disabled.'
      );
      this.isFirebaseAvailable = false;
      this.afAuth = null;
    }
  }

  // all firebase getdata functions

  get isUserAnonymousLoggedIn(): boolean {
    return this.authState !== null ? this.authState.isAnonymous : false;
  }

  get currentUserId(): string {
    return this.authState !== null ? this.authState.uid : '';
  }

  get currentUserName(): string {
    return this.authState['email'];
  }

  get currentUser(): any {
    return this.authState !== null ? this.authState : null;
  }

  get isUserEmailLoggedIn(): boolean {
    if (this.authState !== null && !this.isUserAnonymousLoggedIn) {
      return true;
    } else {
      return false;
    }
  }

  registerWithEmail(email: string, password: string) {
    if (!this.isFirebaseAvailable || !this.afu) {
      return Promise.reject(
        new Error(
          'Firebase is not configured. Please configure Firebase to use this feature.'
        )
      );
    }
    return this.afu['createUserWithEmailAndPassword'](email, password)
      .then((user: any) => {
        this.authState = user;
      })
      .catch((_error: any) => {
        console.log(_error);
        throw _error;
      });
  }

  loginWithEmail(email: string, password: string) {
    if (!this.isFirebaseAvailable || !this.afu) {
      return Promise.reject(
        new Error(
          'Firebase is not configured. Please use the standard login form.'
        )
      );
    }
    return this.afu['signInWithEmailAndPassword'](email, password)
      .then((user: any) => {
        this.authState = user;
      })
      .catch((_error: any) => {
        console.log(_error);
        throw _error;
      });
  }

  singout(): void {
    // this.afu.signOut();
    this.router.navigate(['/login']);
  }

  // Sign up with email/password
  SignUp(email: any, password: any) {
    if (!this.isFirebaseAvailable || !this.afu) {
      return Promise.reject(
        new Error(
          'Firebase is not configured. Please configure Firebase to use this feature.'
        )
      );
    }
    return this.afu
      .createUserWithEmailAndPassword(email, password)
      .then((result: any) => {
        /* Call the SendVerificaitonMail() function when new user sign
          up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user);
      })
      .catch((error: any) => {
        window.alert(error.message);
      });
  }

  // main verification function
  SendVerificationMail() {
    if (!this.isFirebaseAvailable || !this.afu) {
      return Promise.reject(new Error('Firebase is not configured.'));
    }
    return this.afu.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['/dashboard']);
      });
  }
  // Set user
  SetUserData(user: any) {
    if (!this.isFirebaseAvailable || !this.afs) {
      console.warn('Firestore is not available. Cannot set user data.');
      return Promise.resolve();
    }
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      email: user.email,
      displayName: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL || 'src/favicon.ico',
      emailVerified: user.emailVerified,
    };
    userRef
      .delete()
      .then(function () {})
      .catch(function (error: any) {});
    return userRef.set(userData, {
      merge: true,
    });
  }
  // sign in function
  SignIn(email: any, password: any) {
    if (!this.isFirebaseAvailable || !this.afu) {
      return Promise.reject(
        new Error(
          'Firebase is not configured. Please use the standard login form.'
        )
      );
    }
    return this.afu
      .signInWithEmailAndPassword(email, password)
      .then((result: any) => {
        if (result.user.emailVerified !== true) {
          this.SetUserData(result.user);
          this.SendVerificationMail();
          this.showLoader = true;
        } else {
          this.showLoader = false;
          this.ngZone.run(() => {
            this.router.navigate(['/auth/login']);
          });
        }
      })
      .catch((error: any) => {
        throw error;
      });
  }
  ForgotPassword(passwordResetEmail: any) {
    if (!this.isFirebaseAvailable || !this.afu) {
      return Promise.reject(
        new Error(
          'Firebase is not configured. Please configure Firebase to use this feature.'
        )
      );
    }
    return this.afu
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error: any) => {
        window.alert(error);
      });
  }
}
