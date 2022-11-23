import { LocaleMessage } from 'vue-i18n';

import { i18n } from '@/i18n';
import { IPlainObject } from '@/types/interfaces';

export const SecondFieldMatchValidationRule = (sValue: string | null = null) => ({
  get message(): LocaleMessage {
    return i18n.t('validation.does_not_match');
  },
  validator(rule: IPlainObject, value: string, callback: Function) {
    if (value === '') {
      callback(new Error(i18n.t('validation.input_password_confirmation').toString()));
    } else if (value !== sValue) {
      callback(new Error(i18n.t('validation.does_not_match').toString()));
    } else {
      callback();
    }
  },
});
