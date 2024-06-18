import type { ICoin, IPaymentToolDetails, ITransferBody, TCoinShort, TPaymentToolDetailsType } from '@sdk5/shared/requests';
import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '@sdk5/shared/types';

export interface ITransferTemplateRecord {
  id: string;
  type: 'TRANSFER' | 'INVOICE' | 'PURCHASE' | 'CART' | 'BANK_TRANSFER';
  name: string;
  amount: number;
  description: string;
  senderCoin: ICoin;
  recipientCoin: TCoinShort;
  paymentToolDetails: IPaymentToolDetails;
  recipientPhoneNumber: string;
}

export interface ITransferTemplateSingleResponse {
  id: string;
  name: string;
  senderCoin: ICoin;
  recipientCoin: TCoinShort;
  recipientPhoneNumber: string;
  amount: number;
  description: string;
}

export interface ITransferTemplateFilter {
  id?: string;
  name?: string;
  recipientPhoneNumber?: string;
  paymentToolType?: TPaymentToolDetailsType;
  filterType?: string;
}

export interface ITransferTemplateSort {
  date?: string;
}

export interface ITransferTemplateBody extends ITransferBody {
  name: string;
}

export interface ITransferTemplateBodyByOperationId {
  name: string;
  amount: number;
  description: string;
  reusable: boolean;
}

export interface ITransferTemplateExecute {
  businessProcessId: string;
  businessProcessStatus: string;
  message: string;
  status: string;
  templateId: string;
}

export type IGetTransferTemplateResponse = { transferTemplates: ITransferTemplateRecord[] };
export type IGetTransferTemplateApiResponse = IApiResponse<IGetTransferTemplateResponse>;

export type ITransferTemplateOptions = IPaginationRequestOptions<ITransferTemplateFilter, ITransferTemplateSort>;
export type ITransferTemplateResponse = IPaginationResponse<ITransferTemplateRecord>;
export type ITransferTemplateExecuteResponse = IApiResponse<ITransferTemplateExecute>;
