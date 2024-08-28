import IBAN from '../regexp/IBAN';
import { RegExpValidator } from './RegExp';

export const IbanValidator = (required: boolean = false, trigger: string = 'blur', message: string = 'validation.invalid_iban') =>
  RegExpValidator('validation.is_required', message, trigger, IBAN, required);
