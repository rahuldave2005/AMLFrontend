import { AlertDetailDto } from "./alert.models";

export interface CaseRequestDto {
  alertNumbers: string[];
  assignedTo: string;
}

export interface CaseDashboardDto {
  caseReferenceNumber: string;
  caseStatus: string;
  assignedTo: string;
}

export interface CaseDetailDto {
  caseReferenceNumber: string;
  caseStatus: string;
  assignedTo: string;
  assignedBy: string;
  alerts: AlertDetailDto[];
}

export interface CaseEscalateDto {
  caseReferenceNumber: string;
  action: string;
  notes: string;
}
