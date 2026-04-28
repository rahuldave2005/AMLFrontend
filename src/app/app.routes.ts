import { Routes } from '@angular/router';
import { AlertsComponent } from './features/alerts/alerts.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/login/login.component';
import { RulesComponent } from './features/rules/rules.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { UsersComponent } from './features/users/users.component';
import { LayoutComponent } from './layout/layout.component';

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
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'transactions',
        component: TransactionsComponent
      },
      {
        path: 'alerts',
        component: AlertsComponent
      },
      {
        path: 'rules',
        component: RulesComponent
      },
      {
        path: 'users',
        component: UsersComponent
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
    redirectTo: 'login'
  }
];
