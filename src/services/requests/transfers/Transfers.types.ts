import {
  IApiResponse,
  IPaginationRequestOptions,
  IPaginationResponse,
} from '@/types/interfaces';

export type TTransferPaymentType = 'COIN' | 'SMART_CARD';

export interface ITransfersFilter {
  ids?: string[];
  types?: string[];
  statuses?: [];
  createdAtFrom?: string;
  createdAtTo?: string;
  coinSerials?: string[];
  senderCoinNames?: string[];
  recipientCoinNames?: string[];
  orgIds?: string[];
  issuerIds?: string[];
  currencyCodes?: string[];
  requestIdentifiers?: number[];
  fromEmails?: string[];
  toEmails?: string[];
  fromPhoneNumbers?: string[];
  toPhoneNumbers?: string[];
}

export interface ITransfersSort {
  createdAt?: string;
  status?: string;
  type?: string;
}

type TIssuer = {
  currency: string;
  id: string;
  sn: string;
}

type TTarget = {
  issuer: TIssuer;
  organizationId: string;
  organizationName: string;
  serial: string | number;
  technical: boolean;
  type: string;
}

export interface ITransfersTransaction {
  amount: number;
  from: TTarget;
  id: string;
  issuer: TIssuer;
  performedAt: string;
  to: TTarget;
  type: string;
  updatedAt: string;
}

export interface ITransfersRecord {
  children: object[];
  createdAt: string;
  updatedAt: string;
  description: string;
  id: string;
  requestIdentifier: number;
  requestStatus: string;
  status: string;
  transactions: ITransfersTransaction[];
  type: string;
}

export interface ITransferBody {
  paymentTool: {
    type: TTransferPaymentType;
    srcValue: string;
    destValue: string;
  };
  amount: number | null;
  description: string;
}

export interface ITransferCalculateResponse {
  status: string;
  message: string;
  transactionAmount: number;
  senderAmountPush: number;
  paymentToolDetails: {
    currency: string;
    destId: string;
    destValue: string;
    recipientFullName: string;
    srcId: string;
    srcValue: string;
    symbol: string;
    type: TTransferPaymentType;
  };
  recipientAmountPush: number;
  commissionAmountPush: number;
  issuer: TIssuer;
}

type ITransfersResponse = IPaginationResponse<ITransfersRecord>;

export type ITransfersOptions = IPaginationRequestOptions<ITransfersFilter, ITransfersSort>;

export type IGetTransfersApiResponse = IApiResponse<ITransfersResponse>;

export type ITransfersApiResponse = IApiResponse<{ process: ITransfersTransaction }>;
