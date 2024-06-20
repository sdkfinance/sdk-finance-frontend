import type { EXPIRATION_TYPES, SUBSCRIPTION_STATUS, SUBSCRIPTION_TYPES } from '@sdk5/shared/constants';
import type { IApiResponse } from '@sdk5/shared/types';

export type TSubscriptionsType = keyof typeof SUBSCRIPTION_TYPES;
export type TExpirationType = keyof typeof EXPIRATION_TYPES;
export type TSubscriptionsStatus = keyof typeof SUBSCRIPTION_STATUS;

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
  expirationType: TExpirationType;
  amount?: number;
  count?: number;
  endDate?: string;
  recurringStartDate: string;
  type?: TSubscriptionsType;
  frequency?: number;
  templateId: string;
}

export type IGetSubscriptionResponse = { subscriptions: ISubscriptionRecord[] };
export type IGetSubscriptionApiResponse = IApiResponse<IGetSubscriptionResponse>;
