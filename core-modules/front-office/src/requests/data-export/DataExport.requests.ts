import apiConfigInstance from '@sdk5/shared/api';
import type { ITransactionsOptions } from '@sdk5/shared/requests';
import type { IApiResponse } from '@sdk5/shared/types';

import type { IDataExportInfoResponse, IDataExportResponse } from './DataExport.types';

const { api } = apiConfigInstance;
export const DataExportRequests = {
  init(params: ITransactionsOptions): Promise<IApiResponse<IDataExportResponse>> {
    return api.post('/data-export/init', params);
  },

  info(jobKey: string): Promise<IApiResponse<IDataExportInfoResponse>> {
    return api.get(`/data-export/info/${jobKey}`);
  },
};
