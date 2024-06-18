export const TX_TYPES = {
  topup: 'TOPUP',
  issue_card: 'ISSUE_CARD',
  purchase: 'PURCHASE',
  redeem: 'REDEEM',
} as const;

export type TTxType = (typeof TX_TYPES)[keyof typeof TX_TYPES];
