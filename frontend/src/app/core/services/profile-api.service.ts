import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5079/api';

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseUrl}/profile`);
  }
}
