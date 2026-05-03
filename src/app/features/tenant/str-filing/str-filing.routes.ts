import { Routes } from '@angular/router';
import { StrFilingComponent } from './str-filing.component';
import { StrFilingDetailComponent } from './components/str-detail/str-filing-detail.component';

export const STR_FILING_ROUTES: Routes = [
  {
    path: '',
    component: StrFilingComponent
  },
  {
    path: ':referenceNumber',
    component: StrFilingDetailComponent
  }
];