export enum FileType {
  CUSTOMERS = 'CUSTOMERS',
  TRANSACTIONS = 'TRANSACTIONS',
  ACCOUNTS = 'ACCOUNTS'
}

export interface FileUploadProcessDto {
  message: string;
  fileName: string;
  totalRecords: number;
  status: string;
}
