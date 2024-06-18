import BIC from '../regexp/BIC';
import RegExp from './RegExp';

export const BicValidator = (required: boolean = false, trigger: string = 'blur', message: string = 'validation.invalid_bic') =>
  RegExp('validation.is_required', message, trigger, BIC, required);
