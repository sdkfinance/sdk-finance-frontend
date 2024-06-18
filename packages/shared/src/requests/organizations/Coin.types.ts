import type { IApiResponse } from '../../types';
import type { ICoin } from '../types';

export type TProviderCoin = Pick<ICoin, 'serial' | 'type' | 'amount' | 'availableAmount' | 'currency'> & {
  collector: string;
};

export interface IGetCoinsResponse {
  coins: ICoin[];
}

export interface IGetProviderCoinsResponse {
  records: TProviderCoin[];
}

export type IGetCoinApiResponse = IApiResponse<IGetCoinsResponse>;

export type TGetProviderCoinsApiResponse = IApiResponse<IGetProviderCoinsResponse>;
