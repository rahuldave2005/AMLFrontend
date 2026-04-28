import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface RuleSummary {
  name: string;
  owner: string;
  status: 'Active' | 'Draft';
}

@Component({
  selector: 'app-rules',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.css'
})
export class RulesComponent {
  readonly rules: RuleSummary[] = [
    { name: 'High Value Cross Border Transfer', owner: 'AML Team', status: 'Active' },
    { name: 'Rapid Cash Movement', owner: 'Compliance', status: 'Draft' }
  ];

  trackByName(index: number, item: RuleSummary): string {
    return item.name;
  }
}
