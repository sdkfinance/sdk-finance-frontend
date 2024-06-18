import apiConfigInstance from '../../api';
import type { IApiResponse } from '../../types';
import type {
  IBankWithdrawalBody,
  IBankWithdrawalCommissionResponse,
  IBankWithdrawalCreateResponse,
  ICreateWithdrawalRequestPayload,
} from './BankWithdrawals.types';
import type { IWithdrawalOptions, IWithdrawalRecordsResponse } from './Withdrawal.interface';

const { api } = apiConfigInstance;
export const BankWithdrawalsRequests = {
  create(data: IBankWithdrawalBody): Promise<IApiResponse<IBankWithdrawalCreateResponse>> {
    return api.post('/bank-withdrawals', data);
  },

  calculateCommission(coinSerial: string, amount: number): Promise<IApiResponse<IBankWithdrawalCommissionResponse>> {
    return api.post('/bank-withdrawals/calculate', { coinSerial, amount });
  },

  getRecords(options: IWithdrawalOptions): Promise<IWithdrawalRecordsResponse> {
    return api.post('/bank-withdrawals/view', options);
  },

  acceptWithdrawal(id: string): Promise<IApiResponse<any>> {
    return api.post(`/bank-withdrawals/${id}/accept`);
  },

  declineWithdrawal(id: string): Promise<IApiResponse<any>> {
    return api.post(`/bank-withdrawals/${id}/decline`);
  },

  createWithdrawalRequest(payload: ICreateWithdrawalRequestPayload): Promise<IApiResponse<any>> {
    return api.post('/bank-withdrawals/create-request', payload);
  },
};
