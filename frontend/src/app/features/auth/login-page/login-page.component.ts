import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import { SessionStore } from '../../../core/stores/session.store';
import { LanguageSwitcherComponent } from '../../layout/language-switcher/language-switcher.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LanguageSwitcherComponent],
  template: `
    <div class="login-page">
      <header class="login-header">
        <span class="brand-mark">{{ languageService.t('appName') }}</span>
        <app-language-switcher></app-language-switcher>
      </header>

      <main class="login-card" data-testid="login-page">
        <p class="eyebrow">{{ languageService.t('appName') }}</p>
        <h1>{{ languageService.t('loginTitle') }}</h1>
        <p>{{ languageService.t('loginSubtitle') }}</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="login-form">
          <label>
            <span>{{ languageService.t('email') }}</span>
            <input type="email" formControlName="email" data-testid="login-email-input">
          </label>

          <label>
            <span>{{ languageService.t('password') }}</span>
            <input type="password" formControlName="password" data-testid="login-password-input">
          </label>

          <p class="helper-copy">{{ languageService.t('helperCredentials') }}</p>
          <p class="field-error" *ngIf="loginError()" data-testid="login-error">{{ loginError() }}</p>

          <button type="submit" class="primary-button full-width" [disabled]="submitting()" data-testid="sign-in-button">
            {{ languageService.t('signIn') }}
          </button>
        </form>
      </main>
    </div>
  `
})
export class LoginPageComponent {
  readonly authService = inject(AuthService);
  readonly languageService = inject(LanguageService);
  readonly sessionStore = inject(SessionStore);
  readonly router = inject(Router);
  readonly submitting = signal(false);
  readonly loginError = signal('');

  readonly form = new FormGroup({
    email: new FormControl('alex.morgan@appbank.demo', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('Demo123!', { nonNullable: true, validators: [Validators.required] })
  });

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.loginError.set('');

    this.authService.login(this.form.controls.email.value, this.form.controls.password.value).subscribe({
      next: (session) => {
        this.sessionStore.setSessionFromResponse(session);
        this.submitting.set(false);
        this.router.navigateByUrl('/dashboard');
      },
      error: (error: HttpErrorResponse) => {
        this.loginError.set(error.status === 401 ? this.languageService.t('loginError') : 'Unable to sign in right now.');
        this.submitting.set(false);
      }
    });
  }
}
