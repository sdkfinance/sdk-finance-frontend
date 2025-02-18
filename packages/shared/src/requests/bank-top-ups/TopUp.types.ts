import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse, TSortType } from '../../types';
import type { ITransactionsRecord } from '../transactions';

export interface ITopUpRecord extends ITransactionsRecord {
  fullName: string;
}

export interface ITopUpRecords {
  records: ITopUpRecord[];
}

export interface ITopUpFilters {
  ids: string[];
  startCreatedDate: string;
  finishCreatedDate: string;
  coinSerials: string[];
  orgIds: string[];
  requestStatuses: string[];
}

export interface ITopUpSort {
  createdAt?: TSortType;
  status?: TSortType;
  type?: TSortType;
}

export interface ITopUpCalculatePayload {
  coinSerial: string | null;
  amount: number | null;
}

export interface ITopUpViaBankRequestPayload {
  coinSerial: string;
  amount: number;
  bankAccountNumber?: string;
  iban?: string;
  bankId?: string;
  fullName?: string;
  description?: string;
}

export type ITopUpRecordsApiResponse = IApiResponse<IPaginationResponse<ITopUpRecords>>;
export type ITopUpRequest = IPaginationRequestOptions<ITopUpFilters, ITopUpSort>;
