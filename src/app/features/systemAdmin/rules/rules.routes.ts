import { Routes } from '@angular/router';
import { RulesComponent } from './rules.component';
import { RuleListComponent } from './rule-list/rule-list.component';
import { RuleDetailComponent } from './rule-detail/rule-detail.component';
import { RuleAssignmentComponent } from './rule-assignment/rule-assignment.component';

export const RULES_ROUTES: Routes = [
  {
    path: '',
    component: RulesComponent,
    children: [
      {
        path: '',
        component: RuleListComponent
      },
      {
        path: 'assign-rules',
        component: RuleAssignmentComponent
      },
      {
        path: ':ruleCode',
        component: RuleDetailComponent
      }
    ]
  }
];