import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { UserManagementService } from '../../../../../core/services/user-management.service';
import { TenantUserDashboardDto, TenantUserProfileDto } from '../../../../../core/models/user-management.models';

@Component({
  selector: 'app-compliance-officer-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './compliance-officer-list.component.html',
  styleUrl: './compliance-officer-list.component.css'
})
export class ComplianceOfficerListComponent implements OnInit {
  private readonly userManagementService = inject(UserManagementService);
  private readonly router = inject(Router);

  complianceOfficers$!: Observable<TenantUserDashboardDto>;
  selectedOfficer: TenantUserProfileDto | null = null;
  isLoadingDetails = false;

  ngOnInit(): void {
    this.complianceOfficers$ = this.userManagementService.getComplianceOfficers();
  }

  registerOfficer(): void {
    this.router.navigate(['/tenant/user-management/register']);
  }

  viewDetails(employeeCode: string): void {
    this.isLoadingDetails = true;
    this.userManagementService.getUserProfile(employeeCode).subscribe({
      next: (profile) => {
        this.selectedOfficer = profile;
        this.isLoadingDetails = false;
      },
      error: (err) => {
        console.error('Error fetching officer details', err);
        this.isLoadingDetails = false;
      }
    });
  }

  closeDetails(): void {
    this.selectedOfficer = null;
  }
}
