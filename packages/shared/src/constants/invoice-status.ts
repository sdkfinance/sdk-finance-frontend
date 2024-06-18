export const INVOICE_STATUS_ENUM = {
  initiated: 'initiated',
  pending: 'pending',
  approved: 'approved',
  paid: 'paid',
  declined: 'declined',
  expired: 'expired',
  hidden: 'hidden',
} as const;

export type TInvoiceStatus = keyof typeof INVOICE_STATUS_ENUM;
