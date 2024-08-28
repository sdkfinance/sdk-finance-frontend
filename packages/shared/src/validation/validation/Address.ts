import Address from '../regexp/Address';
import { RegExpValidator } from './RegExp';

export const AddressValidator = (required: boolean = false, trigger: string = 'blur', message: string = 'validation.invalid_address') =>
  RegExpValidator('validation.is_required', message, trigger, Address, required);
