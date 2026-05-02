import { Routes } from '@angular/router';
import { AlertsComponent } from './features/tenant/alerts/alerts.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/login/login.component';
import { RulesComponent } from './features/systemAdmin/rules/rules.component';
import { LayoutComponent } from './layout/layout.component';
import { FileUploadComponent } from './features/tenant/file-upload/file-upload.component';
import { StrFilingComponent } from './features/tenant/str-filing/str-filing.component';
import { authGuard, roleGuard } from './core/guards/auth.guards';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'change-password',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['BANK_ADMIN', 'COMPLIANCE_OFFICER'] },
    loadComponent: () => import('./features/change-password/change-password.component').then(m => m.ChangePasswordComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'tenantManagement',
        canActivate: [roleGuard],
        data: { roles: ['SYSTEM_ADMIN'] },
        loadChildren: () => import('./features/systemAdmin/tenant-management/tenant-management.routes').then(m => m.TENANT_MANAGEMENT_ROUTES)
      },
      {
        path: 'alerts',
        canActivate: [roleGuard],
        data: { roles: ['BANK_ADMIN', 'COMPLIANCE_OFFICER'] },
        loadChildren: () => import('./features/tenant/alerts/alerts.routes').then(m => m.ALERTS_ROUTES)
      },
      {
        path: 'cases',
        canActivate: [roleGuard],
        data: { roles: ['BANK_ADMIN', 'COMPLIANCE_OFFICER'] },
        loadChildren: () => import('./features/tenant/cases/cases.routes').then(m => m.CASES_ROUTES)
      },
      {
        path: 'rules',
        canActivate: [roleGuard],
        data: { roles: ['SYSTEM_ADMIN'] },
        loadChildren: () => import('./features/systemAdmin/rules/rules.routes').then(m => m.RULES_ROUTES)
      },
      {
        path: 'rule-config',
        canActivate: [roleGuard],
        data: { roles: ['BANK_ADMIN'] },
        loadChildren: () => import('./features/tenant/rule-config-management/rule-config-management.routes').then(m => m.RULE_CONFIG_MANAGEMENT_ROUTES)
      },
      {
        path: 'file-upload',
        canActivate: [roleGuard],
        data: { roles: ['BANK_ADMIN'] },
        loadChildren: () => import('./features/tenant/file-upload/file-upload.routes').then(m => m.FILE_UPLOAD_ROUTES)
      },
      {
        path: 'str-filing',
        canActivate: [roleGuard],
        data: { roles: ['BANK_ADMIN', 'COMPLIANCE_OFFICER'] },
        loadChildren: () => import('./features/tenant/str-filing/str-filing.routes').then(m => m.STR_FILING_ROUTES)
      },
      {
        path: 'run-rule-engine',
        canActivate: [roleGuard],
        data: { roles: ['BANK_ADMIN'] },
        loadChildren: () => import('./features/tenant/run-rule-engine/run-rule-engine.routes').then(m => m.RUN_RULE_ENGINE_ROUTES)
      },
      {
        path: 'tenant-users',
        canActivate: [roleGuard],
        data: { roles: ['BANK_ADMIN'] },
        loadChildren: () => import('./features/tenant/user-management/user-management.routes').then(m => m.USER_MANAGEMENT_ROUTES)
      },
      {
        path: 'tenant/user-management',
        loadChildren: () => import('./features/tenant/user-management/user-management.routes').then(m => m.USER_MANAGEMENT_ROUTES)
      },



      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
