import type { IApiResponse, IPaginationRequestOptions } from '../../types';
import type { ITransactionsRecord, ITransactionsTransaction } from '../transactions';
import type { IClientCoin } from '../types';

export interface IWithdrawalRecord extends ITransactionsRecord {
  cashAmount: number;
  children: any[];
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
