import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CaseService } from '../../../../../core/services/case.service';
import { CaseDetailDto, CaseEscalateDto } from '../../../../../core/models/case.models';
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

  case$!: Observable<CaseDetailDto>;
  
  // Action properties
  showActionModal = false;
  currentAction: 'dismiss' | 'escalate' | null = null;
  actionNotes = '';
  isSubmitting = false;

  ngOnInit(): void {
    this.loadCaseDetail();
  }

  loadCaseDetail(): void {
    const caseRef = this.route.snapshot.paramMap.get('caseReferenceNumber');
    if (caseRef) {
      this.case$ = this.caseService.getCaseDetail(caseRef);
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
    this.caseService.updateCaseStatus(caseRef, dto).subscribe({
      next: (response) => {
        if (this.currentAction === 'escalate' && response) {
          window.open(response, '_blank');
        }
        this.isSubmitting = false;
        this.closeActionModal();
        this.loadCaseDetail(); // Refresh UI
        if (this.currentAction === 'dismiss') {
          this.router.navigate(['/cases']); // Navigate back if dismissed
        }
      },
      error: (err) => {
        console.error('Error updating case status:', err);
        this.isSubmitting = false;
        alert('Failed to update case status. Please try again.');
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
      case 'OPEN': return 'bg-primary-soft text-primary';
      case 'UNDER_INVESTIGATION': return 'bg-warning-soft text-warning';
      case 'CLOSED': 
      case 'DISMISSED': return 'bg-success-soft text-success';
      case 'ESCALATED': return 'bg-danger-soft text-danger';
      default: return 'bg-light text-dark';
    }
  }

  isCaseActionable(status: string): boolean {
    const s = status?.toUpperCase();
    return s !== 'CLOSED' && s !== 'DISMISSED' && s !== 'ESCALATED';
  }
}
