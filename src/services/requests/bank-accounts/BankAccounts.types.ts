import { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '@/types/interfaces';
import { IWalletOwner } from '@/services/requests/coins/Wallets.types';

export interface IBankAccountDetails {
  bankAccountNumber: string;
  address: string;
  bic: string;
  fullName: string;
  iban: string;
  name: string;
  swift: string;
}

export interface IBankAccountRecord {
  createdAt: string;
  details: IBankAccountDetails;
  id: string;
  status: string;
  updatedAt: string;
  userId: string;
}

export interface IBankAccountsFilter {
  bankAccountNumber?: string;
  bankName?: string;
  bic?: string;
  iban?: string;
  statuses?: string[];
  swift?: string;
  userIds?: string[];
}

export interface IMyBankAccountsFilter {
  bankAccountNumber?: string;
  bankName?: string;
  bic?: string;
  iban?: string;
  statuses?: string[];
  swift?: string;
  coinSerial?: string;
  organization?: IWalletOwner;
}

export interface IBankAccountsSort {
  bankName?: string;
  status?: string;
}

export type IViewBankAccountsPayload = IPaginationRequestOptions<IBankAccountsFilter, IBankAccountsSort>;

export type IBankAccountsApiResponse = IApiResponse<IPaginationResponse<IBankAccountRecord>>

export type IMyViewBankAccountsPayload = IPaginationRequestOptions<IMyBankAccountsFilter, IBankAccountsSort>;
