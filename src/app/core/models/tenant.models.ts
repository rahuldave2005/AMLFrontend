export interface TenantInlineDto {
  bankName: string;
  ifsc: string;
  contactEmail: string;
}

export interface TenantDashboardDto {
  tenantInlineDtoList: TenantInlineDto[];
}

export interface TenantDetailsDto {
  bankName: string;
  ifsc: string;
  contactEmail: string;
  schemaName: string;
  createdAt: string | Date;
  tenantUsersCount: number;
  bankAdminName: string;
  bankAdminEmail: string;
  ruleCodes: string[];
}
export interface BankRegisterDto {
  bankName: string;
  ifsc: string;
  contactEmail: string;
  bankAdminEmail: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  employeeCode: string;
}
