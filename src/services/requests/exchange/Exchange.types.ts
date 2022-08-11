import { IApiResponse } from '@/types/interfaces';
import { ITransactionsTransaction } from '@/services/requests/transactions/Transactions.types';
import { IIssuer } from '@/services/requests/exchange-rates/ExchangeRates.types';

export interface IExchangeCalculateResponse {
  topUpAmount: number;
  withdrawAmount: number;
  exchangeRate: {
    id: string;
    inIssuer: IIssuer;
    outIssuer: IIssuer;
    rate: number;
    organisationId: string;
  };
}

export interface IExchangePayload {
  inCoinSerial: string;
  outCoinSerial: string;
  exchangeType?: 'sell' | 'buy';
  amount: number | null;
}

export interface IExchangeSuccess {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  status: string;
  requestIdentifier: number;
  requestStatus: string;
  transactions: ITransactionsTransaction[];
  children: IExchangeSuccessChildren[];
  errorMessage: string;
}

export interface IExchangeSuccessChildren {
  children: [];
  coin: {
    issuer: IIssuer;
    name: string;
    organizationId: string;
    organizationName: string;
    serial: string;
    technical: boolean;
    type: string;
  };
  createdAt: string;
  id: string;
  outgoingAmount?: number;
  incomingAmount?: number;
  status: string;
  transactions: ITransactionsTransaction[];
  type: string;
  updatedAt: string;
}

export type IExchangeSuccessResponse = { process: IExchangeSuccess };
export type IExchangeSuccessResponseApiResponse = IApiResponse<IExchangeSuccessResponse>;
export type IExchangeCalculateApiResponse = IApiResponse<IExchangeCalculateResponse>;
