import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';
import { AlertDashboardDto } from '../../../core/models/alert.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css'
})
export class AlertsComponent implements OnInit {
  private readonly alertService = inject(AlertService);
  
  alerts$!: Observable<AlertDashboardDto>;

  ngOnInit(): void {
    this.alerts$ = this.alertService.getAlertDashboard();
  }

  getSeverityClass(severity: string): string {
    switch (severity.toUpperCase()) {
      case 'HIGH': return 'bg-danger-soft text-danger';
      case 'MEDIUM': return 'bg-warning-soft text-warning';
      case 'LOW': return 'bg-info-soft text-info';
      default: return 'bg-secondary-soft text-secondary';
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'NEW': return 'bg-primary-soft text-primary';
      case 'DISMISSED': return 'bg-secondary-soft text-secondary';
      case 'CONVERTED_TO_CASE': return 'bg-info-soft text-info';
      default: return 'bg-light text-dark';
    }
  }
}
