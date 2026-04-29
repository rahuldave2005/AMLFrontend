export type UserRole = 'SYSTEM_ADMIN' | 'BANK_ADMIN' | 'COMPLIANCE_OFFICER';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface JwtResponse {
  jwt: string;
  prefix: string;
  refreshToken: string;
  email: string;
  bankName: string;
  roles: string[];
}

export interface AuthUser {
  email: string;
  bankName: string;
  roles: string[];
  primaryRole: string;
  initials: string;
}
