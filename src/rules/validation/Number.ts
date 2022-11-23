import { LocaleMessage } from 'vue-i18n';

import { i18n } from '@/i18n';

export const SimpleNumberValidationRule = (required: boolean = true, message: string = 'validation.invalid_integer_value') => [
  {
    validator(rule: any, value: string, callback: any) {
      const number = Number(value);
      const isNaN = Number.isNaN(number);
      const isPositive = number >= 0;

      if (isNaN) {
        callback(new Error(i18n.t(message).toString()));
      } else if (!isPositive) {
        callback(new Error(i18n.t('validation.invalid_integer_sign').toString()));
      } else {
        callback();
      }
    },
    trigger: 'blur',
  },
  {
    required,
    get message(): LocaleMessage {
      return i18n.t('validation.is_required');
    },
    trigger: 'blur',
  },
];
