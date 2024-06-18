import type { IApiResponse } from '../../types';
import type { IExchangeRatesRecord } from '../exchange-rates';
import type { ITransactionsRecord } from '../transactions';

export type TExchangeType = 'sell' | 'buy';

export type IExchangeRate = IExchangeRatesRecord;

export interface IExchangeCalculateResponse {
  topUpAmount: number;
  withdrawAmount: number;
  exchangeRate: IExchangeRatesRecord;
}

export interface IExchangePayload {
  inCoinSerial: string;
  outCoinSerial: string;
  exchangeType?: TExchangeType;
  amount: number;
}

export type TExecuteExchangeReserveOperationRequestPayload = {
  coinSerial: string;
  amount: number;
  bankAccountId?: string;
  bankAccountNumber?: string;
  description?: string;
  customInformation?: string;
};

export type IExchangeSuccessResponse = { process: ITransactionsRecord };
export type IExchangeSuccessResponseApiResponse = IApiResponse<IExchangeSuccessResponse>;
export type IExchangeCalculateApiResponse = IApiResponse<IExchangeCalculateResponse>;
