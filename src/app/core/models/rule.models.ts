export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface RuleInlineDto {
  ruleCode: string;
  ruleName: string;
  severity: Severity;
}

export interface RuleDashboardDto {
  ruleInlineDtoList: RuleInlineDto[];
}

export interface RuleDetailDto {
  ruleCode: string;
  ruleName: string;
  description: string;
  severity: Severity;
  parameters: { [key: string]: string };
}

export interface RulePermissionDto {
  schemaName: string;
  ruleCodes: string[];
}
