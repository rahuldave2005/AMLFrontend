import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RulePermissionDto, RuleDashboardDto, RuleDetailDto } from '../models/rule.models';

@Injectable({
  providedIn: 'root'
})
export class RuleService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/api/v1';

  getAllRules(): Observable<RuleDashboardDto> {
    return this.http.get<RuleDashboardDto>(`${this.apiBaseUrl}/rules`);
  }

  getTenantRules(bankName: string, isActive: boolean): Observable<RuleDashboardDto> {
    const params = new HttpParams().set('isActive', isActive.toString());
    return this.http.get<RuleDashboardDto>(`${this.apiBaseUrl}/tenants/${bankName}/rules`, { params });
  }

  getRuleDetails(ruleCode: string): Observable<RuleDetailDto> {
    return this.http.get<RuleDetailDto>(`${this.apiBaseUrl}/rules/${ruleCode}`);
  }

  updateRulePermissions(action: 'assign' | 'revoke', dto: RulePermissionDto): Observable<string> {
    const params = new HttpParams().set('ruleAction', action);
    return this.http.put(`${this.apiBaseUrl}/rules`, dto, { 
      params, 
      responseType: 'text' 
    });
  }
}
