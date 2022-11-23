import api from '@/services/api';
import {
  IBankAccountsApiResponse,
  IMyViewBankAccountsPayload, IViewBankAccountsPayload,
} from '@/services/requests/bank-accounts/BankAccounts.types';
import { IApiResponse } from '@/types/interfaces';

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
