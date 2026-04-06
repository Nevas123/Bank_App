import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { SessionStore } from '../../../core/stores/session.store';
import { TransferDraft } from '../../../core/models/api.models';

function numericOnlyNameValidator(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value ?? '').trim();
  if (!value) {
    return null;
  }

  return /^\d+$/.test(value) ? { numericOnly: true } : null;
}

function amountValidator(balance: () => number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();
    if (!value) {
      return null;
    }

    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      return { invalidNumber: true };
    }

    if (parsed <= 0) {
      return { nonPositive: true };
    }

    return parsed > balance() ? { exceedsBalance: true } : null;
  };
}

@Component({
  selector: 'app-transfer-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <main class="content-card transfer-flow" data-testid="transfer-form-page">
      <div class="section-header">
        <div>
          <p class="eyebrow">{{ languageService.t('sendMoney') }}</p>
          <h1>{{ languageService.t('sendMoneyTitle') }}</h1>
          <p>{{ languageService.t('sendMoneySubtitle') }}</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="continue()" class="transfer-form">
        <label>
          <span>{{ languageService.t('recipientName') }}</span>
          <input type="text" formControlName="recipientName" data-testid="recipient-name-input">
          <small class="field-error" *ngIf="showError('recipientName')">{{ errorMessage('recipientName') }}</small>
        </label>

        <label>
          <span>{{ languageService.t('accountNumber') }}</span>
          <input type="text" formControlName="accountNumber" data-testid="account-number-input">
          <small class="field-error" *ngIf="showError('accountNumber')">{{ errorMessage('accountNumber') }}</small>
        </label>

        <label>
          <span>{{ languageService.t('amount') }}</span>
          <input type="text" formControlName="amount" inputmode="decimal" data-testid="amount-input">
          <small class="field-error" *ngIf="showError('amount')">{{ errorMessage('amount') }}</small>
        </label>

        <div class="form-actions">
          <button type="button" class="secondary-button" (click)="cancel()" data-testid="cancel-transfer-button">
            {{ languageService.t('cancel') }}
          </button>
          <button type="submit" class="primary-button" data-testid="continue-transfer-button">
            {{ languageService.t('continue') }}
          </button>
        </div>
      </form>
    </main>
  `
})
export class TransferFormPageComponent {
  readonly router = inject(Router);
  readonly languageService = inject(LanguageService);
  readonly sessionStore = inject(SessionStore);

  readonly form = new FormGroup({
    recipientName: new FormControl('', { nonNullable: true, validators: [Validators.required, numericOnlyNameValidator] }),
    accountNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    amount: new FormControl('', { nonNullable: true, validators: [Validators.required, amountValidator(() => this.sessionStore.balance())] })
  });

  constructor() {
    const draft = this.sessionStore.pendingTransfer();
    if (draft) {
      this.form.patchValue(draft);
    }

    this.form.valueChanges.subscribe((value) => {
      this.sessionStore.setPendingTransfer({
        draftId: this.sessionStore.pendingTransfer()?.draftId ?? this.createDraftId(),
        recipientName: value.recipientName ?? '',
        accountNumber: value.accountNumber ?? '',
        amount: value.amount ?? ''
      });
    });
  }

  continue(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const draft = this.toDraft();
    this.sessionStore.setPendingTransfer(draft);
    this.router.navigateByUrl('/transfer/confirm');
  }

  cancel(): void {
    this.sessionStore.clearPendingTransfer();
    this.router.navigateByUrl('/dashboard');
  }

  showError(controlName: 'recipientName' | 'accountNumber' | 'amount'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  errorMessage(controlName: 'recipientName' | 'accountNumber' | 'amount'): string {
    const control = this.form.controls[controlName];

    if (control.hasError('required')) {
      return controlName === 'recipientName'
        ? this.languageService.t('validationRecipientRequired')
        : controlName === 'accountNumber'
          ? this.languageService.t('validationAccountRequired')
          : this.languageService.t('validationAmountRequired');
    }

    if (control.hasError('numericOnly')) {
      return this.languageService.t('validationRecipientNumeric');
    }

    if (control.hasError('invalidNumber')) {
      return this.languageService.t('validationAmountNumeric');
    }

    if (control.hasError('nonPositive')) {
      return this.languageService.t('validationAmountPositive');
    }

    if (control.hasError('exceedsBalance')) {
      return this.languageService.t('validationAmountBalance');
    }

    return '';
  }

  private toDraft(): TransferDraft {
    const current = this.sessionStore.pendingTransfer();
    return {
      draftId: current?.draftId ?? this.createDraftId(),
      recipientName: this.form.controls.recipientName.value.trim(),
      accountNumber: this.form.controls.accountNumber.value.trim(),
      amount: this.form.controls.amount.value.trim()
    };
  }

  private createDraftId(): string {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `draft-${Date.now()}`;
  }
}
