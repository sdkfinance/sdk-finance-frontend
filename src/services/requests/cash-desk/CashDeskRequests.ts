import api from '@/services/api';
import {
  ICashDeskBody,
  ICashDeskCommissionRecord,
  ICashDeskExecuteResponse,
  ICashDeskResponse,
} from '@/services/requests/cash-desk/CashDesk.types';
import { IApiResponse } from '@/types/interfaces';

export const CashDeskRequests = {

  getCashDesk(coinSerial: string): Promise<IApiResponse<ICashDeskResponse>> {
    return api.post('/cash-desks/view', { coinSerial });
  },

  calculateCommission(cashDeskId: string, data: ICashDeskBody): Promise<IApiResponse<ICashDeskCommissionRecord>> {
    return api.post(`/cash-desk-withdrawals/${cashDeskId}/calculate`, data);
  },

  executeWithdrawal(cashDeskId: string, data: ICashDeskBody): Promise<IApiResponse<ICashDeskExecuteResponse>> {
    return api.post(`/cash-desk-withdrawals/${cashDeskId}`, data);
  },

};
