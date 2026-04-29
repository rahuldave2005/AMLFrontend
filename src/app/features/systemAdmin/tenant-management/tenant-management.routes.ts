import { Routes } from '@angular/router';
import { TenantManagementComponent } from './tenant-management.component';
import { RegisterTenantComponent } from './register-tenant/register-tenant.component';

export const TENANT_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    component: TenantManagementComponent
  },
  {
    path: 'register',
    component: RegisterTenantComponent
  }
];