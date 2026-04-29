import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantService } from '../../../core/services/tenant.service';
import { TenantInlineDto, TenantDetailsDto } from '../../../core/models/tenant.models';
import { TenantListComponent } from './tenant-list/tenant-list.component';
import { TenantDetailsComponent } from './tenant-details/tenant-details.component';

@Component({
  selector: 'app-tenant-management',
  standalone: true,
  imports: [CommonModule, TenantListComponent, TenantDetailsComponent],
  templateUrl: './tenant-management.component.html',
  styleUrl: './tenant-management.component.css'
})
export class TenantManagementComponent implements OnInit {
  private readonly tenantService = inject(TenantService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  tenants: TenantInlineDto[] = [];
  selectedTenantDetails: TenantDetailsDto | null = null;
  isLoading = false;
  showDetails = false;

  ngOnInit(): void {
    this.loadTenants();
  }

  loadTenants(): void {
    this.isLoading = true;
    this.tenantService.getAllTenants().subscribe({
      next: (response) => {
        this.tenants = response.tenantInlineDtoList;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  viewTenantDetails(bankName: string): void {
    this.tenantService.getTenantByBankName(bankName).subscribe({
      next: (details) => {
        this.selectedTenantDetails = details;
        this.showDetails = true;
      }
    });
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selectedTenantDetails = null;
  }

  onRegisterTenant(): void {
    this.router.navigate(['register'], { relativeTo: this.route });
  }
}
