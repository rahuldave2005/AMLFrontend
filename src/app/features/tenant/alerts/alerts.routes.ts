
import { Routes } from '@angular/router';
import { AlertsComponent } from './alerts.component';

export const ALERTS_ROUTES: Routes = [
  {
    path: '',
    component: AlertsComponent
  },
  {
    path: ':alertNumber',
    loadComponent: () => import('./components/alert-detail/alert-detail.component').then(m => m.AlertDetailComponent)
  }
];