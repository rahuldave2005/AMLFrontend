import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RuleConfigService } from '../../../core/services/rule-config.service';
import { RuleDashboardDto, RuleDetailDto, RuleParameterUpdateDto } from '../../../core/models/rule-config.models';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rule-config-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rule-config-management.component.html',
  styleUrl: './rule-config-management.component.css'
})
export class RuleConfigManagementComponent implements OnInit {
  private readonly ruleService = inject(RuleConfigService);

  rulesData$!: Observable<RuleDashboardDto>;
  selectedRule: RuleDetailDto | null = null;
  originalParameters: { [key: string]: string } = {};
  editedParameters: { [key: string]: string } = {};
  isSaving = false;
  viewMode: 'list' | 'detail' = 'list';

  ngOnInit(): void {
    this.loadRules();
  }

  loadRules(): void {
    this.rulesData$ = this.ruleService.getAllTenantRules();
  }

  viewRule(ruleCode: string): void {
    this.ruleService.getRuleDetails(ruleCode).subscribe({
      next: (rule) => {
        this.selectedRule = rule;
        this.originalParameters = { ...rule.parameters } as any;
        this.editedParameters = { ...rule.parameters } as any; 
        this.viewMode = 'detail';
      },
      error: (err) => console.error('Error fetching rule details', err)
    });
  }

  backToList(): void {
    this.selectedRule = null;
    this.viewMode = 'list';
    this.loadRules();
  }

  saveParameters(): void {
    if (!this.selectedRule) return;

    // Filter only changed parameters
    const changedParameters: { [key: string]: string } = {};
    Object.keys(this.editedParameters).forEach(key => {
      if (this.editedParameters[key] !== this.originalParameters[key]) {
        changedParameters[key] = this.editedParameters[key];
      }
    });

    if (Object.keys(changedParameters).length === 0) {
      alert('No changes detected.');
      this.backToList();
      return;
    }

    this.isSaving = true;
    const dto: RuleParameterUpdateDto = {
      updatedParameters: changedParameters
    };

    this.ruleService.updateRuleParameters(this.selectedRule.ruleCode, dto).subscribe({
      next: (updated) => {
        if (this.selectedRule) {
          // Merge updated parameters back into the local model
          this.selectedRule.parameters = { ...this.selectedRule.parameters, ...updated.updatedParameters } as any;
          this.originalParameters = { ...this.originalParameters, ...updated.updatedParameters } as any;
        }
        this.isSaving = false;
        alert('Parameters updated successfully!');
        this.backToList();
      },
      error: (err) => {
        console.error('Error updating parameters', err);
        this.isSaving = false;
        alert('Failed to update parameters.');
      }
    });
  }

  // Helper to get keys of the parameters object
  getParameterKeys(): string[] {
    return this.editedParameters ? Object.keys(this.editedParameters) : [];
  }

  getSeverityClass(severity: string): string {
    switch (severity?.toUpperCase()) {
      case 'HIGH': return 'bg-danger-soft text-danger';
      case 'MEDIUM': return 'bg-warning-soft text-warning';
      case 'LOW': return 'bg-info-soft text-info';
      default: return 'bg-secondary-soft text-secondary';
    }
  }
}
