import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
export class SidebarComponent implements OnInit {
  private readonly authService = inject(AuthService);

  readonly currentUser$ = this.authService.currentUser$;

  ngOnInit(): void {
    this.authService.rehydrate();
  }
  readonly menuItems: SidebarMenuItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      roles: ['SYSTEM_ADMIN', 'BANK_ADMIN', 'COMPLIANCE_OFFICER']
    },
    {
      label: 'Tenant Management',
      route: '/tenantManagement',
      roles: ['SYSTEM_ADMIN']
    },
    {
      label: 'View Rules',
      route: '/rules',
      roles: ['SYSTEM_ADMIN']
    },
    {
      label: 'Assign Rules',
      route: '/rules/assign-rules',
      roles: ['SYSTEM_ADMIN']
    },
    {
      label: 'Cases',
      route: '/cases',
      roles: ['BANK_ADMIN', 'COMPLIANCE_OFFICER']
    },
    {
      label: 'Alerts',
      route: '/alerts',
      roles: ['BANK_ADMIN']
    },
    {
      label: 'File Upload',
      route: '/file-upload',
      roles: ['BANK_ADMIN']
    },
    {
      label: 'Users',
      route: '/tenant-users',
      roles: ['BANK_ADMIN']
    },
    {
      label: 'Rule Config Management',
      route: '/rule-config',
      roles: ['BANK_ADMIN']
    },
    {
      label: 'Str Filing',
      route: '/str-filing',
      roles: ['COMPLIANCE_OFFICER']
    },
    
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
