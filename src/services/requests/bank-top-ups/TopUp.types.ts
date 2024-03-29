import { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '@/types/interfaces';
import { TSortType } from '@/types/types/SortType.type';

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

export interface ITopUpRecord {
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

export type ITopUpRecordsApiResponse = IApiResponse<IPaginationResponse<ITopUpRecords>>
export type ITopUpRequest = IPaginationRequestOptions<ITopUpFilters, ITopUpSort>;
