import ExpDate from '@/rules/regexp/ExpDate';
import RegExp from '@/rules/validation/RegExp';

export const ExpDateValidator = (
  required: boolean = false,
  trigger: string = 'blur',
  message: string = 'validation.invalid_exp_date',
) => RegExp('validation.is_required', message, trigger, ExpDate, required);
