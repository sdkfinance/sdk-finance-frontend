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
