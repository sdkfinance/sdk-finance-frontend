import apiConfigInstance from '@sdk5/shared/api';
import type { ICalculatedCommission } from '@sdk5/shared/requests';
import type { IApiResponse } from '@sdk5/shared/types';

import type { ICashDeskBody, ICashDeskExecuteResponse, ICashDeskResponse } from './CashDesk.types';

const { api } = apiConfigInstance;
export const CashDeskRequests = {
  getCashDesk(coinSerial: string): Promise<IApiResponse<ICashDeskResponse>> {
    return api.post('/cash-desks/view', { coinSerial });
  },

  calculateCommission(cashDeskId: string, data: ICashDeskBody): Promise<IApiResponse<ICalculatedCommission>> {
    return api.post(`/cash-desk-withdrawals/${cashDeskId}/calculate`, data);
  },

  executeWithdrawal(cashDeskId: string, data: ICashDeskBody): Promise<IApiResponse<ICashDeskExecuteResponse>> {
    return api.post(`/cash-desk-withdrawals/${cashDeskId}`, data);
  },
};
