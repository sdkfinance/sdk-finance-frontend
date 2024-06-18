import type { TValueLabelRecord } from '../types';

export const COMMISSION_DIRECTION_ENUM = {
  IN: 'IN',
  OUT: 'OUT',
  SHARED: 'SHARED',
} as const;

export type TCommissionDirection = (typeof COMMISSION_DIRECTION_ENUM)[keyof typeof COMMISSION_DIRECTION_ENUM];
export type TCommissionDirectionValueLabelRecord<T = TCommissionDirection> = TValueLabelRecord<T>;
export const COMMISSION_DIRECTION: {
  [K in TCommissionDirection]: TCommissionDirectionValueLabelRecord<K>;
} = {
  [COMMISSION_DIRECTION_ENUM.IN]: { label: 'entity.commission_direction.IN', value: COMMISSION_DIRECTION_ENUM.IN },
  [COMMISSION_DIRECTION_ENUM.OUT]: { label: 'entity.commission_direction.OUT', value: COMMISSION_DIRECTION_ENUM.OUT },
  [COMMISSION_DIRECTION_ENUM.SHARED]: { label: 'entity.commission_direction.SHARED', value: COMMISSION_DIRECTION_ENUM.SHARED },
};

export const COMMISSION_DIRECTION_ARRAY = [COMMISSION_DIRECTION.IN, COMMISSION_DIRECTION.OUT];

export const COMMISSION_DIRECTION_WITH_SHARED_ARRAY = Object.values(COMMISSION_DIRECTION);
