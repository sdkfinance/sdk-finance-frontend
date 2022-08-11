import { i18n } from '@/i18n';
import { VAT_REXP } from '@/rules/regexp/Vat';

export const VatValidator = (trigger: string = 'blur') => {
  const validator = (rule: any, value: string, callback: any): void => {
    if (!value) {
      callback();
    }
    if (value.length < 3 || value.length > 30) {
      callback(new Error(i18n.t('validation.vat_length').toString()));
    }

    const stateCode: string = value.substring(0, 2);
    if (stateCode in VAT_REXP && VAT_REXP[stateCode].test(value)) {
      callback();
    } else {
      callback(new Error(i18n.t('validation.vat').toString()));
    }
  };

  return {
    validator,
    trigger,
  };
};
