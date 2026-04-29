import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RuleService } from '../../../../core/services/rule.service';
import { RuleDetailDto, Severity } from '../../../../core/models/rule.models';

@Component({
  selector: 'app-rule-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rule-detail.component.html',
  styleUrl: './rule-detail.component.css'
})
export class RuleDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ruleService = inject(RuleService);
  
  ruleCode: string | null = null;
  rule: RuleDetailDto | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.ruleCode = this.route.snapshot.paramMap.get('ruleCode');
    if (this.ruleCode) {
      this.loadRuleDetails(this.ruleCode);
    }
  }

  loadRuleDetails(code: string): void {
    this.isLoading = true;
    this.ruleService.getRuleDetails(code).subscribe({
      next: (data) => {
        this.rule = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching rule details', err);
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

  // Convert Map to array for easy iteration in template
  getParametersArray() {
    if (!this.rule || !this.rule.parameters) return [];
    return Object.entries(this.rule.parameters).map(([key, value]) => ({ key, value }));
  }
}
