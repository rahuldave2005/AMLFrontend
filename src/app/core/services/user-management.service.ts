import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ComplianceOfficerRegisterDto, ComplianceOfficerRegisteredDto, TenantUserDashboardDto, TenantUserProfileDto } from '../models/user-management.models';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/api/v1';

  getComplianceOfficers(): Observable<TenantUserDashboardDto> {
    return this.http.get<TenantUserDashboardDto>(`${this.apiBaseUrl}/compliance-officers`);
  }

  getUserProfile(employeeCode: string): Observable<TenantUserProfileDto> {
    return this.http.get<TenantUserProfileDto>(`${this.apiBaseUrl}/compliance-officers/${employeeCode}`);
  }

  registerComplianceOfficer(payload: ComplianceOfficerRegisterDto): Observable<ComplianceOfficerRegisteredDto> {
    return this.http.post<ComplianceOfficerRegisteredDto>(`${this.apiBaseUrl}/auth/bank-officers/register`, payload);
  }
}
