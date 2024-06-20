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
  qrCodeMediaFileId?: string;
  qrCodeMediaFileLink?: string;
}

export interface IComputedInvoicesRecord extends IInvoicesRecord {
  title: string;
}

export interface IInvoiceData {
  productCode: string;
  productPrice: number;
  description: string;
  count: number;
  terms?: string;
  invoiceName?: string;
}

export interface IInvoiceCreate
  extends IInvoiceData,
    Pick<IInvoiceCreateOptions, 'name' | 'payerContact' | 'templateName' | 'amount' | 'recipientCoin' | 'expiresAt' | 'sendPaymentLink'> {
  createTemplateName: string;
}

export interface IInvoicesCommissionBlock
  extends Pick<ICalculatedCommission, 'commissionAmountPush' | 'senderAmountPush'>,
    Pick<IInvoiceCalculateCommissionOptions, 'payerContact'> {
  currency: string;
}

export type IInvoiceCalculateCommissionOptions = Pick<IInvoiceCreateOptions, 'payerContact' | 'recipientCoin' | 'amount'>;

export type IInvoiceDraft = Pick<IInvoiceCreateOptions, 'name' | 'amount' | 'payerContact' | 'recipientCoin' | 'expiresAt'> &
  Pick<IInvoicesRecord, 'data'>;

export interface IInvoiceCreateOptions {
  name: string;
  payerContact: string;
  recipientCoin: string;
  templateName?: string;
  data: IInvoiceData;
  amount: number;
  expiresAt: string;
  sendPaymentLink?: boolean;
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

export type TInvoiceInfo = {
  invoiceIdentifier: string;
  amount: number;
  currency: string;
  merchantName: string;
};
export type TGetQrInvoiceInfoResponse = IApiResponse<TInvoiceInfo>;
