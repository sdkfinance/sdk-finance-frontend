import { LocaleMessage } from 'vue-i18n';

import { i18n } from '@/i18n';
import PasswordRule from '@/rules/regexp/PasswordRule';
import { IPlainObject } from '@/types/interfaces';

export const PasswordValidationRule = () => ({
  get message(): LocaleMessage {
    return i18n.t('validation.password');
  },
  validator(rule: IPlainObject, value: string, callback: Function) {
    if (value === '') {
      callback(new Error(i18n.t('validation.is_required').toString()));
    } else if (PasswordRule.expression.test(value)) {
      callback();
    } else {
      callback(new Error(i18n.t('validation.password').toString()));
    }
  },
});
