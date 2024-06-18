export const BUSINESS_PROCESS_STATUS = {
  limited: 'limited',
  waiting_for_approval: 'waiting_for_approval',
  pending: 'pending',
  declined: 'declined',
  processed: 'processed',
  error: 'error',
  rejected: 'rejected',
} as const;

export type TBusinessProcessStatus = (typeof BUSINESS_PROCESS_STATUS)[keyof typeof BUSINESS_PROCESS_STATUS];
