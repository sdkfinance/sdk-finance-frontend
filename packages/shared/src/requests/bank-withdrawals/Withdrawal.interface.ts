import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '../../types';
import type { ITopUpRecords } from '../bank-top-ups';
import type { ITransactionsRecord } from '../transactions';

export interface IWithdrawalRecord extends ITransactionsRecord {
  fullName: string;
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

export type IWithdrawalRecordsResponse = IApiResponse<IPaginationResponse<ITopUpRecords>>;
