import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BankRegisterDto, TenantDashboardDto, TenantDetailsDto } from '../models/tenant.models';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/api/v1';

  getAllTenants(): Observable<TenantDashboardDto> {
    return this.http.get<TenantDashboardDto>(`${this.apiBaseUrl}/tenants`);
  }

  getTenantByBankName(bankName: string): Observable<TenantDetailsDto> {
    return this.http.get<TenantDetailsDto>(`${this.apiBaseUrl}/tenants/${bankName}`);
  }

  registerBank(payload: BankRegisterDto): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/auth/banks/register`, payload, { responseType: 'text' });
  }
}
