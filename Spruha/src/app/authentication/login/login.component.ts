import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from '../../shared/services/firebase.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
  ],

  providers: [
    FirebaseService,
    { provide: ToastrService, useClass: ToastrService },
  ],

  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public showPassword = false;
  disabled = '';
  active: any = 'Angular';
  showLoader: boolean | undefined;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer,
    public authservice: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private firebaseService: FirebaseService,
    private toastr: ToastrService
  ) {
    // #region agent log
    try {
      fetch(
        'http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'login.component.ts:52',
            message: 'LoginComponent constructor entry',
            data: { timestamp: Date.now() },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'B',
          }),
        }
      ).catch(() => {});
    } catch (e) {
      fetch(
        'http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'login.component.ts:54',
            message: 'LoginComponent constructor error',
            data: { error: String(e) },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'B',
          }),
        }
      ).catch(() => {});
    }
    // #endregion
    // AngularFireModule.initializeApp(environment.firebase);

    const bodyElement = this.renderer.selectRootElement('body', true);
    //  this.renderer.setAttribute(bodyElement, 'class', 'cover1 justify-center');
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'login.component.ts:66',
        message: 'LoginComponent constructor exit',
        data: { timestamp: Date.now() },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'B',
      }),
    }).catch(() => {});
    // #endregion
  }
  firestoreModule: any;
  databaseModule: any;
  authModule: any;
  ngOnInit(): void {
    // #region agent log
    try {
      fetch(
        'http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'login.component.ts:81',
            message: 'LoginComponent ngOnInit entry',
            data: { timestamp: Date.now() },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'C',
          }),
        }
      ).catch(() => {});
    } catch (e) {
      fetch(
        'http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'login.component.ts:84',
            message: 'LoginComponent ngOnInit error before body class',
            data: { error: String(e) },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'C',
          }),
        }
      ).catch(() => {});
    }
    // #endregion
    this.renderer.addClass(this.document.body, 'error-1');
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'login.component.ts:88',
        message: 'LoginComponent body class added',
        data: { bodyClass: this.document.body.className },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'D',
      }),
    }).catch(() => {});
    // #endregion
    this.loginForm = this.formBuilder.group({
      username: ['spruko@admin.com', [Validators.required, Validators.email]],
      password: ['sprukoadmin', Validators.required],
    });
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'login.component.ts:94',
        message: 'LoginComponent form created',
        data: { formValid: this.loginForm.valid },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'C',
      }),
    }).catch(() => {});
    // #endregion

    // Only get Firebase modules if Firebase is available
    if (this.firebaseService.isAvailable) {
      this.firestoreModule = this.firebaseService.getFirestore();
      this.databaseModule = this.firebaseService.getDatabase();
      this.authModule = this.firebaseService.getAuth();
    }
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/b583ef41-624a-4a56-97fc-ebec34670cf1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'login.component.ts:103',
        message: 'LoginComponent ngOnInit exit',
        data: { timestamp: Date.now() },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'C',
      }),
    }).catch(() => {});
    // #endregion
  }
  // firebase
  email = 'spruko@admin.com';
  password = 'sprukoadmin';
  errorMessage = ''; // validation _error handle
  _error: { name: string; message: string } = { name: '', message: '' }; // for firbase _error handle

  clearErrorMessage() {
    this.errorMessage = '';
    this._error = { name: '', message: '' };
  }

  login() {
    console.log(this.loginForm);

    // this.disabled = "btn-loading"
    this.clearErrorMessage();
    if (this.validateForm(this.email, this.password)) {
      this.authservice
        .loginWithEmail(this.email, this.password)
        .then(() => {
          this.router.navigate(['/dashboard']);
          console.clear();
          this.toastr.success('login successful', 'spruha', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        })
        .catch((_error: any) => {
          this._error = _error;
          this.router.navigate(['/']);
        });
    } else {
      this.toastr.error('Invalid details', 'spruha', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
      });
    }
  }

  validateForm(email: string, password: string) {
    if (email.length === 0) {
      this.errorMessage = 'please enter email id';
      return false;
    }

    if (password.length === 0) {
      this.errorMessage = 'please enter password';
      return false;
    }

    if (password.length < 6) {
      this.errorMessage = 'password should be at least 6 char';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  //angular
  public loginForm!: FormGroup;
  public error: any = '';

  get form() {
    return this.loginForm.controls;
  }

  Submit() {
    console.log(this.loginForm);
    if (
      this.loginForm.controls['username'].value === 'spruko@admin.com' &&
      this.loginForm.controls['password'].value === 'sprukoadmin'
    ) {
      this.router.navigate(['/dashboard']);
      this.toastr.success('login successful', 'spruha', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
      });
    } else {
      this.toastr.error('Invalid details', 'spruha', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
      });
    }
  }

  public togglePassword() {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy(): void {
    const bodyElement = this.renderer.selectRootElement('body', true);
    this.renderer.removeAttribute(bodyElement, 'class');
  }

  toggleClass = 'off-line';
  toggleVisibility() {
    this.showPassword = !this.showPassword;
    if (this.toggleClass === 'off-line') {
      this.toggleClass = 'line';
    } else {
      this.toggleClass = 'off-line';
    }
  }
}
