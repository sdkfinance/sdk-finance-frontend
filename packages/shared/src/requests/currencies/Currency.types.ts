import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '../../types';

export interface ICurrency {
  id: string;
  snPrefix: string;
  active: boolean;
  code: string;
  digitalCode: string;
  symbol: string;
  name: string;
  description: string;
  fraction: number;
  isMain: boolean;
}

export interface ICurrencyViewFilter {
  names: string[];
  activationStatus: 'active' | 'inactive';
  text: string;
}

export interface ICurrencyShort extends Pick<ICurrency, 'id' | 'symbol' | 'code'> {
  sn: string;
}

export interface ICreateCurrency
  extends Partial<Pick<ICurrency, 'active' | 'fraction'>>,
    Pick<ICurrency, 'code' | 'digitalCode' | 'symbol' | 'name' | 'description' | 'snPrefix'> {}

export interface IUpdateCurrency extends Pick<ICreateCurrency, 'name' | 'description'>, Pick<ICurrency, 'active'> {}

export interface ICurrencyResponse {
  records: ICurrency[];
}

export type TSetMainCurrencyResponse = ICurrency;
export type TSetMainCurrencyApiResponse = IApiResponse<TSetMainCurrencyResponse>;
export type TViewCurrenciesRequestPayload = IPaginationRequestOptions<Partial<ICurrencyViewFilter>, any>;
export type TViewCurrenciesApiResponse = IApiResponse<IPaginationResponse<ICurrencyResponse>>;
