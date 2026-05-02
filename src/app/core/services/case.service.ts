import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaseDashboardDto, CaseDetailDto, CaseRequestDto, CaseEscalateDto, CaseStatus } from '../models/case.models';
import { CustomSliceDto } from '../models/alert.models';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/api/v1/cases';

  createCase(dto: CaseRequestDto): Observable<string> {
    return this.http.post(this.apiBaseUrl, dto, { responseType: 'text' });
  }

  getAllCases(
    caseStatus?: CaseStatus | null,
    assignedToEmail?: string,
    caseReferenceNumber?: string,
    page: number = 0,
    size: number = 10
  ): Observable<CustomSliceDto<CaseDashboardDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (caseStatus) {
      params = params.set('caseStatus', caseStatus);
    }
    if (assignedToEmail && assignedToEmail.trim()) {
      params = params.set('assignedToEmail', assignedToEmail.trim());
    }
    if (caseReferenceNumber && caseReferenceNumber.trim()) {
      params = params.set('caseReferenceNumber', caseReferenceNumber.trim());
    }

    return this.http.get<CustomSliceDto<CaseDashboardDto>>(this.apiBaseUrl, { params });
  }

  getCaseDetail(caseReferenceNumber: string): Observable<CaseDetailDto> {
    return this.http.get<CaseDetailDto>(`${this.apiBaseUrl}/${caseReferenceNumber}`);
  }

  updateCaseStatus(dto: CaseEscalateDto): Observable<string> {
    return this.http.put(`${this.apiBaseUrl}`, dto, { responseType: 'text' });
  }
}
