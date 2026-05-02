export type UserRole = 'SYSTEM_ADMIN' | 'BANK_ADMIN' | 'COMPLIANCE_OFFICER';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  jwt: string;
  prefix: string;
  refreshToken: string;
  email: string;
  bankName: string;
  roles: string[];
  firstName: string;
  lastName: string;
  isFirstLogin: boolean;
}

export interface AuthUser {
  email: string;
  bankName: string;
  roles: string[];
  primaryRole: string;
  initials: string;
  firstName: string;
  lastName: string;
  isFirstLogin: boolean;
}
export interface PasswordChangeRequestDto {
  email: string;
  oldPassword: string;
  newPassword: string;
}
