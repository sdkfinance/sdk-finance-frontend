import { api } from '@sdk5/shared/api';
import type { IApiResponse } from '@sdk5/shared/types';

import type {
  IReportMoneyFlow,
  IReportMoneyFlowParams,
  IReportsCoinDetailsResponse,
  IReportsCoinOutflowsParams,
  IReportsCoinOutflowsResponse,
} from './Reports.types';

export const ReportsRequests = {
  getCoinsOutflows(params?: IReportsCoinOutflowsParams): Promise<IReportsCoinOutflowsResponse> {
    return api.get('/reporting/coins/outflows', { params });
  },

  getCoinsOutflowsBySerial(serial: string, params?: IReportsCoinOutflowsParams): Promise<IReportsCoinOutflowsResponse> {
    return api.get(`/reporting/coins/outflows/${serial}`, { params });
  },

  getCoinDetails(currencyId: string): Promise<IReportsCoinDetailsResponse> {
    return api.get(`/reporting/coins?currency=${currencyId}`);
  },

  getMoneyReport(params?: IReportMoneyFlowParams): Promise<IApiResponse<IReportMoneyFlow>> {
    return api.get('/reporting/coins/funds-flows', { params });
  },

  getMoneyReportBySerial(serial: string, params?: IReportMoneyFlowParams): Promise<IApiResponse<IReportMoneyFlow>> {
    return api.get(`/reporting/coins/funds-flows/${serial}`, { params });
  },
};
