import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '../../types';
import type { ICurrency, ICurrencyShort } from '../currencies';
import type { ITransactionsRecord } from '../transactions';
import type { ICalculatedCommission, ICoin } from '../types';

export interface IVouchersFilter {
  createdAtFrom?: string;
  createdAtTo?: string;
  activated?: boolean;
  activatedAtFrom?: string;
  activatedAtTo?: string;
}

export interface IVouchersSort {
  createdAt?: string;
  status?: string;
  type?: string;
}

export type TPrepaidVoucherStatus = 'blocked' | 'banned' | 'processed' | 'pending';

export interface IVouchersRecord {
  currency: ICurrency;
  serial: string;
  createdAt: string;
  activatedAt: string;
  amount: number;
  status: TPrepaidVoucherStatus;
  name: string;
}

export interface IVoucherNew {
  srcSerial: string;
  prepaidAmount: number;
  prepaidName?: string;
}

export interface IVoucherCreatedResponse {
  coin: ICoin;
  pin: string;
}

export interface IVoucherCreated {
  amount: number | null;
  number: string | null;
  pin: string | null;
}

export interface IVoucherRedeem {
  amount: string | null;
  serial: string | null;
}

export interface IPostVoucherRedeem {
  prepaidPin: string;
  destSerial?: string;
}

export interface IPostVoucherRedeemForm extends IPostVoucherRedeem {
  serial: string;
}

export interface IPrepaidVoucherRecord {
  serial: number;
  createdAt: string;
  activatedAt: string;
  amount: number;
  currency: ICurrencyShort;
  status: TPrepaidVoucherStatus;
  name: string;
}

export interface IVoucherActivatedResponse {
  process: ITransactionsRecord;
}

type IVouchersResponse = IPaginationResponse<IVouchersRecord>;

export type IVouchersOptions = IPaginationRequestOptions<IVouchersFilter, IVouchersSort>;

export type IGetVouchersApiResponse = IApiResponse<IVouchersResponse>;

export type IGetVoucherActivatedApiResponse = IApiResponse<IVoucherActivatedResponse>;

export type IPostVoucherApiResponse = IApiResponse<ICalculatedCommission>;

export type ICreateVoucherApiResponse = IApiResponse<IVoucherCreatedResponse>;

export type ICalculateVoucherApiResponse = IApiResponse<ICalculatedCommission>;
