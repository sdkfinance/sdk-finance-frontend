import OnlyLetters from '../regexp/OnlyLetters';
import RegExp from './RegExp';

export const OnlyLetterValidator = (required: boolean = false, trigger: string = 'blur', message: string = 'validation.only_letters') =>
  RegExp('validation.is_required', message, trigger, OnlyLetters, required);
