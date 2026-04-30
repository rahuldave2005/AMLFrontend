import { Routes } from '@angular/router';
import { CasesComponent } from './cases.component';
import { CaseDetailComponent } from './components/case-detail/case-detail.component';

export const CASES_ROUTES: Routes = [
  {
    path: '',
    component: CasesComponent
  },
  {
    path: ':caseReferenceNumber',
    component: CaseDetailComponent
  }
];