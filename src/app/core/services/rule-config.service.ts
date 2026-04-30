import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuleDashboardDto, RuleDetailDto, RuleParameterUpdateDto, RuleParameterUpdatedDto } from '../models/rule-config.models';

@Injectable({
  providedIn: 'root'
})
export class RuleConfigService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/api/v1/bank-rules';

  getAllTenantRules(): Observable<RuleDashboardDto> {
    return this.http.get<RuleDashboardDto>(this.apiBaseUrl);
  }

  getRuleDetails(ruleCode: string): Observable<RuleDetailDto> {
    return this.http.get<RuleDetailDto>(`${this.apiBaseUrl}/${ruleCode}`);
  }

  updateRuleParameters(ruleCode: string, dto: RuleParameterUpdateDto): Observable<RuleParameterUpdatedDto> {
    return this.http.put<RuleParameterUpdatedDto>(`${this.apiBaseUrl}/${ruleCode}/parameters`, dto);
  }
}
