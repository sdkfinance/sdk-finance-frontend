export const getDisplayCardNumber = (cardNumber: string, symbol: string = '•', withSpace: boolean = false): string => {
  const { length } = cardNumber;
  const cardNumberEnd: string = cardNumber.slice(length - 4, length);
  const mask: string = ''.padStart(4, symbol);
  const space: string = withSpace ? ' ' : '';
  return `${mask}${space}${cardNumberEnd}`;
};
