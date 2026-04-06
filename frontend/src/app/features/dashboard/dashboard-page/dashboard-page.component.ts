import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionsTableComponent } from '../transactions-table/transactions-table.component';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [TransactionsTableComponent],
  template: `
    <main class="dashboard-grid" data-testid="dashboard-page">
      <app-transactions-table></app-transactions-table>

      <section class="card action-card">
        <p>{{ languageService.t('sendMoneyTitle') }}</p>
        <h2>{{ languageService.t('sendMoney') }}</h2>
        <button type="button" class="primary-button" (click)="router.navigateByUrl('/transfer')" data-testid="send-money-button">
          {{ languageService.t('sendMoney') }}
        </button>
      </section>
    </main>
  `
})
export class DashboardPageComponent {
  readonly languageService = inject(LanguageService);
  readonly router = inject(Router);
}
