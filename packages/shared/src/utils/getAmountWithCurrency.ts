export function getAmountWithCurrency(value: number | null, currentCurrency: string | null) {
  if (value === 0) {
    return `${value}`;
  }

  if (!value) {
    return null;
  }

  if (!currentCurrency) {
    return value;
  }

  return `${value} ${currentCurrency}`;
}
