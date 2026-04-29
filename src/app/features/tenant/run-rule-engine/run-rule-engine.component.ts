import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RuleEngineService } from '../../../core/services/rule-engine.service';

@Component({
  selector: 'app-run-rule-engine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './run-rule-engine.component.html',
  styleUrl: './run-rule-engine.component.css'
})
export class RunRuleEngineComponent {
  private readonly ruleEngineService = inject(RuleEngineService);

  isExecuting = false;
  executionResult: string | null = null;
  errorMessage: string | null = null;
  lastExecutionTime: Date | null = null;

  runEngine(): void {
    this.isExecuting = true;
    this.executionResult = null;
    this.errorMessage = null;

    this.ruleEngineService.runEngine().subscribe({
      next: (response) => {
        this.executionResult = response;
        this.isExecuting = false;
        this.lastExecutionTime = new Date();
      },
      error: (err) => {
        console.error('Rule engine execution failed', err);
        this.errorMessage = 'Failed to execute rule engine. Please try again later.';
        this.isExecuting = false;
      }
    });
  }
}
