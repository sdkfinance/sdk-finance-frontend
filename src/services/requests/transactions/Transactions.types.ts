import { IClientCoin } from '@/services/requests/bank-withdrawals/Withdrawal.interface';
import {
  IApiResponse,
  IPaginationRequestOptions,
  IPaginationResponse,
} from '@/types/interfaces';

export interface ITransactionsFilter {
  ids?: string[];
  types?: string[];
  statuses?: string[];
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

export interface ITransactionsSort {
  createdAt?: string;
  status?: string;
  type?: string;
}

type TIssuer = {
  currency: string;
  id: string;
  sn: string;
  symbol?: string;
}

export type TTarget = {
  issuer: TIssuer;
  name?: string;
  organizationId: string;
  organizationName: string;
  serial: string | number;
  technical: boolean;
  type: string;
}

export interface ITransactionsTransaction {
  amount: number;
  to: TTarget;
  from: TTarget;
  id: string;
  issuer: TIssuer;
  performedAt: string;
  type: string;
  updatedAt: string;
}

export interface ITransactionCoin {
  issuer: TIssuer;
  name: string;
  organizationId: string;
  organizationName: string;
  serial: string;
  technical: boolean;
  type: string;
}

export interface IOperationAmountDetails {
  senderGrossAmount: number;
  senderNetAmount: number;
  senderFee: number;
  recipientGrossAmount: number;
  recipientNetAmount: number;
  recipientFee: number;
}

export interface IRecipient {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface ITransactionsRecord {
  netAmount: number;
  children: ITransactionsRecord[];
  createdAt: string;
  updatedAt: string;
  description: string;
  id: string;
  to: TTarget;
  from: TTarget;
  clientCoin?: IClientCoin;
  requestIdentifier: number;
  requestStatus: string;
  status: string;
  posCompanyName?: string;
  categoryImageLink?: string;
  categoryName?: string;
  sender?: {
    email: string;
    fullName: string;
    phoneNumber: string;
  };
  transactions: ITransactionsTransaction[];
  type: string;
  amount: number;
  invoiceAmount: number;
  cashAmount: number;
  commission: number;
  coin: ITransactionCoin;
  incomingAmount: number;
  outgoingAmount: number;
  operationAmountDetails?: IOperationAmountDetails;
  recipient?: IRecipient;
  merchantCoinSerial?: string | number;
  invoiceIdentifier?: string;
}

export interface ITransactionRecordComputed extends ITransactionsRecord {
  detailsTitle?: string;
  title?: string;
  currencySymbol?: string;
  isCurrentUserAreRecipient?: boolean;
  color?: string;
  amountString?: string;
  amountDetailsString?: string | number;
  categoryString?: string;
  senderNameString?: string | null;
  recipientNameString?: string | null;
  grossAmountString?: string | number;
  netAmountString?: string | number;
  recipientFeeString?: string | number | null;
  senderFeeString?: string | number | null;
  recipientAccountSerialString?: string | number;
  commissionString?: string | number;
  accountNameString?: string;
  accountSerialString?: string | number;
  boughtAmountString?: string | null;
  soldAmountString?: string | null;
  invoiceIdString?: string | null;
  transactionIdString?: string | null;
}

export interface ITransactionResponse {
  process: ITransactionsRecord;
}

type ITransactionsResponse = IPaginationResponse<ITransactionsRecord>;

type ITransactionsComputedResponse = IPaginationResponse<ITransactionRecordComputed>;

export type ITransactionsOptions = IPaginationRequestOptions<ITransactionsFilter, ITransactionsSort>;

export type IGetTransactionsApiResponse = IApiResponse<ITransactionsResponse>;

export type IGetTransactionApiResponse = IApiResponse<ITransactionResponse>;

export type IGetTransactionsComputedApiResponse = IApiResponse<ITransactionsComputedResponse>;

export type ITransactionsSingleApiResponse = IApiResponse<{ process: ITransactionsRecord }>;
