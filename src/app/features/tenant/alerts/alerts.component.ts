import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface AlertItem {
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
}

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css'
})
export class AlertsComponent {
  readonly alerts: AlertItem[] = [
    {
      title: 'Velocity threshold breach',
      severity: 'High',
      description: 'Multiple transfers crossed the alert threshold in under 30 minutes.'
    },
    {
      title: 'Dormant account activity',
      severity: 'Medium',
      description: 'A long-inactive account resumed high-value movement.'
    },
    {
      title: 'Geo mismatch detected',
      severity: 'Low',
      description: 'Transaction origin differs from expected customer region.'
    }
  ];

  trackByTitle(index: number, item: AlertItem): string {
    return item.title;
  }
}
