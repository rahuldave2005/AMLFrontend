import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomSliceDto } from '../models/alert.models';
import { FileInlineDto, FileDetailDto, FileErrorInlineDto } from '../models/file-management.models';

@Injectable({
  providedIn: 'root'
})
export class FileManagementService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `http://localhost:8080/api/v1/files`;

  getAllFiles(page: number = 0, size: number = 10): Observable<CustomSliceDto<FileInlineDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<CustomSliceDto<FileInlineDto>>(this.apiUrl, { params });
  }

  getFileDetails(fileNumber: string): Observable<FileDetailDto> {
    return this.http.get<FileDetailDto>(`${this.apiUrl}/${fileNumber}`);
  }

  getErrorsForFile(fileNumber: string, page: number = 0, size: number = 10): Observable<CustomSliceDto<FileErrorInlineDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<CustomSliceDto<FileErrorInlineDto>>(`${this.apiUrl}/${fileNumber}/errors`, { params });
  }
}
