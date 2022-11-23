import api from '@/services/api';
import { IDataExportInfoResponse, IDataExportResponse } from '@/services/requests/data-export/DataExport.types';
import { ITransactionsFilter } from '@/services/requests/transactions/Transactions.types';
import { IApiResponse } from '@/types/interfaces';

export const DataExportRequests = {

  init(params: ITransactionsFilter): Promise<IApiResponse<IDataExportResponse>> {
    return api.post('/data-export/init', params);
  },

  info(jobKey: string): Promise<IApiResponse<IDataExportInfoResponse>> {
    return api.get(`/data-export/info/${jobKey}`);
  },
};
