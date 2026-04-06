import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5079/api';

  login(email: string, password: string): Observable<SessionResponse> {
    return this.http.post<SessionResponse>(`${this.baseUrl}/auth/login`, { email, password });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/auth/logout`, {});
  }

  me(): Observable<SessionResponse> {
    return this.http.get<SessionResponse>(`${this.baseUrl}/auth/me`);
  }

  reset(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/dev/reset`, {});
  }
}
