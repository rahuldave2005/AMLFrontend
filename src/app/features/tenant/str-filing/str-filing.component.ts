import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StrFilingService } from '../../../core/services/str-filing.service';
import { AuthService } from '../../../core/services/auth.service';
import { StrFilingInlineDto } from '../../../core/models/str-filing.models';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-str-filing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './str-filing.component.html',
  styleUrl: './str-filing.component.css'
})
export class StrFilingComponent implements OnInit {
  private readonly strFilingService = inject(StrFilingService);
  private readonly authService = inject(AuthService);

  filings: StrFilingInlineDto[] = [];
  isLoading = false;
  currentPage = 0;
  pageSize = 10;
  isLastPage = false;

  get isComplianceOfficer(): boolean {
    return this.authService.getCurrentUser()?.roles.includes('COMPLIANCE_OFFICER') || false;
  }

  ngOnInit(): void {
    this.loadFilings();
  }

  loadFilings(): void {
    this.isLoading = true;
    this.strFilingService.getAllStrFilings(this.currentPage, this.pageSize)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.filings = response.content;
          this.isLastPage = response.last;
        },
        error: (err) => {
          console.error('Error loading STR filings:', err);
        }
      });
  }

  nextPage(): void {
    if (!this.isLastPage) {
      this.currentPage++;
      this.loadFilings();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadFilings();
    }
  }
}
