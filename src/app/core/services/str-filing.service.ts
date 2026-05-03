import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { StrFilingDetailDto, StrFilingInlineDto } from '../models/str-filing.models';
import { CustomSliceDto } from '../models/alert.models';

@Injectable({
  providedIn: 'root'
})
export class StrFilingService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/api/v1/str-filings';

  getAllStrFilings(page: number = 0, size: number = 10): Observable<CustomSliceDto<StrFilingInlineDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<CustomSliceDto<StrFilingInlineDto>>(this.apiBaseUrl, { params });
  }

  getStrFilingDetails(referenceNumber: string): Observable<StrFilingDetailDto> {
    return this.http.get<StrFilingDetailDto>(`${this.apiBaseUrl}/${referenceNumber}`);
  }

  downloadPdf(url: string, filename: string): void {
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      },
      error: (err) => {
        console.error('Error downloading PDF:', err);
        // Fallback to opening in new tab if blob fetch fails (e.g. CORS)
        window.open(url, '_blank');
      }
    });
  }
}
