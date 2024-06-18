import type { TCoinType } from '../../constants/coin-types';
import type { ISmartCardShort } from '../../types/smart-card';
import type { ICurrencyShort } from '../currencies/Currency.types';

export interface ICoin {
  serial: string;
  name: string;
  amount: number;
  availableAmount: number;
  futureAmount: number;
  heldAmount?: number;
  creditLimit: number;
  currency: ICurrencyShort;
  active: boolean;
  type: TCoinType;
  main?: boolean;
  accounting?: boolean;
  smartCards?: ISmartCardShort[];
  image?: string;
  organizationId?: string;
  organizationName?: string;
  technical?: boolean;
}

export type TCoinShort = Pick<ICoin, 'serial' | 'currency' | 'active' | 'type'>;
