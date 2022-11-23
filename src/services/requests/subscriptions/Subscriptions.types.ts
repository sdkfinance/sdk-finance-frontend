import { EXPIRATION_TYPES, SUBSCRIPTION_TYPES } from '@/constants';
import { IApiResponse } from '@/types/interfaces';

export type TSubscriptionsType = keyof typeof SUBSCRIPTION_TYPES;
export type TExpirationType = keyof typeof EXPIRATION_TYPES;
export type TSubscriptionsStatus = 'ACTIVE' | 'STOPPED' | 'PROCESSED' | 'CANCELLED';

export interface ISubscriptionExpirationConfig {
  type: TExpirationType;
  amount: number;
  count: number;
  expirationDate: Date;
}

export interface ISubscriptionTemplate {
  id: string;
  type: 'TRANSFER' | 'INVOICE' | 'PURCHASE' | 'CART' | 'BANK_TRANSFER';
  name: string;
  amount: number;
  description: string;
  reusable: boolean;
  regular: boolean;
}

export interface ISubscriptionRecord {
  id: string;
  name: string;
  expirationConfig: ISubscriptionExpirationConfig;
  recurringStartDate: Date;
  type: TSubscriptionsType;
  frequency: number;
  templateDto: ISubscriptionTemplate;
  subscriptionStatus: TSubscriptionsStatus;
}

export interface ISubscriptionsCreateBody {
  name: string;
  expirationType: TExpirationType | null;
  amount?: number | null;
  count?: number | null;
  endDate?: string;
  recurringStartDate: string;
  type: TSubscriptionsType | null;
  frequency: number | null;
  templateId: string;
}

export type IGetSubscriptionResponse = { subscriptions: ISubscriptionRecord[] };
export type IGetSubscriptionApiResponse = IApiResponse<IGetSubscriptionResponse>;
