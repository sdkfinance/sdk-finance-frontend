import type { TExportStatuses } from '@sdk5/shared/constants';

export interface IDataExportResponse {
  id: string;
}

export interface IDataExportInfoResponse {
  exportInfo: {
    exportStatus: TExportStatuses;
    fileId: string;
  };
}
