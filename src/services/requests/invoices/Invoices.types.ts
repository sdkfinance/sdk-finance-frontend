import { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '@/types/interfaces';

export interface IInvoicesFilter {
  statuses?: string[];
  identifier?: string;
  totalPrice?: number;
  direction?: string;
  createdByUserId?: string;
  name?: string;
}

export interface IInvoicesSort {
  createdAt?: string;
  totalPrice?: string;
  status?: string;
}

export interface IInvoicesRecord {
  identifier: string;
  name: string;
  createdAt: string;
  createdByUser: IInvoiceCreatedByUser;
  status: string;
  payer?: IInvoicePayer;
  payerContact: string;
  merchantName: string;
  totalPrice: number;
  expiresAt: string;
  issuer: IInvoiceIssuer;
  data: IInvoiceData;
  paymentCode?: string;
}

export interface IComputedInvoicesRecord extends IInvoicesRecord {
  title: string;
}

export interface IInvoiceCreatedByUser {
  id: string;
  name: string;
  profileOrganizationId: string;
}

export interface IInvoiceContractInfo {
  id: string;
  personType: string;
  name: string;
}

export interface IInvoicePayer {
  status?: string;
  message?: string;
  id: string;
  type: string;
  name: string;
  identificationStatus: string;
  'contract_info': IInvoiceContractInfo;
}

export interface IInvoiceIssuer {
  id: string;
  sn: string;
  currency: string;
  symbol: string;
}

export interface IInvoiceData {
  productCode: string;
  productPrice: number | null;
  description: string | null;
  count: number | null;
  terms?: string;
  invoiceName?: string;
}

export interface IInvoiceCreate extends IInvoiceData {
  templateName?: string;
  name: string;
  payerContact: string;
  recipientCoin: string;
  amount: number | null;
  expiresAt: string;
  createTemplateName: string;
}

export interface IInvoicesCommissionBlock {
  payerContact: string;
  commissionAmountPush: number;
  currency: string;
  senderAmountPush: number;
}

export interface IInvoiceCalculateCommissionOptions {
  payerContact: string;
  recipientCoin: string;
  amount: number | null;
}

export interface Issuer {
  id: string;
  sn: string;
  currency: string;
}

export interface IInvoiceCommission {
  status?: string;
  message?: string;
  transactionAmount: number;
  senderAmountPush: number;
  recipientAmountPush: number;
  commissionAmountPush: number;
  issuer: IInvoiceIssuer;
}

export interface IInvoiceDraft {
  name: string;
  amount: number | null;
  payerContact: string;
  recipientCoin: string;
  data: IInvoiceData;
  expiresAt: string;
}

export interface IInvoiceCreateOptions {
  name: string;
  payerContact: string;
  recipientCoin: string | null;
  data: IInvoiceData;
  amount: number | null;
  expiresAt: string | null;
}

export interface IInvoiceCalculatedCommission {
  transactionAmount: number;
  senderAmountPush: number;
  recipientAmountPush: number;
  commissionAmountPush: number;
  currency?: string;
  issuer: Issuer;
}

interface IInvoiceCreatedResponse {
  invoice: IInvoicesRecord[];
}

export interface ICreatedByUser {
  id: string;
  name: string;
  profileOrganizationId: string;
}

export interface IContractInfo {
  id: string;
  personType: string;
  name: string;
}

export interface IPayer {
  status: string;
  message: string;
  id: string;
  type: string;
  name: string;
  identificationStatus: string;
  'contract_info': IContractInfo;
}

export interface IInvoice {
  identifier: string;
  name: string;
  createdAt: string;
  createdByUser: ICreatedByUser;
  status: string;
  payer: IPayer;
  payerContact: string;
  merchantName: string;
  totalPrice: number;
  expiresAt: string;
  issuer: Issuer;
  data: IInvoiceData;
  paymentCode: string;
}

export interface IPayedInvoiceResponse {
  invoice: IInvoice;
}

export interface IInvoiceCoin {
  payerCoin: string | null;
}

type IInvoicesResponse = IPaginationResponse<IInvoicesRecord>;

export type IGetCreatedInvoiceResponse = IApiResponse<IInvoiceCreatedResponse>;

export type IGetInvoiceCommission = IApiResponse<IInvoiceCommission>;

export type IGetPayForInvoiceResponse = IApiResponse<IPayedInvoiceResponse>;

export type IGetCalcSpecInvoiceCommission = IApiResponse<IInvoiceCalculatedCommission>;

export type IInvoicesOptions = IPaginationRequestOptions<IInvoicesFilter, IInvoicesSort>;

export type IGetInvoicesApiResponse = IApiResponse<IInvoicesResponse>;
