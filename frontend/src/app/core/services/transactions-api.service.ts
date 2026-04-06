import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/api.models';

export interface TransactionsPayload {
  balance: number;
  transactions: Transaction[];
}

@Injectable({ providedIn: 'root' })
export class TransactionsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5079/api';

  getTransactions(): Observable<TransactionsPayload> {
    return this.http.get<TransactionsPayload>(`${this.baseUrl}/transactions`);
  }
}
