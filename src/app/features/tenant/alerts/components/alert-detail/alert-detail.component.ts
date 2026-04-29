import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AlertService } from '../../../../../core/services/alert.service';
import { AlertDetailDto } from '../../../../../core/models/alert.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-alert-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './alert-detail.component.html',
  styleUrl: './alert-detail.component.css'
})
export class AlertDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly alertService = inject(AlertService);

  alert$!: Observable<AlertDetailDto>;

  ngOnInit(): void {
    const alertNumber = this.route.snapshot.paramMap.get('alertNumber');
    if (alertNumber) {
      this.alert$ = this.alertService.getAlertDetail(alertNumber);
    }
  }

  getSeverityClass(severity: string): string {
    switch (severity?.toUpperCase()) {
      case 'HIGH': return 'bg-danger text-white';
      case 'MEDIUM': return 'bg-warning text-dark';
      case 'LOW': return 'bg-info text-dark';
      default: return 'bg-secondary text-white';
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'NEW': return 'text-primary border-primary';
      case 'DISMISSED': return 'text-secondary border-secondary';
      case 'CONVERTED_TO_CASE': return 'text-info border-info';
      default: return 'text-muted border-secondary';
    }
  }

  getCaseStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'OPEN':
      case 'PENDING_REVIEW':
        return 'bg-primary-soft text-primary';
      case 'UNDER_INVESTIGATION':
      case 'ESCALATED':
        return 'bg-warning-soft text-warning';
      case 'ON_HOLD':
        return 'bg-secondary-soft text-secondary';
      case 'REPORTED_TO_FIU':
      case 'CLOSED':
        return 'bg-success-soft text-success';
      case 'CLOSED_AS_FALSE_POSITIVE':
        return 'bg-light text-dark border';
      default:
        return 'bg-light text-dark';
    }
  }
}
