import { api } from '../../api';
import type { IApiResponse } from '../../types';
import type { ICalculatedCommission } from '../types';
import type {
  ICashDeskBody,
  ICashDeskExecuteResponse,
  ICashDeskResponse,
  TViewCashDesksApiRequestPayload,
  TViewCashDesksApiResponseMock,
} from './CashDesk.types';
import { VIEW_CASH_DESKS_RESPONSE_MOCK } from './responses.mock';

export const CashDeskRequests = {
  getCashDesk(coinSerial: string): Promise<IApiResponse<ICashDeskResponse>> {
    return api.post('/cash-desks/view', { coinSerial });
  },

  viewCashDesksMock(payload: TViewCashDesksApiRequestPayload): Promise<TViewCashDesksApiResponseMock> {
    return Promise.resolve({ error: null, response: VIEW_CASH_DESKS_RESPONSE_MOCK });
  },

  calculateCommission(cashDeskId: string, data: ICashDeskBody): Promise<IApiResponse<ICalculatedCommission>> {
    return api.post(`/cash-desk-withdrawals/${cashDeskId}/calculate`, data);
  },

  executeWithdrawal(cashDeskId: string, data: ICashDeskBody): Promise<IApiResponse<ICashDeskExecuteResponse>> {
    return api.post(`/cash-desk-withdrawals/${cashDeskId}`, data);
  },
};
