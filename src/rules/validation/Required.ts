import { LocaleMessage } from 'vue-i18n';
import { i18n } from '@/i18n';

const RequiredValidationRule = (message: string, trigger: string) => ({
  required: true,
  get message(): LocaleMessage {
    return i18n.t(message);
  },
  trigger,
});

export default RequiredValidationRule;
export const SimpleRequiredValidationRule = (trigger: string = 'blur') => RequiredValidationRule('validation.is_required', trigger);
export const OnChangeRequiredValidationRule = () => RequiredValidationRule('validation.is_required', 'change');
