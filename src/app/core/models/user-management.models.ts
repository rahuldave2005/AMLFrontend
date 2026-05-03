export interface TenantUserInlineDto {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  activeWorkload: number;
}

export interface TenantUserDashboardDto {
  userInlineDtoList: TenantUserInlineDto[];
}

export interface TenantUserProfileDto {
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  employeeCode: string;
  createdAt: string; // LocalDate in Java is usually a string in JSON
}

export interface ComplianceOfficerRegisterDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  employeeCode: string;
}

export interface ComplianceOfficerRegisteredDto {
  email: string;
  employeeCode: string;
  role: string;
}
