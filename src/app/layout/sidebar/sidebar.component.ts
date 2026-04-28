import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthUser } from '../../core/models/auth.models';
import { SidebarMenuItem } from '../../core/models/navigation.models';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);

  readonly currentUser$ = this.authService.currentUser$;
  readonly menuItems: SidebarMenuItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      roles: ['AML SYSTEM ADMIN', 'BANK ADMIN', 'COMPLIANCE OFFICER']
    },
    {
      label: 'Transactions',
      route: '/transactions',
      roles: ['AML SYSTEM ADMIN', 'BANK ADMIN', 'COMPLIANCE OFFICER']
    },
    {
      label: 'Alerts',
      route: '/alerts',
      roles: ['AML SYSTEM ADMIN', 'BANK ADMIN', 'COMPLIANCE OFFICER']
    },
    {
      label: 'Rules',
      route: '/rules',
      roles: ['AML SYSTEM ADMIN', 'COMPLIANCE OFFICER']
    },
    {
      label: 'Users',
      route: '/users',
      roles: ['AML SYSTEM ADMIN', 'BANK ADMIN']
    }
  ];

  trackByRoute(index: number, item: SidebarMenuItem): string {
    return item.route;
  }

  getAllowedMenuItems(user: AuthUser | null): SidebarMenuItem[] {
    if (!user) {
      return [];
    }

    return this.menuItems.filter((item) => item.roles.some((role) => user.roles.includes(role)));
  }
}
