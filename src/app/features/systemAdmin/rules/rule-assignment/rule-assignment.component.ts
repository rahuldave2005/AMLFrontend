import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RuleService } from '../../../../core/services/rule.service';
import { TenantService } from '../../../../core/services/tenant.service';
import { RuleInlineDto } from '../../../../core/models/rule.models';
import { TenantInlineDto } from '../../../../core/models/tenant.models';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-rule-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rule-assignment.component.html',
  styleUrl: './rule-assignment.component.css'
})
export class RuleAssignmentComponent implements OnInit {
  private readonly ruleService = inject(RuleService);
  private readonly tenantService = inject(TenantService);

  tenants: TenantInlineDto[] = [];
  rules: RuleInlineDto[] = [];
  
  selectedAction: 'assign' | 'revoke' = 'assign';
  selectedBankName: string = '';
  selectedRuleCodes: Set<string> = new Set();
  
  isLoading = false;
  isFetchingRules = false;
  isSubmitting = false;
  message: string | null = null;
  isError = false;

  ngOnInit(): void {
    this.loadTenants();
  }

  loadTenants(): void {
    this.isLoading = true;
    this.tenantService.getAllTenants().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => this.tenants = data.tenantInlineDtoList,
      error: (err) => console.error('Error fetching tenants', err)
    });
  }

  onBankChange(): void {
    this.loadFilteredRules();
  }

  onActionChange(): void {
    this.loadFilteredRules();
  }

  loadFilteredRules(): void {
    if (!this.selectedBankName) {
      this.rules = [];
      return;
    }

    this.isFetchingRules = true;
    this.selectedRuleCodes.clear();
    
    // If action is assign, we want isActive=false (unassigned rules)
    // If action is revoke, we want isActive=true (already assigned rules)
    const isActive = this.selectedAction === 'revoke';
    
    this.ruleService.getTenantRules(this.selectedBankName, isActive).pipe(
      finalize(() => this.isFetchingRules = false)
    ).subscribe({
      next: (data) => this.rules = data.ruleInlineDtoList,
      error: (err) => {
        console.error('Error fetching filtered rules', err);
        this.showStatus('Failed to fetch rules for the selected tenant.', true);
      }
    });
  }

  toggleRule(ruleCode: string): void {
    if (this.selectedRuleCodes.has(ruleCode)) {
      this.selectedRuleCodes.delete(ruleCode);
    } else {
      this.selectedRuleCodes.add(ruleCode);
    }
  }

  onSubmit(): void {
    if (!this.selectedBankName) {
      this.showStatus('Please select a tenant first', true);
      return;
    }
    if (this.selectedRuleCodes.size === 0) {
      this.showStatus('Please select at least one rule', true);
      return;
    }

    this.isSubmitting = true;
    
    // First get tenant details to get schemaName
    this.tenantService.getTenantByBankName(this.selectedBankName).subscribe({
      next: (tenantDetails) => {
        const payload = {
          schemaName: tenantDetails.schemaName,
          ruleCodes: Array.from(this.selectedRuleCodes)
        };

        this.ruleService.updateRulePermissions(this.selectedAction, payload).subscribe({
          next: (res) => {
            this.showStatus(res, false);
            this.isSubmitting = false;
            this.selectedRuleCodes.clear();
            // Reload rules after success to reflect changes
            this.loadFilteredRules();
          },
          error: (err) => {
            this.showStatus(err.error || `Failed to ${this.selectedAction} rules`, true);
            this.isSubmitting = false;
          }
        });
      },
      error: (err) => {
        this.showStatus('Failed to fetch tenant details', true);
        this.isSubmitting = false;
      }
    });
  }

  private showStatus(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = null, 5000);
  }
}
