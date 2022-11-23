import Address from '@/rules/regexp/Address';
import RegExp from '@/rules/validation/RegExp';

export const AddressValidator = (
  required: boolean = false,
  trigger: string = 'blur',
  message: string = 'validation.invalid_address',
) => RegExp('validation.is_required', message, trigger, Address, required);
