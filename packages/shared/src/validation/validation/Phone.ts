import Phone from '../regexp/Phone';
import { RegExpValidator } from './RegExp';

export const PhoneValidator = (required: boolean = false, trigger: string = 'blur', message: string = 'validation.invalid_phone') =>
  RegExpValidator('validation.is_required', message, trigger, Phone, required);
