export const BUSINESS_REQUEST_STATUS = {
  limited: 'limited',
  pending: 'pending',
  waiting: 'waiting',
  approved: 'approved',
  approved_by_accountant: 'approved_by_accountant',
  requires_confirmation: 'requires_confirmation',
  declined: 'declined',
  rejected: 'rejected',
  processed: 'processed',
  error: 'error',
  allowed_to_withdraw: 'allowed_to_withdraw',
} as const;

export type TBusinessRequestStatus = (typeof BUSINESS_REQUEST_STATUS)[keyof typeof BUSINESS_REQUEST_STATUS];
