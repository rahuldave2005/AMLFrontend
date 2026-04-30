import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { AlertService } from '../../../../../core/services/alert.service';
import { AlertDetailDto } from '../../../../../core/models/alert.models';
import { Observable } from 'rxjs';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-alert-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './alert-detail.component.html',
  styleUrl: './alert-detail.component.css'
})
export class AlertDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);
  private readonly navService = inject(NavigationService);
  private readonly authService = inject(AuthService);

  alert$!: Observable<AlertDetailDto>;

  ngOnInit(): void {
    const alertNumber = this.route.snapshot.paramMap.get('alertNumber');
    if (alertNumber) {
      this.alert$ = this.alertService.getAlertDetail(alertNumber);
    }
  }

  goBack(): void {
    const prevUrl = this.navService.getPreviousUrl();
    const user = this.authService.getCurrentUser();
    
    // If we have a previous URL and it's relevant, go back
    if (prevUrl && (prevUrl.includes('/cases/') || prevUrl.includes('/alerts'))) {
      this.router.navigateByUrl(prevUrl);
      return;
    }

    // Role-based fallback as requested
    if (user?.roles.includes('COMPLIANCE_OFFICER')) {
      this.router.navigate(['/cases']);
    } else {
      this.router.navigate(['/alerts']);
    }
  }

  getSeverityClass(severity: string): string {
    switch (severity?.toUpperCase()) {
      case 'HIGH': return 'bg-danger text-white';
      case 'MEDIUM': return 'bg-warning text-dark';
      case 'LOW': return 'bg-info text-dark';
      default: return 'bg-secondary text-white';
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'NEW': return 'text-primary border-primary';
      case 'DISMISSED': return 'text-secondary border-secondary';
      case 'CONVERTED_TO_CASE': return 'text-info border-info';
      default: return 'text-muted border-secondary';
    }
  }


}
