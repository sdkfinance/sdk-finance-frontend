import type { TValueLabelRecord } from '../types';

export const TIME_UNITS_ENUM = {
  per_transaction: 'per_transaction',
  per_day: 'per_day',
  per_week: 'per_week',
  per_month: 'per_month',
  per_quarter: 'per_quarter',
  per_year: 'per_year',
  per_life: 'per_life',
} as const;

export const TIME_UNITS = {
  [TIME_UNITS_ENUM.per_transaction]: 'entity.time_unit.per_transaction',
  [TIME_UNITS_ENUM.per_day]: 'entity.time_unit.per_day',
  [TIME_UNITS_ENUM.per_week]: 'entity.time_unit.per_week',
  [TIME_UNITS_ENUM.per_month]: 'entity.time_unit.per_month',
  [TIME_UNITS_ENUM.per_quarter]: 'entity.time_unit.per_quarter',
  [TIME_UNITS_ENUM.per_year]: 'entity.time_unit.per_year',
  [TIME_UNITS_ENUM.per_life]: 'entity.time_unit.per_life',
} as const;

export const TIME_UNITS_ARRAY = Object.keys(TIME_UNITS).map((key) =>
  // @ts-ignore
  ({ value: key, label: TIME_UNITS[key] }),
) as TTimeUnitsListItem[];

export type TTimeUnitsListItem = TValueLabelRecord<keyof typeof TIME_UNITS, string>;
export type TTimeUnit = keyof typeof TIME_UNITS;
