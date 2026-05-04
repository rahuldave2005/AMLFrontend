import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StrFilingService } from '../../../../../core/services/str-filing.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { StrFilingDetailDto } from '../../../../../core/models/str-filing.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-str-filing-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './str-filing-detail.component.html',
  styleUrl: './str-filing-detail.component.css'
})
export class StrFilingDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly strFilingService = inject(StrFilingService);
  private readonly authService = inject(AuthService);

  filing: StrFilingDetailDto | null = null;
  isLoading = false;

  get isComplianceOfficer(): boolean {
    return this.authService.getCurrentUser()?.roles.includes('COMPLIANCE_OFFICER') || false;
  }

  ngOnInit(): void {
    const ref = this.route.snapshot.paramMap.get('referenceNumber');
    if (ref) {
      this.loadFilingDetails(ref);
    }
  }

  loadFilingDetails(ref: string): void {
    this.isLoading = true;
    this.strFilingService.getStrFilingDetails(ref).subscribe({
      next: (data) => {
        this.filing = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading filing details:', err);
        this.isLoading = false;
        this.filing = null;
      }
    });
  }

  downloadPdf(url: string, ref: string): void {
    this.strFilingService.downloadPdf(url, `STR_Filing_${ref}.pdf`);
  }
}
