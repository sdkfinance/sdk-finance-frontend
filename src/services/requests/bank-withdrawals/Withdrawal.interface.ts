import { IApiResponse, IPaginationRequestOptions } from '@/types/interfaces';
import { ITransactionsTransaction } from '@/services/requests/transactions/Transactions.types';

export interface IBankInfo {
  address: string;
  bic: string;
  city: string;
  name: string;
  zipCode: string;
  swift: string;
  country: string;
}

type TIssuer = {
  currency: string;
  symbol: string;
  id: string;
  sn: string;
}

export interface IClientCoin {
  name: string;
  organizationId: string;
  organizationName: string;
  serial: string;
  technical: boolean;
  type: string;
  issuer: TIssuer;
}

export interface IWithdrawalRecord {
  cashAmount: number;
  children: any[];
  bankInfo: IBankInfo;
  clientCoin: IClientCoin;
  createdAt: string;
  fullName: string;
  iban: string;
  id: string;
  requestIdentifier: number;
  requestStatus: string;
  status: string;
  type: string;
  updatedAt: string;
  transactions: ITransactionsTransaction[];
}

export interface IWithdrawalRecords {
  records: IWithdrawalRecord[];
}

export interface IWithdrawalSort {
  createdAt?: string;
  status?: string;
  type?: string;
}

export interface IWithdrawalFilter {
  startCreatedDate?: string;
  finishCreatedDate?: string;
  coinSerials?: string[];
  orgIds?: string[];
  requestStatuses?: string;
}

export type IWithdrawalOptions = IPaginationRequestOptions<IWithdrawalFilter, IWithdrawalSort>;

export type IWithdrawalRecordsResponse = IApiResponse<IWithdrawalRecords>;
