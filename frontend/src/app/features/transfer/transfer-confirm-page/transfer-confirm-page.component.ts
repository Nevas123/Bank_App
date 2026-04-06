import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SlideToConfirmComponent } from '../slide-to-confirm/slide-to-confirm.component';
import { LanguageService } from '../../../core/services/language.service';
import { SessionStore } from '../../../core/stores/session.store';
import { TransferApiService } from '../../../core/services/transfer-api.service';

@Component({
  selector: 'app-transfer-confirm-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, SlideToConfirmComponent],
  template: `
    <main class="content-card transfer-flow" data-testid="transfer-confirm-page">
      <ng-container *ngIf="draft; else missingDraft">
        <ng-container *ngIf="!completed(); else successState">
          <div class="section-header">
            <div>
              <p class="eyebrow">{{ languageService.t('sendMoney') }}</p>
              <h1 data-testid="confirmation-title">{{ languageService.t('confirmationTitle') }}</h1>
              <p>{{ languageService.t('confirmationSubtitle') }}</p>
            </div>
          </div>

          <section class="summary-grid" data-testid="transfer-summary">
            <div class="summary-item">
              <span>{{ languageService.t('recipientName') }}</span>
              <strong>{{ draft.recipientName }}</strong>
            </div>
            <div class="summary-item">
              <span>{{ languageService.t('accountNumber') }}</span>
              <strong>{{ draft.accountNumber }}</strong>
            </div>
            <div class="summary-item">
              <span>{{ languageService.t('amount') }}</span>
              <strong>{{ numericAmount | currency:'EUR':'symbol':'1.2-2':'en' }}</strong>
            </div>
          </section>

          <p class="field-error" *ngIf="submitError()">{{ submitError() }}</p>
          <app-slide-to-confirm [disabled]="submitting() || completed()" (confirmed)="confirmTransfer()"></app-slide-to-confirm>
        </ng-container>
      </ng-container>

      <ng-template #successState>
        <section class="success-state" data-testid="transfer-success-state">
          <p class="success-kicker">{{ languageService.t('sendMoney') }}</p>
          <h1>{{ languageService.t('transferCompleted') }}</h1>
          <p>{{ languageService.t('transferSuccessBody') }}</p>
          <button type="button" class="primary-button" (click)="goBack()" data-testid="back-to-dashboard-button">
            {{ languageService.t('backToMainMenu') }}
          </button>
        </section>
      </ng-template>

      <ng-template #missingDraft>
        <section class="success-state">
          <h1>{{ languageService.t('sendMoneyTitle') }}</h1>
          <p>{{ languageService.t('sendMoneySubtitle') }}</p>
          <button type="button" class="primary-button" (click)="router.navigateByUrl('/transfer')">
            {{ languageService.t('sendMoney') }}
          </button>
        </section>
      </ng-template>
    </main>
  `
})
export class TransferConfirmPageComponent {
  readonly router = inject(Router);
  readonly languageService = inject(LanguageService);
  readonly sessionStore = inject(SessionStore);
  readonly transferApi = inject(TransferApiService);

  readonly submitting = signal(false);
  readonly completed = signal(false);
  readonly submitError = signal('');

  get draft() {
    return this.sessionStore.pendingTransfer();
  }

  get numericAmount(): number {
    return Number(this.draft?.amount ?? 0);
  }

  confirmTransfer(): void {
    const draft = this.draft;
    if (!draft || this.completed() || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.submitError.set('');

    this.transferApi.submitTransfer(draft).subscribe({
      next: (result) => {
        if (!result.alreadyProcessed) {
          this.sessionStore.applyTransferResult(result);
        }

        this.completed.set(true);
        this.submitting.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.submitError.set(error.status === 409 ? 'Transfer already processed.' : 'Transfer could not be completed.');
        this.submitting.set(false);
      }
    });
  }

  goBack(): void {
    this.sessionStore.clearPendingTransfer();
    this.router.navigateByUrl('/dashboard');
  }
}
