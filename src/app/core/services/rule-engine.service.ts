import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RuleEngineService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/api/v1';

  runEngine(): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/run-engine`, {}, { responseType: 'text' });
  }
}
