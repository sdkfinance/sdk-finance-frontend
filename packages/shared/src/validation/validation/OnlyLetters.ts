import OnlyLetters from '../regexp/OnlyLetters';
import { RegExpValidator } from './RegExp';

export const OnlyLetterValidator = (required: boolean = false, trigger: string = 'blur', message: string = 'validation.only_letters') =>
  RegExpValidator('validation.is_required', message, trigger, OnlyLetters, required);
