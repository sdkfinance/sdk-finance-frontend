import { TCoinType } from '@/services/requests/coins/Wallets.types';
import { ITransferBody, TTransferPaymentType } from '@/services/requests/transfers/Transfers.types';
import { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '@/types/interfaces';

export interface ITransferIssuer {
  id: string;
  sn: string;
  currency: string;
}

export interface ITransferSenderCoin {
  serial: string;
  name: string;
  amount: number;
  availableAmount: number;
  futureAmount: number;
  heldAmount: number;
  creditLimit: number;
  issuer: ITransferIssuer;
  active: boolean;
  type: TCoinType;
  main: boolean;
}

export interface ITransferRecipientCoin {
  serial: string;
  issuer: ITransferIssuer;
  active: boolean;
  type: TCoinType;
}

export interface ITransferTemplateRecord {
  id: string;
  type: 'TRANSFER' | 'INVOICE' | 'PURCHASE' | 'CART' | 'BANK_TRANSFER';
  name: string;
  amount: number;
  description: string;
  senderCoin: ITransferSenderCoin;
  recipientCoin: ITransferRecipientCoin;
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
  recipientPhoneNumber: string;
}

export interface ITransferTemplateSingleResponse {
  status: string;
  message: string;
  id: string;
  name: string;
  senderCoin: ITransferSenderCoin;
  recipientCoin: ITransferRecipientCoin;
  recipientPhoneNumber: string;
  amount: number;
  description: string;
}

export interface ITransferTemplateFilter {
  id?: string;
  name?: string;
  recipientPhoneNumber?: string;
  paymentToolType?: TTransferPaymentType;
  filterType?: string;
}

export interface ITransferTemplateSort {
  date?: string;
}

export interface ITransferTemplateBody extends ITransferBody{
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
