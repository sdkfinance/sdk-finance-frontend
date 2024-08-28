import BIC from '../regexp/BIC';
import { RegExpValidator } from './RegExp';

export const BicValidator = (required: boolean = false, trigger: string = 'blur', message: string = 'validation.invalid_bic') =>
  RegExpValidator('validation.is_required', message, trigger, BIC, required);
