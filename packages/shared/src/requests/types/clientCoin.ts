import type { ICoin } from './coin';

export type IClientCoin = Pick<
  ICoin,
  'serial' | 'organizationId' | 'organizationName' | 'technical' | 'type' | 'name' | 'accounting' | 'amount' | 'heldAmount' | 'currency'
>;

export type TTransactionCoin = IClientCoin;
