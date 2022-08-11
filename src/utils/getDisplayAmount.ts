import { moneyAmountFormat, prefixedMoneyAmount } from '@/utils/moneyAmountFormat';

type TAmountTypes = 'prefixedAmount' | 'displayAmount';
export const getDisplayAmount = <T>(value: T, type: TAmountTypes = 'displayAmount', symbol: string = '$'): string | T => {
  if (!value) {
    return value;
  }

  if (type === 'prefixedAmount') {
    return prefixedMoneyAmount(Number(value), symbol);
  }

  if (type === 'displayAmount') {
    return moneyAmountFormat(Number(value));
  }

  return value;
};
