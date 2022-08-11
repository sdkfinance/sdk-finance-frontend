import OnlyLetters from '@/rules/regexp/OnlyLetters';
import RegExp from '@/rules/validation/RegExp';

export const OnlyLetterValidator = (
  required: boolean = false,
  trigger: string = 'blur',
  message: string = 'validation.only_letters',
) => RegExp('validation.is_required', message, trigger, OnlyLetters, required);
