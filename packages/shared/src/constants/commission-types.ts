import type { TValueLabelRecord } from '../types';

export const COMMISSION_TYPE_ENUM = {
  zero: 'zero',
  percent: 'percent',
  fixed: 'fixed',
  greater_of_fixed_or_percent: 'greater_of_fixed_or_percent',
  lesser_of_fixed_or_percent: 'lesser_of_fixed_or_percent',
  fixed_and_percent: 'fixed_and_percent',
} as const;

export type TCommissionType = (typeof COMMISSION_TYPE_ENUM)[keyof typeof COMMISSION_TYPE_ENUM];
export type TCommissionTypeValueLabelRecord<T extends string = TCommissionType> = TValueLabelRecord<T>;

export const COMMISSION_TYPES: {
  [K in TCommissionType]: TCommissionTypeValueLabelRecord<K>;
} = {
  [COMMISSION_TYPE_ENUM.zero]: {
    label: 'entity.commission_types.zero',
    value: COMMISSION_TYPE_ENUM.zero,
  },
  [COMMISSION_TYPE_ENUM.percent]: {
    label: 'entity.commission_types.percent',
    value: COMMISSION_TYPE_ENUM.percent,
  },
  [COMMISSION_TYPE_ENUM.fixed]: {
    label: 'entity.commission_types.fixed',
    value: COMMISSION_TYPE_ENUM.fixed,
  },
  [COMMISSION_TYPE_ENUM.greater_of_fixed_or_percent]: {
    label: 'entity.commission_types.greater_of_fixed_or_percent',
    value: COMMISSION_TYPE_ENUM.greater_of_fixed_or_percent,
  },
  [COMMISSION_TYPE_ENUM.lesser_of_fixed_or_percent]: {
    label: 'entity.commission_types.lesser_of_fixed_or_percent',
    value: COMMISSION_TYPE_ENUM.lesser_of_fixed_or_percent,
  },
  [COMMISSION_TYPE_ENUM.fixed_and_percent]: {
    label: 'entity.commission_types.fixed_and_percent',
    value: COMMISSION_TYPE_ENUM.fixed_and_percent,
  },
};

export const COMMISSION_TYPES_ARRAY = Object.values(COMMISSION_TYPES);
