import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';
import { AlertDashboardDto } from '../../../core/models/alert.models';
import { UserManagementService } from '../../../core/services/user-management.service';
import { CaseService } from '../../../core/services/case.service';
import { TenantUserDashboardDto } from '../../../core/models/user-management.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css'
})
export class AlertsComponent implements OnInit {
  private readonly alertService = inject(AlertService);
  private readonly userService = inject(UserManagementService);
  private readonly caseService = inject(CaseService);
  
  alerts$!: Observable<AlertDashboardDto>;
  complianceOfficers$!: Observable<TenantUserDashboardDto>;

  // Selection Logic
  isSelectionMode = false;
  selectedAlerts = new Set<string>();
  
  // Modal state
  showAssignModal = false;
  assignedTo = '';

  ngOnInit(): void {
    this.alerts$ = this.alertService.getAlertDashboard();
    this.complianceOfficers$ = this.userService.getComplianceOfficers();
  }

  toggleSelectionMode(): void {
    this.isSelectionMode = !this.isSelectionMode;
    if (!this.isSelectionMode) {
      this.selectedAlerts.clear();
    }
  }

  onAlertSelect(alertNumber: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedAlerts.add(alertNumber);
    } else {
      this.selectedAlerts.delete(alertNumber);
    }
  }

  openAssignModal(): void {
    if (this.selectedAlerts.size === 0) {
      alert('Please select at least one alert.');
      return;
    }
    this.showAssignModal = true;
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
    this.assignedTo = '';
  }

  createCase(): void {
    if (!this.assignedTo) {
      alert('Please select a compliance officer.');
      return;
    }

    const payload = {
      alertNumbers: Array.from(this.selectedAlerts),
      assignedTo: this.assignedTo
    };

    this.caseService.createCase(payload).subscribe({
      next: (response) => {
        alert('Case created successfully!');
        this.closeAssignModal();
        this.toggleSelectionMode();
        // Refresh alerts
        this.alerts$ = this.alertService.getAlertDashboard();
      },
      error: (error) => {
        console.error('Error creating case:', error);
        alert('Failed to create case. Please try again.');
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
      case 'NEW': return 'bg-primary-soft text-primary';
      case 'DISMISSED': return 'bg-secondary-soft text-secondary';
      case 'CONVERTED_TO_CASE': return 'bg-info-soft text-info';
      default: return 'bg-light text-dark';
    }
  }
}
