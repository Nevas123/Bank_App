import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TransferRequest, TransferResult } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class TransferApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5079/api';

  submitTransfer(payload: TransferRequest): Observable<TransferResult> {
    return this.http.post<TransferResult>(`${this.baseUrl}/transfer`, payload);
  }
}
