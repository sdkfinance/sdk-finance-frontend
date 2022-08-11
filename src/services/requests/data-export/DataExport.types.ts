import { TExportStatuses } from '@/constants/export-statuses';

export interface IDataExportResponse {
  status: string;
  message: string;
  id: string;
}

export interface IDataExportInfoResponse {
  exportInfo: {
    exportStatus: TExportStatuses;
    fileId: string;
  };
}
