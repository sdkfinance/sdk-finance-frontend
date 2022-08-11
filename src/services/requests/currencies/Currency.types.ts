export interface ICurrency {
  code: string;
  digitalCode: string;
  symbol: string;
  name: string;
  description: string;
}

export interface ICurrencyResponse {
  currencies: ICurrency[];
}
