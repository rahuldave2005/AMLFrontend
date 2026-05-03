import { Severity } from "./rule.models";

export interface CustomerInfoDto {
  clientNumber: string;
  firstName: string;
  lastName: string;
  middleName: string;
  aadharNumber: string;
  pan: string;
  occupation: string;
  occupationType: string;
  isPep: boolean;
  riskRate: Severity;
  monthlyIncome: number;
  familyCode: string;
}
