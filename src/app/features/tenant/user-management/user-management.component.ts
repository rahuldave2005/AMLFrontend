import { Component } from '@angular/core';
import { ComplianceOfficerListComponent } from './components/compliance-officer-list/compliance-officer-list.component';

@Component({
  selector: 'app-user-management',
  standalone:true,
  imports: [ComplianceOfficerListComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {

}
