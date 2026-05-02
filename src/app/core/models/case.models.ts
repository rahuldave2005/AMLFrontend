import { AlertDetailDto } from "./alert.models";

export enum CaseStatus {
  UNDER_INVESTIGATION = 'UNDER_INVESTIGATION',
  ESCALATED = 'ESCALATED',
  CLOSED = 'CLOSED'
}

export interface CaseRequestDto {
  alertNumbers: string[];
  assignedTo: string;
}

export interface CaseDashboardDto {
  caseReferenceNumber: string;
  caseStatus: CaseStatus;
  assignedTo: string;
}

export interface CaseDetailDto {
  caseReferenceNumber: string;
  caseStatus: CaseStatus;
  assignedTo: string;
  assignedBy: string;
  alerts: AlertDetailDto[];
}

export interface CaseEscalateDto {
  caseReferenceNumber: string;
  action: string;
  notes: string;
}
