import IBAN from '../regexp/IBAN';
import RegExp from './RegExp';

export const IbanValidator = (required: boolean = false, trigger: string = 'blur', message: string = 'validation.invalid_iban') =>
  RegExp('validation.is_required', message, trigger, IBAN, required);
