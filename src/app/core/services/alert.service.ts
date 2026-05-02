import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AlertDashboardDto, AlertDetailDto, AlertStatus, CustomSliceDto, GeneratedAlertDto } from '../models/alert.models';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/api/v1/alerts';

  getAlertDashboard(
    status?: AlertStatus | null, 
    alertNumber?: string, 
    page: number = 0, 
    size: number = 10
  ): Observable<CustomSliceDto<GeneratedAlertDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (status) {
      params = params.set('alertStatus', status);
    }
    if (alertNumber && alertNumber.trim()) {
      params = params.set('alertNumber', alertNumber.trim());
    }

    return this.http.get<CustomSliceDto<GeneratedAlertDto>>(this.apiBaseUrl, { params });
  }

  getAlertDetail(alertNumber: string): Observable<AlertDetailDto> {
    return this.http.get<AlertDetailDto>(`${this.apiBaseUrl}/${alertNumber}`);
  }
}
