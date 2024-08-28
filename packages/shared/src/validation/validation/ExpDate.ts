import ExpDate from '../regexp/ExpDate';
import { RegExpValidator } from './RegExp';

export const ExpDateValidator = (required: boolean = false, trigger: string = 'blur', message: string = 'validation.invalid_exp_date') =>
  RegExpValidator('validation.is_required', message, trigger, ExpDate, required);
