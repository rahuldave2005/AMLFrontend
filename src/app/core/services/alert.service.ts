import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertDashboardDto, AlertDetailDto } from '../models/alert.models';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/api/alerts';

  getAlertDashboard(): Observable<AlertDashboardDto> {
    return this.http.get<AlertDashboardDto>(this.apiBaseUrl);
  }

  getAlertDetail(alertNumber: string): Observable<AlertDetailDto> {
    return this.http.get<AlertDetailDto>(`${this.apiBaseUrl}/${alertNumber}`);
  }
}
