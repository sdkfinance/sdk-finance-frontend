import {
  IApiResponse,
  IPaginationRequestOptions,
  IPaginationResponse,
} from '@/types/interfaces';
import { COIN_TYPES } from '@/constants';

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

type TIssuer = {
  currency: string;
  id: string;
  sn: string;
}

export interface IVouchersRecord {
  issuer: TIssuer;
  serial: string;
  createdAt: string;
  activatedAt: string;
  amount: number;
  status: string;
}

export interface IVoucherCreateResponse {
  transactionAmount: number;
  senderAmountPush: number;
  recipientAmountPush: number;
  commissionAmountPush: number;
  issuer: TIssuer;
}

export interface IIssuer {
  currency: string;
  id: string;
  sn: string;
}

export interface IVoucherActivatedResponse {
  process: IVoucherProcess;
}

export interface IVoucherTo {
  serial: string;
  organizationId: string;
  organizationName: string;
  technical: boolean;
  type: string;
  issuer: IIssuer;
  name: string;
}

export interface IVoucherTransactions {
  id: string;
  type: string;
  from: IVoucherFrom;
  to: IVoucherTo;
  amount: number;
  performedAt: string;
  issuer: IIssuer;
}

export interface IVoucherFrom {
  serial: string;
  organizationId: string;
  organizationName: string;
  technical: boolean;
  type: string;
  issuer: IIssuer;
  name: string;
}

export interface IVoucherProcess {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  status: string;
  transactions: IVoucherTransactions[];
  children: any[];
  amount: number;
  from: IVoucherFrom;
  to: IVoucherTo;
}

export interface IVoucherNew {
  srcSerial: string;
  prepaidAmount: number;
}

export interface ICoin {
  serial: string;
  name: string;
  amount: number;
  availableAmount: number;
  futureAmount: number;
  heldAmount: number;
  creditLimit: number;
  issuer: IIssuer;
  active: boolean;
  type: keyof typeof COIN_TYPES;
  main: boolean;
}

export interface IVoucherCreatedResponse {
  coin: ICoin;
  pin: string;
  name: string;
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

export interface IPostVoucherRedeemForm extends IPostVoucherRedeem{
  serial: string;
}

export interface IVoucherRedeemCalculated {
  transactionAmount: number;
  senderAmountPush: number;
  recipientAmountPush: number;
  commissionAmountPush: number;
  issuer: IIssuer;
}

export interface IViewPrepaidVoucherResponse {
  activatedAt: string;
  amount: number;
  createdAt: string;
  issuer: IIssuer;
  name: string;
  serial: number;
  status: string;
}

type IVouchersResponse = IPaginationResponse<IVouchersRecord>;

export type IVouchersOptions = IPaginationRequestOptions<IVouchersFilter, IVouchersSort>;

export type IGetVouchersApiResponse = IApiResponse<IVouchersResponse>;

export type IGetVoucherActivatedApiResponse = IApiResponse<IVoucherActivatedResponse>;

export type IPostVoucherApiResponse = IApiResponse<IVoucherCreateResponse>;

export type ICreateVoucherApiResponse = IApiResponse<IVoucherCreatedResponse>;

export type ICalculateVoucherApiResponse = IApiResponse<IVoucherRedeemCalculated>;
