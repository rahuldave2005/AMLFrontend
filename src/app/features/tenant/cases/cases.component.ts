import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CaseService } from '../../../core/services/case.service';
import { CaseDashboardDto } from '../../../core/models/case.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cases',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cases.component.html',
  styleUrl: './cases.component.css'
})
export class CasesComponent implements OnInit {
  private readonly caseService = inject(CaseService);
  
  cases$!: Observable<CaseDashboardDto[]>;

  ngOnInit(): void {
    this.cases$ = this.caseService.getAllCases();
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'OPEN': return 'bg-primary-soft text-primary';
      case 'UNDER_INVESTIGATION': return 'bg-warning-soft text-warning';
      case 'CLOSED': return 'bg-success-soft text-success';
      default: return 'bg-light text-dark';
    }
  }
}
