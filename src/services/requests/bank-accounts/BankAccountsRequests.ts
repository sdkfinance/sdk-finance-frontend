import api from '@/services/api';
import { IApiResponse } from '@/types/interfaces';
import {
  IViewBankAccountsPayload,
  IMyViewBankAccountsPayload, IBankAccountsApiResponse,
} from '@/services/requests/bank-accounts/BankAccounts.types';

export const BankAccountsRequests = {

  viewMyBankAccounts(options: Partial<IMyViewBankAccountsPayload>): Promise<IBankAccountsApiResponse> {
    return api.post('/my/bank-accounts/view', options);
  },

  viewBankAccounts(options: Partial<IViewBankAccountsPayload>): Promise<IBankAccountsApiResponse> {
    return api.post('/bank-accounts/view', options);
  },

  approveBankAccount(bankAccountId: string): Promise<IApiResponse<any>> {
    return api.post(`/bank-accounts/${bankAccountId}/approve`);
  },

  rejectBankAccount(bankAccountId: string): Promise<IApiResponse<any>> {
    return api.post(`/bank-accounts/${bankAccountId}/reject`);
  },
};
