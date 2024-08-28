import type { TValueLabelRecord } from '../../types';

export const ORGANIZATION_STATUS_ENUM = {
  none: 'none',
  pending: 'pending',
  approved: 'approved',
  declined: 'declined',
  review_required: 'review_required',
  not_available: 'not_available',
} as const;

export const ORGANIZATION_STATUS_LIST: TValueLabelRecord<TOrganizationStatus>[] = Object.entries(ORGANIZATION_STATUS_ENUM).map(([_, value]) => ({
  label: `entity.identification_status.${value}`,
  value,
}));

export type TOrganizationStatus = keyof typeof ORGANIZATION_STATUS_ENUM;
