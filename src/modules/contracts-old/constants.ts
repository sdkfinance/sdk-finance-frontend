import { TNumberRangeValidationRule } from '@/rules/validation/NumberRange';

export const amountRulesParams: TNumberRangeValidationRule[][number] = [
  'validation.invalid_integer_value',
  'validation.is_required',
  0,
  Number.MAX_SAFE_INTEGER,
  2,
  'validation.min_amount',
  'validation.max_amount',
  'blur',
  true,
];

export const percentRulesParams: TNumberRangeValidationRule[][number] = [
  'validation.invalid_integer_value',
  'validation.is_required',
  0,
  100,
  2,
  'validation.min_percent',
  'validation.max_percent',
  'blur',
  true,
];
