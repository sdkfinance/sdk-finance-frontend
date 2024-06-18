import type { TDatePickerRangeObjectValue } from './types';

export const isDate = (value: unknown): value is Date => value instanceof Date;
export const isRangeValueObject = (value: unknown): value is TDatePickerRangeObjectValue =>
  !isDate(value) &&
  value !== null &&
  (value as TDatePickerRangeObjectValue).end !== undefined &&
  (value as TDatePickerRangeObjectValue).start !== undefined;
