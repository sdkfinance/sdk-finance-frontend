import type { ICurrencyShort } from '../currencies';

export interface ICalculatedCommission {
  transactionAmount: number;
  senderAmountPush: number;
  recipientAmountPush: number;
  commissionAmountPush: number;
  currency: ICurrencyShort;
}
