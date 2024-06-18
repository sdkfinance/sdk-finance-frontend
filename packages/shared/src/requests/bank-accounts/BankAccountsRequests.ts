import apiConfigInstance from '../../api';
import type { IApiResponse } from '../../types';
import type {
  IBankAccountsApiResponse,
  ICreateOrUpdateBankAccountWithBankIdRequest,
  ICreateOrUpdateBankAccountWithBankIdResponse,
  IGetMyBankAccountsResponse,
  IMyViewBankAccountsPayload,
  IViewBankAccountsPayload,
} from './BankAccounts.types';

const { api } = apiConfigInstance;
export const BankAccountsRequests = {
  getMyBankAccounts(): Promise<IApiResponse<IGetMyBankAccountsResponse>> {
    return api.get('/my/bank-accounts');
  },

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
  createNewBankAccount(
    coinSerial: string,
    payload: ICreateOrUpdateBankAccountWithBankIdRequest,
  ): Promise<IApiResponse<ICreateOrUpdateBankAccountWithBankIdResponse>> {
    return api.post(`/my/bank-accounts/coin/${coinSerial}/with-bank`, payload);
  },
  updateBankAccount(
    bankAccountId: string,
    payload: ICreateOrUpdateBankAccountWithBankIdRequest,
  ): Promise<IApiResponse<ICreateOrUpdateBankAccountWithBankIdResponse>> {
    return api.patch(`/my/bank-accounts/${bankAccountId}/with-bank`, payload);
  },
  deleteBankAccount(bankAccountId: string): Promise<IApiResponse<any>> {
    return api.delete(`/my/bank-accounts/${bankAccountId}`);
  },
};
