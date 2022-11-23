import api from '@/services/api';
import {
  IBankWithdrawalBody,
  IBankWithdrawalCommissionResponse,
  IBankWithdrawalCreateResponse,
} from '@/services/requests/bank-withdrawals/BankWithdrawals.types';
import {
  IWithdrawalOptions,
  IWithdrawalRecordsResponse,
} from '@/services/requests/bank-withdrawals/Withdrawal.interface';
import { IApiResponse } from '@/types/interfaces';

export const BankWithdrawalsRequests = {

  create(data: IBankWithdrawalBody): Promise<IApiResponse<IBankWithdrawalCreateResponse>> {
    return api.post('/bank-withdrawals', data);
  },

  calculateCommission(coin: string, amount: number): Promise<IApiResponse<IBankWithdrawalCommissionResponse>> {
    return api.post('/bank-withdrawals/calculate', { coin, amount });
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

};
