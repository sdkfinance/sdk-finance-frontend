import type { TValueLabelRecord } from '../types';

export const QUALIFIER_ENUM = {
  amount: 'amount',
  quantity: 'quantity',
} as const;

export type TQualifierType = (typeof QUALIFIER_ENUM)[keyof typeof QUALIFIER_ENUM];
export type TQualifierValueLabelRecord<T extends string = TQualifierType> = TValueLabelRecord<T>;

export const QUALIFIER: {
  [K in TQualifierType]: TQualifierValueLabelRecord<K>;
} = {
  [QUALIFIER_ENUM.amount]: { label: 'entity.qualifier.amount', value: QUALIFIER_ENUM.amount },
  [QUALIFIER_ENUM.quantity]: { label: 'entity.qualifier.quantity', value: QUALIFIER_ENUM.quantity },
};

export const QUALIFIER_ARRAY = Object.values(QUALIFIER);
