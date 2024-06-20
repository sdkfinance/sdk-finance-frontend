export const formatAmount = (amount: number) => {
  return Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(amount);
};
