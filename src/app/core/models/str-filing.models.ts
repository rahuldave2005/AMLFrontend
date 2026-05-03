import { CustomSliceDto } from "./alert.models";

export interface StrFilingInlineDto {
  caseNumber: string;
  referenceNumber: string;
  filedBy: string;
}

export interface StrFilingDetailDto {
  caseReferenceNumber: string;
  clientNumber: string;
  filedBy: string;
  referenceNumber: string;
  filedAt: string;
  pdfStoragePath: string;
}

export interface StrFilingDashboardDto {
  filings: CustomSliceDto<StrFilingInlineDto>;
}
