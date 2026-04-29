import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuleAssignmentDto, RuleDashboardDto, RuleDetailDto } from '../models/rule.models';

@Injectable({
  providedIn: 'root'
})
export class RuleService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/api/v1';

  getAllRules(): Observable<RuleDashboardDto> {
    return this.http.get<RuleDashboardDto>(`${this.apiBaseUrl}/rules`);
  }

  getRuleDetails(ruleCode: string): Observable<RuleDetailDto> {
    return this.http.get<RuleDetailDto>(`${this.apiBaseUrl}/rules/${ruleCode}`);
  }

  assignRules(dto: RuleAssignmentDto): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/rules/assign`, dto, { responseType: 'text' });
  }
}
