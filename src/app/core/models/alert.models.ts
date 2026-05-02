import { Severity } from "./rule.models";

export enum AlertStatus {
  NEW = 'NEW',
  DISMISSED = 'DISMISSED',
  CONVERTED_TO_CASE = 'CONVERTED_TO_CASE'
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
  clientNumber: string;
}

export interface CustomSliceDto<T> {
  content: T[];
  last: boolean;
  numberOfElements: number;
}

export interface AlertDashboardDto {
  alerts: CustomSliceDto<GeneratedAlertDto>;
}

export interface AlertTransactionDto {
  accountNumber: string;
  counterPartyAccountNumber: string;
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
  clientNumber: string;
  customerFullName: string;
  transactionCount: number;
  totalAmount: number;
  transactions: AlertTransactionDto[];
}
