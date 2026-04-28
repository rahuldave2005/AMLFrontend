import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface UserRecord {
  name: string;
  role: string;
  status: 'Active' | 'Pending';
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  readonly users: UserRecord[] = [
    { name: 'Sarah Khan', role: 'AML SYSTEM ADMIN', status: 'Active' },
    { name: 'Vikram Shah', role: 'BANK ADMIN', status: 'Active' },
    { name: 'Nina Joseph', role: 'COMPLIANCE OFFICER', status: 'Pending' }
  ];

  trackByName(index: number, item: UserRecord): string {
    return item.name;
  }
}
