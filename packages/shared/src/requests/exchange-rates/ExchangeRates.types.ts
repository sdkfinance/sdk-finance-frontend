import type { ICurrencyShort, TExchangeType, TOrganizationShort } from '@sdk5/shared/requests';
import type { IApiResponse } from '@sdk5/shared/types';

export type TExchangeRateDirection = TExchangeType;

export type TExchangeRatePair = Required<Pick<IExchangeRatesViewBody, 'inCurrencyId' | 'outCurrencyId'>>;
export interface IExchangeRatesViewBody {
  inCurrencyId?: string;
  outCurrencyId?: string;
  ratePairs?: TExchangeRatePair[];
}

// export interface IExchangeRatesExchanger {
//   id: string;
//   type: string;
//   name: string;
//   identificationStatus: string;
//   contract_info: {
//     id: string;
//     personType: string;
//     name: string;
//   };
// }

export interface IExchangeRatesRecord {
  id: string;
  inCurrency: ICurrencyShort;
  outCurrency: ICurrencyShort;
  rate: number;
  direction?: TExchangeRateDirection;
  exchanger: TOrganizationShort;
  reserve?: number;
  active?: boolean;
}

export interface ISetExchangeRatePayload {
  rate: number;
  inCurrencyId: string;
  outCurrencyId: string;
  direction: TExchangeRateDirection;
  active: boolean;
}

// export interface IExchangeRatesCreateBody {
//   inCoin: string;
//   outCoin: string;
//   inAmount: number | null;
// }

// export type IExchangeRatesCalculateData = ICalculatedCommission;

// export interface IExchangeRatesCalculateResponse {
//   in: IExchangeRatesCalculateData;
//   out: IExchangeRatesCalculateData;
// }

// export interface IExchangeRatesClientCoin {
//   name: string;
//   organizationId: string;
//   organizationName: string;
//   serial: string;
//   technical: boolean;
//   type: string;
// }

// export interface IExchangeRatesSuccess {
//   id: string;
//   createdAt: string;
//   updatedAt: string;
//   type: string;
//   status: string;
//   requestIdentifier: number;
//   requestStatus: string;
//   incomingAmount: number;
//   outgoingAmount: number;
//   destClientCoin: IExchangeRatesClientCoin;
//   destExchangerCoin: IExchangeRatesClientCoin;
//   srcClientCoin: IExchangeRatesClientCoin;
//   srcExchangerCoin: IExchangeRatesClientCoin;
//   transactions: ITransactionsTransaction[];
//   children: ITransactionsTransaction[];
//   errorMessage: string;
// }

export type IExchangeRatesApiResponse = IApiResponse<{ records: IExchangeRatesRecord[] }>;
// export type IExchangeRatesSuccessResponse = { process: IExchangeRatesSuccess };
// export type IExchangeRatesSuccessResponseApiResponse = IApiResponse<IExchangeRatesSuccessResponse>;
// export type IExchangeRatesCalculateApiResponse = IApiResponse<IExchangeRatesCalculateResponse>;
export type TSetExchangeRateResponse = IApiResponse<{ rate: IExchangeRatesRecord }>;
