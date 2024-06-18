export const IDENTIFICATION_STATUS = {
  approved: 'approved',
  declined: 'declined',
} as const;

export type TIdentificationStatus = keyof typeof IDENTIFICATION_STATUS;
