import { Routes } from '@angular/router';
import { UserManagementComponent } from './user-management.component';

export const USER_MANAGEMENT_ROUTES: Routes = [
    {
        path: '',
        component: UserManagementComponent
    },
    {
        path: 'register',
        loadComponent: () => import('./components/register-compliance-officer/register-compliance-officer.component').then(m => m.RegisterComplianceOfficerComponent)
    }
];