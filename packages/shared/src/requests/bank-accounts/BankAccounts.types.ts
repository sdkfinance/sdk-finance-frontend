import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '../../types';
import type { IBankCatalog } from '../catalogs';
import type { IWalletOwner } from '../coins';

export type TBankAccountStatus = 'PENDING' | 'REJECTED' | 'APPROVED';
export interface IBankAccountDetails extends IBankCatalog {
  bankAccountNumber: string;
  address: string;
  bic: string;
  fullName: string;
  iban: string;
  name: string;
  swift: string;
  countryCode?: string;
}

export interface IBankAccountRecord {
  createdAt: string;
  details: IBankAccountDetails;
  id: string;
  status: TBankAccountStatus;
  updatedAt: string;
  userId: string;
  coinSerial: string;
  default: boolean;
}

export interface IBankAccountsFilter {
  bankAccountNumber?: string;
  bankName?: string;
  bic?: string;
  iban?: string;
  statuses?: string[];
  swift?: string;
  userIds?: string[];
  coinSerial?: string;
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

export interface ICreateOrUpdateBankAccountWithBankIdRequest
  extends Partial<Pick<IBankAccountDetails, 'bankAccountNumber' | 'iban'>>,
    Required<Pick<IBankAccountDetails, 'fullName'>> {
  isDefault?: boolean;
  bankId: string;
}

export interface ICreateOrUpdateBankAccountWithBankIdResponse
  extends Partial<Pick<ICreateOrUpdateBankAccountWithBankIdRequest, 'isDefault' | 'iban' | 'bankAccountNumber'>> {
  bankAccountId?: string;
  bankInfo?: Pick<IBankCatalog, 'address' | 'bic' | 'city' | 'name' | 'swift' | 'zipCode'> & {
    bankId: string;
    country: string;
  };
}

export type IViewBankAccountsPayload = IPaginationRequestOptions<IBankAccountsFilter, IBankAccountsSort>;

export type IBankAccountsApiResponse = IApiResponse<IPaginationResponse<IBankAccountRecord>>;

export type IMyViewBankAccountsPayload = IPaginationRequestOptions<IMyBankAccountsFilter, IBankAccountsSort>;

export interface IGetMyBankAccountsResponse {
  records: IBankAccountRecord[];
}
