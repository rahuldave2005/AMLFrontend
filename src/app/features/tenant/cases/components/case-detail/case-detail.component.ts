import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CaseService } from '../../../../../core/services/case.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { CaseDetailDto, CaseEscalateDto } from '../../../../../core/models/case.models';
import { CustomerInfoDto } from '../../../../../core/models/customer.models';
import { CustomerService } from '../../../../../core/services/customer.service';
import { StrFilingService } from '../../../../../core/services/str-filing.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-case-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './case-detail.component.html',
  styleUrl: './case-detail.component.css'
})
export class CaseDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly caseService = inject(CaseService);
  private readonly authService = inject(AuthService);
  private readonly customerService = inject(CustomerService);
  private readonly strFilingService = inject(StrFilingService);
  private readonly sanitizer = inject(DomSanitizer);

  caseData: CaseDetailDto | null = null;
  isLoading = false;
  
  // Action properties
  showActionModal = false;
  currentAction: 'dismiss' | 'escalate' | null = null;
  actionNotes = '';
  isSubmitting = false;

  // Customer Detail properties
  showCustomerModal = false;
  customerData: CustomerInfoDto | null = null;
  isLoadingCustomer = false;
  isDownloadingPdf = false;

  // PDF / STR properties
  isStrGenerated = false;
  strPdfUrl: string | null = null;

  get isComplianceOfficer(): boolean {
    return this.authService.getCurrentUser()?.roles.includes('COMPLIANCE_OFFICER') || false;
  }

  ngOnInit(): void {
    this.loadCaseDetail();
  }

  loadCaseDetail(): void {
    const caseRef = this.route.snapshot.paramMap.get('caseReferenceNumber');
    if (caseRef) {
      this.isLoading = true;
      this.caseService.getCaseDetail(caseRef).subscribe({
        next: (data) => {
          this.caseData = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching case details:', err);
          this.isLoading = false;
          this.caseData = null;
        }
      });
    }
  }

  openActionModal(action: 'dismiss' | 'escalate'): void {
    this.currentAction = action;
    this.actionNotes = '';
    this.showActionModal = true;
  }

  closeActionModal(): void {
    this.showActionModal = false;
    this.currentAction = null;
    this.actionNotes = '';
  }

  submitAction(caseRef: string): void {
    if (!this.currentAction || (this.currentAction === 'dismiss' && !this.actionNotes.trim())) {
      return;
    }

    const dto: CaseEscalateDto = {
      caseReferenceNumber: caseRef,
      action: this.currentAction,
      notes: this.actionNotes
    };

    this.isSubmitting = true;
    this.caseService.updateCaseStatus(dto).subscribe({
      next: (response) => {
        if (this.currentAction === 'escalate' && response) {
          this.strPdfUrl = response;
          this.isStrGenerated = true;
        }
        this.isSubmitting = false;
        if (this.currentAction === 'dismiss') {
          this.closeActionModal();
          this.loadCaseDetail(); // Refresh UI
          this.router.navigate(['/cases']); // Navigate back if dismissed
        } else {
          this.closeActionModal();
          this.loadCaseDetail();
        }
      },
      error: (err) => {
        console.error('Error updating case status:', err);
        this.isSubmitting = false;
        alert('Failed to update case status. Please try again.');
      }
    });
  }

  viewCustomerDetails(customerNumber: string): void {
    this.isLoadingCustomer = true;
    this.showCustomerModal = true;
    this.customerService.getCustomerInfo(customerNumber).subscribe({
      next: (data) => {
        this.customerData = data;
        this.isLoadingCustomer = false;
      },
      error: (err) => {
        console.error('Error fetching customer details:', err);
        this.isLoadingCustomer = false;
        alert('Failed to fetch customer details.');
      }
    });
  }

  closeCustomerModal(): void {
    this.showCustomerModal = false;
    this.customerData = null;
  }

  downloadGeneratedStr(): void {
    if (this.strPdfUrl) {
      this.strFilingService.downloadPdf(this.strPdfUrl, `STR_Report_${this.route.snapshot.paramMap.get('caseReferenceNumber')}.pdf`);
    }
  }

  downloadTransactions(customerNumber: string): void {
    this.isDownloadingPdf = true;
    this.customerService.downloadTransactionPdf(customerNumber).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${customerNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.isDownloadingPdf = false;
      },
      error: (err) => {
        console.error('Error downloading PDF:', err);
        this.isDownloadingPdf = false;
        alert('Failed to download transaction history.');
      }
    });
  }

  getSeverityClass(severity: string): string {
    switch (severity?.toUpperCase()) {
      case 'HIGH': return 'bg-danger-soft text-danger';
      case 'MEDIUM': return 'bg-warning-soft text-warning';
      case 'LOW': return 'bg-info-soft text-info';
      default: return 'bg-secondary-soft text-secondary';
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'UNDER_INVESTIGATION': return 'bg-primary-soft text-primary';
      case 'ESCALATED': return 'bg-warning-soft text-warning';
      case 'CLOSED': return 'bg-success-soft text-success';
      default: return 'bg-light text-dark';
    }
  }

  isCaseActionable(status: string): boolean {
    const s = status?.toUpperCase();
    return s === 'UNDER_INVESTIGATION';
  }
}
