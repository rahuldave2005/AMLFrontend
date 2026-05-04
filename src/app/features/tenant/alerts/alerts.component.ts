import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';
import { AlertStatus, GeneratedAlertDto } from '../../../core/models/alert.models';
import { UserManagementService } from '../../../core/services/user-management.service';
import { CaseService } from '../../../core/services/case.service';
import { TenantUserDashboardDto } from '../../../core/models/user-management.models';
import { Observable, Subject, debounceTime, distinctUntilChanged, finalize } from 'rxjs';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css'
})
export class AlertsComponent implements OnInit {
  private readonly alertService = inject(AlertService);
  private readonly userService = inject(UserManagementService);
  private readonly caseService = inject(CaseService);

  alerts: GeneratedAlertDto[] = [];
  complianceOfficers$!: Observable<TenantUserDashboardDto>;

  // Selection Logic
  isSelectionMode = false;
  selectedAlerts = new Set<string>();
  selectedClientNumber: string | null = null;

  // Modal state
  showAssignModal = false;
  assignedTo = '';

  // Pagination & Filtering
  currentPage = 0;
  pageSize = 10;
  isLastPage = false;
  selectedStatus: AlertStatus | null = null;
  isLoading = false;

  searchControl = new FormControl('');
  readonly statuses = Object.values(AlertStatus);

  ngOnInit(): void {
    this.loadAlerts();
    this.complianceOfficers$ = this.userService.getComplianceOfficers();

    // Setup search with debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadAlerts();
    });
  }

  loadAlerts(): void {
    this.isLoading = true;
    this.alertService.getAlertDashboard(
      this.selectedStatus,
      this.searchControl.value || '',
      this.currentPage,
      this.pageSize
    ).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        this.alerts = response.content;
        this.isLastPage = response.last;
      },
      error: (err) => {
        console.error('Error loading alerts:', err);
        this.alerts = [];
      }
    });
  }


  onStatusChange(): void {
    this.currentPage = 0;
    this.loadAlerts();
  }

  nextPage(): void {
    if (!this.isLastPage) {
      this.currentPage++;
      this.loadAlerts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAlerts();
    }
  }

  toggleSelectionMode(): void {
    this.isSelectionMode = !this.isSelectionMode;
    if (!this.isSelectionMode) {
      this.selectedAlerts.clear();
      this.selectedClientNumber = null;
    }
  }

  onAlertSelect(alert: GeneratedAlertDto, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedAlerts.add(alert.alertNumber);
      this.selectedClientNumber = alert.clientNumber;
    } else {
      this.selectedAlerts.delete(alert.alertNumber);
      if (this.selectedAlerts.size === 0) {
        this.selectedClientNumber = null;
      }
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
        this.currentPage = 0;
        this.loadAlerts();
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
