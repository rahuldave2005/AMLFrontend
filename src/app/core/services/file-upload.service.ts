import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FileType, FileUploadProcessDto } from '../models/file-upload.models';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/api/v1/files';

  uploadFile(file: File, fileType: FileType): Observable<FileUploadProcessDto> {
    const formData = new FormData();
    formData.append('file', file);

    // Create the DTO part as a Blob with application/json content type
    const fileUploadDto = { fileType: fileType };
    const dtoBlob = new Blob([JSON.stringify(fileUploadDto)], { type: 'application/json' });
    formData.append('fileUploadDto', dtoBlob);

    return this.http.post<FileUploadProcessDto>(`${this.apiBaseUrl}/upload`, formData);
  }
}
