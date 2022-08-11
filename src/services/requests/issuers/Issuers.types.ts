export interface IIssuer {
    id?: string;
    currency?: {
      code: string;
      description: string;
      digitalCode: string;
      name: string;
      symbol: string;
    };
    sn?: string;
    snPrefix: string;
    currencyCode: string;
    name: string;
    description: string;
    active: boolean;
    orderNumber: number | null;
    orderQuote: number | null;
}

export interface IIssuerResponse {
  records: IIssuer[];
}
