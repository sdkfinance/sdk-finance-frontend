import { COIN_TYPES } from '@/constants';
import { TTopUpMethod } from '@/constants/top-up-methods';
import { IIssuer } from '@/services/requests/exchange-rates/ExchangeRates.types';
import { IPaymentProviderRecord } from '@/services/requests/gate/Gate.types';
import { IApiResponse } from '@/types/interfaces';

export type TCoinType = keyof typeof COIN_TYPES;

export interface IWalletRecord {
    serial: string;
    name: string;
    amount: number;
    availableAmount: number;
    futureAmount: number;
    heldAmount: number;
    creditLimit: number;
    issuer: IIssuer;
    active: boolean;
    type: TCoinType;
    main: boolean;
}

export interface IWalletBody {
  name: string;
  issuerId: string;
  type?: TCoinType;
}

export interface IWalletOwner {
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

export interface IValidateWalletResponse {
  status: string;
  message: string;
  issuer: IIssuer;
  owner: IWalletOwner;
}

export interface ITopUpForm {
    accountMethod: IPaymentProviderRecord | null;
    topUpMethod: TTopUpMethod;
    coin: string;
    amount: number | null;
    txType: 'TOPUP';
}

export interface IWalletGetByLoginPayload {
  login: string;
  currencyCode: string;
}

export interface IWalletGetByLoginResponse {
  status: string;
  message: string;
  serial: string;
}

export type IGetWalletResponse = { coins: IWalletRecord[] };
export type IGetWalletsApiResponse = IApiResponse<IGetWalletResponse>;
