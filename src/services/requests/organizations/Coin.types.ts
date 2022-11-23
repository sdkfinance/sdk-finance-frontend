import { ISmartCardShort } from '@/services/requests/smart-cards/SmartCards.types';
import { IApiResponse } from '@/types/interfaces';

export interface ICoinIssuer {
  id: string;
  sn: string;
  currency: string;
  symbol: string;
}

export interface ICoin {
  serial: string;
  name: string;
  amount: number;
  availableAmount: number;
  futureAmount?: number;
  heldAmount?: number;
  creditLimit?: number;
  issuer: ICoinIssuer;
  smartCards?: ISmartCardShort[];
  active?: boolean;
  type?: string;
  main?: boolean;
  image?: string;
}

interface ICoinsResponse {
  coins: ICoin[];
}

export type IGetCoinApiResponse = IApiResponse<ICoinsResponse>;
