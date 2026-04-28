import { UserRole } from './auth.models';

export interface SidebarMenuItem {
  label: string;
  route: string;
  roles: UserRole[];
}
