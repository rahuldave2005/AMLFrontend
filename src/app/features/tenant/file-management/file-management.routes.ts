import { Routes } from '@angular/router';
import { FileManagementComponent } from './file-management.component';
import { FileDetailComponent } from './components/file-detail/file-detail.component';

export const FILE_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    component: FileManagementComponent
  },
  {
    path: ':fileNumber',
    component: FileDetailComponent
  }
];
