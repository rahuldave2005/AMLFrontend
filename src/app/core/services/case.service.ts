import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaseDashboardDto, CaseDetailDto, CaseRequestDto, CaseEscalateDto } from '../models/case.models';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/api/v1/cases';

  createCase(dto: CaseRequestDto): Observable<string> {
    return this.http.post(this.apiBaseUrl, dto, { responseType: 'text' });
  }

  getAllCases(): Observable<CaseDashboardDto[]> {
    return this.http.get<CaseDashboardDto[]>(this.apiBaseUrl);
  }

  getCaseDetail(caseReferenceNumber: string): Observable<CaseDetailDto> {
    return this.http.get<CaseDetailDto>(`${this.apiBaseUrl}/${caseReferenceNumber}`);
  }

  updateCaseStatus( dto: CaseEscalateDto): Observable<string> {
    return this.http.put(`${this.apiBaseUrl}`, dto, { responseType: 'text' });
  }
}
