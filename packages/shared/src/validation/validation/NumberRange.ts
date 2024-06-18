import { i18n } from '../../i18n';

export const NumberRangeValidationRule = (
  formatLabel: string,
  requiredLabel: string,
  min: number,
  max: number,
  decimalPlaces: number,
  minLabel: string,
  maxLabel: string,
  trigger: string,
  required: boolean = false,
) => {
  const rules: any[] = [];

  if (required) {
    rules.push({ required: true, message: i18n.t(requiredLabel), trigger });
  }

  rules.push({
    validator(rule: any, value: string, callback: any) {
      const number = +value;

      if (Number.isNaN(number)) {
        callback(new Error(i18n.t(formatLabel).toString()));
      } else if (value.toString().split('.')[1] && value.toString().split('.')[1].length > decimalPlaces) {
        callback(new Error(i18n.t(formatLabel).toString()));
      } else if (max !== null && number > max) {
        callback(new Error(i18n.t(maxLabel, { value: max.toFixed(decimalPlaces) }).toString()));
      } else if (min !== null && number < min) {
        callback(new Error(i18n.t(minLabel, { value: min.toFixed(decimalPlaces) }).toString()));
      } else {
        callback();
      }
    },
    trigger,
  });

  return rules;
};
export const SimpleNumberRangeValidationRule = (
  formatLabel: string = 'validation.invalid_value',
  requiredLabel: string = 'validation.is_required',
  min: number = 0.01,
  max: number = Number.MAX_SAFE_INTEGER,
) =>
  NumberRangeValidationRule(
    formatLabel,
    requiredLabel,
    min ?? 0.01,
    max ?? Number.MAX_SAFE_INTEGER,
    2,
    'validation.min_amount',
    'validation.max_amount',
    'blur',
    true,
  );

export type TNumberRangeValidationRule = Parameters<typeof NumberRangeValidationRule>;
export type TSimpleNumberRangeValidationRule = Parameters<typeof SimpleNumberRangeValidationRule>;
