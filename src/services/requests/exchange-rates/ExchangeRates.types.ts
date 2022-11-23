import { ITransactionsTransaction } from '@/services/requests/transactions/Transactions.types';
import { IApiResponse } from '@/types/interfaces';

export interface IExchangeRatesViewBody {
    inIssuerId: string;
    outIssuerId: string;
}

export interface IIssuer {
  id: string;
  sn: string;
  symbol?: string;
  currency: string;
}

export interface IExchangeRatesExchanger {
  status: string;
  message: string;
  id: string;
  type: string;
  name: string;
  identificationStatus: string;
  'contract_info': {
      id: string;
      personType: string;
      name: string;
  };
}

export interface IExchangeRatesRecord {
  id: string;
  inIssuer: IIssuer;
  outIssuer: IIssuer;
  rate: number;
  direction: string;
  exchanger: IExchangeRatesExchanger;
  reserve: number;
  active: boolean;
}

export interface ISetExchangeRatePayload {
  rate: number | null;
  inIssuerId: string;
  outIssuerId: string;
  direction: string;
  active: boolean;
}

export interface IExchangeRatesCreateBody {
  inCoin: string;
  outCoin: string;
  inAmount: number | null;
}

export interface IExchangeRatesCalculateData {
  transactionAmount: number;
  senderAmountPush: number;
  recipientAmountPush: number;
  commissionAmountPush: number;
  issuer: IIssuer;
}

export interface IExchangeRatesCalculateResponse {
  status: string;
  message: string;
  in: IExchangeRatesCalculateData;
  out: IExchangeRatesCalculateData;
}

export interface IExchangeRatesClientCoin {
  name: string;
  organizationId: string;
  organizationName: string;
  serial: string;
  technical: boolean;
  type: string;
}

export interface IExchangeRatesSuccess {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  status: string;
  requestIdentifier: number;
  requestStatus: string;
  incomingAmount: number;
  outgoingAmount: number;
  destClientCoin: IExchangeRatesClientCoin;
  destExchangerCoin: IExchangeRatesClientCoin;
  srcClientCoin: IExchangeRatesClientCoin;
  srcExchangerCoin: IExchangeRatesClientCoin;
  transactions: ITransactionsTransaction[];
  children: ITransactionsTransaction[];
  errorMessage: string;
}

export type IExchangeRatesResponse = { records: IExchangeRatesRecord[] };
export type IExchangeRatesApiResponse = IApiResponse<IExchangeRatesResponse>;
export type IExchangeRatesSuccessResponse = { process: IExchangeRatesSuccess };
export type IExchangeRatesSuccessResponseApiResponse = IApiResponse<IExchangeRatesSuccessResponse>;
export type IExchangeRatesCalculateApiResponse = IApiResponse<IExchangeRatesCalculateResponse>;
