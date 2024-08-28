import CardNumber from '../regexp/CardNumber';
import { RegExpValidator } from './RegExp';

export const CardNumberValidator = (required: boolean = false, trigger: string = 'blur', message: string = 'validation.invalid_card_number') =>
  RegExpValidator('validation.is_required', message, trigger, CardNumber, required);
