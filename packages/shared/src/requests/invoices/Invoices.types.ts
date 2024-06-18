import type { TInvoiceStatus } from '../../constants';
import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '../../types';
import type { ICurrencyShort } from '../currencies';
import type { TOrganizationShort } from '../organizations/Organizations.types';
import type { ICalculatedCommission } from '../types';
import type { TUserRecordShort } from '../users/Users.types';

export type TInvoiceFilterTotalPrice = Required<Pick<IInvoicesFilter, 'currencyId'>> & {
  amount: number;
};

export interface IInvoicesFilter {
  statuses?: string[];
  identifier?: string;
  totalPrice?: number;
  currencyId?: string;
  direction?: string;
  createdByUserId?: string;
  name?: string;
}

export type TInvoicesFilterPayload = Pick<IInvoicesFilter, 'statuses' | 'identifier' | 'direction' | 'createdByUserId' | 'name'> & {
  totalPrice?: TInvoiceFilterTotalPrice;
};

export interface IInvoicesSort {
  createdAt?: string;
  totalPrice?: string;
  status?: string;
}

export interface IInvoicesRecord {
  identifier: string;
  name: string;
  createdAt: string;
  createdByUser: TUserRecordShort;
  status: TInvoiceStatus;
  payer?: TOrganizationShort;
  payerContact: string;
  merchantName: string;
  totalPrice: number;
  expiresAt: string;
  currency: ICurrencyShort;
  data: IInvoiceData;
  paymentCode?: string;
}

export interface IComputedInvoicesRecord extends IInvoicesRecord {
  title: string;
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

export interface IInvoicesCommissionBlock extends Pick<ICalculatedCommission, 'commissionAmountPush' | 'senderAmountPush'> {
  payerContact: string;
  currency: string;
}

export interface IInvoiceCalculateCommissionOptions {
  payerContact: string;
  recipientCoin: string;
  amount: number | null;
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
  templateName?: string;
  data: IInvoiceData;
  amount: number | null;
  expiresAt: string | null;
}

interface IInvoiceCreatedResponse {
  invoice: IInvoicesRecord;
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
  id: string;
  type: string;
  name: string;
  identificationStatus: string;
  contract_info: IContractInfo;
}

export interface IPayedInvoiceResponse {
  invoice: IInvoicesRecord;
}

export interface IInvoiceCoin {
  payerCoin: string | null;
}

type IInvoicesResponse = IPaginationResponse<IInvoicesRecord>;

export type IGetCreatedInvoiceResponse = IApiResponse<IInvoiceCreatedResponse>;

export type IGetInvoiceCommission = IApiResponse<ICalculatedCommission>;

export type IGetPayForInvoiceResponse = IApiResponse<IPayedInvoiceResponse>;

export type IGetCalcSpecInvoiceCommission = IApiResponse<ICalculatedCommission>;

export type IInvoicesOptions<F = TInvoicesFilterPayload> = IPaginationRequestOptions<F, IInvoicesSort>;

export type IGetInvoicesApiResponse = IApiResponse<IInvoicesResponse>;
