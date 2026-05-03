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

  filing$!: Observable<StrFilingDetailDto>;

  get isComplianceOfficer(): boolean {
    return this.authService.getCurrentUser()?.roles.includes('COMPLIANCE_OFFICER') || false;
  }

  ngOnInit(): void {
    const ref = this.route.snapshot.paramMap.get('referenceNumber');
    if (ref) {
      this.filing$ = this.strFilingService.getStrFilingDetails(ref);
    }
  }

  downloadPdf(url: string, ref: string): void {
    this.strFilingService.downloadPdf(url, `STR_Filing_${ref}.pdf`);
  }
}
