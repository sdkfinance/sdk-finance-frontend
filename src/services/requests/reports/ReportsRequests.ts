import api from '@/services/api';
import {
  IReportMoneyFlow,
  IReportsCoinDetailsResponse,
  IReportsCoinOutflowsParams,
  IReportsCoinOutflowsResponse,
  IReportMoneyFlowParams,
} from '@/services/requests/reports/Reports.types';
import { IApiResponse } from '@/types/interfaces';

export const ReportsRequests = {

  getCoinsOutflows(params?: IReportsCoinOutflowsParams): Promise<IReportsCoinOutflowsResponse> {
    return api.get('/reporting/coins/outflows', { params });
  },

  getCoinsOutflowsBySerial(serial: string, params?: IReportsCoinOutflowsParams): Promise<IReportsCoinOutflowsResponse> {
    return api.get(`/reporting/coins/outflows/${serial}`, { params });
  },

  getCoinDetails(currency: string): Promise<IReportsCoinDetailsResponse> {
    return api.get(`/reporting/coins?currency=${currency}`);
  },

  getMoneyReport(params?: IReportMoneyFlowParams): Promise<IApiResponse<IReportMoneyFlow>> {
    return api.get('/reporting/coins/funds-flows', { params });
  },

  getMoneyReportBySerial(serial: string, params?: IReportMoneyFlowParams): Promise<IApiResponse<IReportMoneyFlow>> {
    return api.get(`/reporting/coins/funds-flows/${serial}`, { params });
  },

};
