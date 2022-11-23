import Phone from '@/rules/regexp/Phone';
import RegExp from '@/rules/validation/RegExp';

export const PhoneValidator = (
  required: boolean = false,
  trigger: string = 'blur',
  message: string = 'validation.invalid_phone',
) => RegExp('validation.is_required', message, trigger, Phone, required);
