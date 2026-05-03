import { CustomSliceDto } from "./alert.models";

export enum FileStatus {
  UPLOADED = 'UPLOADED',
  PROCESSING = 'PROCESSING',
  PARTIALLY_COMPLETED = 'PARTIALLY_COMPLETED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface FileInlineDto {
  fileNumber: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
}

export interface FileDetailDto {
  fileNumber: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  fileStatus: FileStatus;
  totalRecords: number;
  fileSizeInBytes: number;
}

export interface FileErrorInlineDto {
  rowNumber: number;
  fieldName: string;
  errorMessage: string;
}

export interface FileManagementDashboardDto {
  files: CustomSliceDto<FileInlineDto>;
}
