export const ORGANIZATION_TYPE_ENUM = {
  individual: 'individual',
  merchant: 'merchant',
  support: 'support',
  cash_desk: 'cash_desk',
  system: 'system',
} as const;

export type TOrganizationType = keyof typeof ORGANIZATION_TYPE_ENUM;
