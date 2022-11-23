import { LocaleMessage } from 'vue-i18n';

import { i18n } from '@/i18n';

export const MixMaxValidation = (min: number | null = null, max: number | null = null, trigger: string = 'blur'): any[] => {
  const rules = [];
  if (min !== null) {
    rules.push({
      min,
      get message(): LocaleMessage {
        return i18n.t('validation.min_allowed_length', { value: min });
      },
      trigger,
    });
  }
  if (max !== null) {
    rules.push({
      max,
      get message(): LocaleMessage {
        return i18n.t('validation.max_allowed_length', { value: max });
      },
      trigger,
    });
  }
  return rules;
};
