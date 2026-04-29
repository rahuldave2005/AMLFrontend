import { Severity } from "./rule.models";

export enum AlertStatus {
  NEW = 'NEW',
  DISMISSED = 'DISMISSED',
  CONVERTED_TO_CASE = 'CONVERTED_TO_CASE'
}

export enum CaseStatus {
  OPEN = 'OPEN',
  PENDING_REVIEW = 'PENDING_REVIEW',
  UNDER_INVESTIGATION = 'UNDER_INVESTIGATION',
  ON_HOLD = 'ON_HOLD',
  ESCALATED = 'ESCALATED',
  REPORTED_TO_FIU = 'REPORTED_TO_FIU',
  CLOSED_AS_FALSE_POSITIVE = 'CLOSED_AS_FALSE_POSITIVE',
  CLOSED = 'CLOSED'
}

export enum TransactionType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT'
}

export enum TransactionMode {
  CASH = 'CASH',
  NET_BANKING = 'NET_BANKING',
  UPI = 'UPI',
  CHEQUE = 'CHEQUE'
}

export interface GeneratedAlertDto {
  alertNumber: string;
  status: AlertStatus;
  brokenRuleName: string;
  severity: Severity;
  generatedAt: string;
}

export interface AlertDashboardDto {
  alerts: GeneratedAlertDto[];
}

export interface AlertTransactionDto {
  accountNumber: string;
  counterpartyAccountNumber: string;
  transactionDate: string;
  transactionType: TransactionType;
  transactionMode: TransactionMode;
  amount: number;
  transactionReferenceNumber: string;
}

export interface AlertDetailDto {
  alertNumber: string;
  brokenRuleName: string;
  severity: Severity;
  status: AlertStatus;
  caseReferenceNumber?: string;
  caseStatus?: CaseStatus;
  assignedTo?: string;
  transactionCount: number;
  totalAmount: number;
  transactions: AlertTransactionDto[];
}
