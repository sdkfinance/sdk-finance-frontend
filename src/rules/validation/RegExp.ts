import { LocaleMessage } from 'vue-i18n';
import { i18n } from '@/i18n';
import { IRExp } from '@/types/interfaces';

export default (
  emptyLabel: string = 'validation.is_required',
  errorLabel: string,
  trigger: string = 'blur',
  regExp: IRExp[]|IRExp,
  required: boolean = true,
) => {
  const validationRule: object[] = [
    {
      validator(rule: any, value: string, callback: any) {
        const regExpArr = Array.isArray(regExp) ? regExp : [regExp];

        if (!value && !required) {
          callback();
        } else if (!value && required) {
          callback(new Error(i18n.t(emptyLabel).toString()));
        } else if (!regExpArr.filter((item) => value.match(item.expression)).length) {
          callback(new Error(i18n.t(errorLabel).toString()));
        } else {
          callback();
        }
      },
      trigger,
    },
  ];

  if (required) {
    validationRule.push({
      required,
      get message(): LocaleMessage {
        return i18n.t(emptyLabel);
      },
      trigger,
    });
  }

  return validationRule;
};
