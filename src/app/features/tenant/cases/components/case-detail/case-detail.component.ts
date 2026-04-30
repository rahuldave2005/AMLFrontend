import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CaseService } from '../../../../../core/services/case.service';
import { CaseDetailDto } from '../../../../../core/models/case.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-case-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './case-detail.component.html',
  styleUrl: './case-detail.component.css'
})
export class CaseDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly caseService = inject(CaseService);

  case$!: Observable<CaseDetailDto>;

  ngOnInit(): void {
    const caseRef = this.route.snapshot.paramMap.get('caseReferenceNumber');
    if (caseRef) {
      this.case$ = this.caseService.getCaseDetail(caseRef);
    }
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
      case 'CLOSED': return 'bg-success-soft text-success';
      default: return 'bg-light text-dark';
    }
  }
}
