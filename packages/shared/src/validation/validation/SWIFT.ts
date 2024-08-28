import SWIFT from '../regexp/SWIFT';
import { RegExpValidator } from './RegExp';

export const SwiftValidator = (trigger: string = 'blur', required: boolean = false, message: string = 'validation.invalid_swift') =>
  RegExpValidator('validation.is_required', message, trigger, SWIFT, required);
