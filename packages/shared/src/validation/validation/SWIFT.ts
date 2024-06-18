import SWIFT from '../regexp/SWIFT';
import RegExp from './RegExp';

export const SwiftValidator = (trigger: string = 'blur', required: boolean = false, message: string = 'validation.invalid_swift') =>
  RegExp('validation.is_required', message, trigger, SWIFT, required);
