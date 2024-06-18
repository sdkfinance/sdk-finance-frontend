import { moneyAmountFormat, prefixedMoneyAmount } from './moneyAmountFormat';

type TAmountTypes = 'prefixedAmount' | 'displayAmount';

const DEFAULT_PREFIX_SYMBOL: string = '$';

export function getDisplayAmount<T extends string | number>(value: T, type: TAmountTypes, formatNumberOptions?: Intl.NumberFormatOptions): string;
export function getDisplayAmount<T extends string | number>(value: T, type: TAmountTypes, symbol?: string): string;
export function getDisplayAmount<T extends string | number>(
  value: T,
  type: TAmountTypes = 'displayAmount',
  symbolOrFormatNumberOptions: Intl.NumberFormatOptions | string = DEFAULT_PREFIX_SYMBOL,
): string | T {
  if (!value) {
    return value;
  }

  const isOptionalParameterString = (optionalValue: unknown): optionalValue is string => typeof optionalValue === 'string';

  if (type === 'prefixedAmount') {
    return prefixedMoneyAmount(
      Number(value),
      isOptionalParameterString(symbolOrFormatNumberOptions) ? symbolOrFormatNumberOptions : DEFAULT_PREFIX_SYMBOL,
    );
  }

  if (type === 'displayAmount') {
    return moneyAmountFormat(Number(value), !isOptionalParameterString(symbolOrFormatNumberOptions) ? symbolOrFormatNumberOptions : undefined);
  }

  return value;
}
