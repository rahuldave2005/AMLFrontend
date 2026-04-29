import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RuleService } from '../../../../core/services/rule.service';
import { RuleInlineDto, Severity } from '../../../../core/models/rule.models';

@Component({
  selector: 'app-rule-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rule-list.component.html',
  styleUrl: './rule-list.component.css'
})
export class RuleListComponent implements OnInit {
  private readonly ruleService = inject(RuleService);
  rules: RuleInlineDto[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadRules();
  }

  loadRules(): void {
    this.isLoading = true;
    this.ruleService.getAllRules().subscribe({
      next: (data) => {
        this.rules = data.ruleInlineDtoList;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching rules', err);
        this.isLoading = false;
      }
    });
  }

  getSeverityClass(severity: Severity): string {
    switch (severity) {
      case Severity.CRITICAL: return 'bg-danger text-white';
      case Severity.HIGH: return 'bg-warning text-dark';
      case Severity.MEDIUM: return 'bg-info text-dark';
      case Severity.LOW: return 'bg-success text-white';
      default: return 'bg-secondary text-white';
    }
  }
}
