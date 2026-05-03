import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerInfoDto } from '../models/customer.models';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/api/v1';

  getCustomerInfo(customerNumber: string): Observable<CustomerInfoDto> {
    return this.http.get<CustomerInfoDto>(`${this.apiBaseUrl}/customers/${customerNumber}`);
  }

  downloadTransactionPdf(customerNumber: string): Observable<Blob> {
    return this.http.get(`${this.apiBaseUrl}/customers/${customerNumber}/transactions/pdf`, {
      responseType: 'blob'
    });
  }
}
