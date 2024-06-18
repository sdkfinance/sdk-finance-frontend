import type { TValueLabelRecord } from '../types';

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  STOPPED: 'STOPPED',
  PROCESSED: 'PROCESSED',
  CANCELLED: 'CANCELLED',
} as const;

export const SUBSCRIPTION_STATUSES_ARRAY = Object.entries(SUBSCRIPTION_STATUS).map(([status]) => ({
  label: `entity.badge_status.${status.toLowerCase()}`,
  value: status,
})) as TValueLabelRecord[];
