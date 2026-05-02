import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CaseService } from '../../../core/services/case.service';
import { CaseDashboardDto, CaseStatus } from '../../../core/models/case.models';
import { Subject, debounceTime, distinctUntilChanged, finalize } from 'rxjs';

@Component({
  selector: 'app-cases',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cases.component.html',
  styleUrl: './cases.component.css'
})
export class CasesComponent implements OnInit {
  private readonly caseService = inject(CaseService);
  
  cases: CaseDashboardDto[] = [];
  isLoading = false;

  // Pagination & Filtering
  currentPage = 0;
  pageSize = 10;
  isLastPage = false;
  selectedStatus: CaseStatus | null = null;
  assignedToEmail = '';
  
  caseRefControl = new FormControl('');
  readonly statuses = Object.values(CaseStatus);

  ngOnInit(): void {
    this.loadCases();

    // Setup search for case reference number with debounce
    this.caseRefControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadCases();
    });
  }

  loadCases(): void {
    this.isLoading = true;
    this.caseService.getAllCases(
      this.selectedStatus,
      this.assignedToEmail,
      this.caseRefControl.value || '',
      this.currentPage,
      this.pageSize
    ).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        this.cases = response.content;
        this.isLastPage = response.last;
      },
      error: (err) => {
        console.error('Error loading cases:', err);
        this.cases = [];
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadCases();
  }

  nextPage(): void {
    if (!this.isLastPage) {
      this.currentPage++;
      this.loadCases();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadCases();
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'UNDER_INVESTIGATION': return 'bg-primary-soft text-primary';
      case 'ESCALATED': return 'bg-warning-soft text-warning';
      case 'CLOSED': return 'bg-success-soft text-success';
      default: return 'bg-light text-dark';
    }
  }
}
