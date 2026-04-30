export interface RuleDashboardDto {
  ruleInlineDtoList: TenantRuleInlineDto[];
}

export interface TenantRuleInlineDto {
  ruleCode: string;
  ruleName: string;
  severity: string;
}

export interface RuleDetailDto {
  ruleCode: string;
  ruleName: string;
  category: string;
  description: string;
  parameters: Map<string, string>;
}

export interface RuleParameterUpdateDto {
  updatedParameters: { [key: string]: string };
}

export interface RuleParameterUpdatedDto {
  ruleCode: string;
  updatedParameters: { [key: string]: string };
}
