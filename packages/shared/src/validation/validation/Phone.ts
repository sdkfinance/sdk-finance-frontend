import Phone from '../regexp/Phone';
import RegExp from './RegExp';

export const PhoneValidator = (required: boolean = false, trigger: string = 'blur', message: string = 'validation.invalid_phone') =>
  RegExp('validation.is_required', message, trigger, Phone, required);
