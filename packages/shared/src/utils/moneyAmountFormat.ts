export const moneyAmountFormat = (value: number, options: Intl.NumberFormatOptions = {}, locale = 'en-US') =>
  new Intl.NumberFormat(locale, { minimumFractionDigits: 2, ...options }).format(value);

export const prefixedMoneyAmount = (value: number, symbol: string = '') => `${symbol}${moneyAmountFormat(value)}`;
