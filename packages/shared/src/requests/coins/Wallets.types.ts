import type { TCoinType, TTopUpMethod } from '../../constants';
import type { IApiResponse } from '../../types';
import type { ICurrency } from '../currencies';
import type { IPaymentProviderRecord } from '../gate';
import type { TOrganizationShort } from '../organizations';
import type { ICoin } from '../types';

export type IWalletRecord = ICoin;

export interface IWalletBody {
  name: string;
  currencyId: string;
  type: TCoinType;
  customSerial?: string;
}

export type IWalletOwner = TOrganizationShort;

export interface IValidateWalletResponse {
  currency: ICurrency;
  owner: TOrganizationShort;
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
  currencyId: string;
}

export interface IWalletGetByLoginResponse {
  serial: string;
}

export type IGetWalletResponse = { coins: ICoin[] };
export type IGetWalletsApiResponse = IApiResponse<IGetWalletResponse>;
