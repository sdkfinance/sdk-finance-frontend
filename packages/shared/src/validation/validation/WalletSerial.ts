import WalletSerial from '../regexp/WalletSerial';
import { RegExpValidator } from './RegExp';

export const WalletSerialValidator = (required: boolean = false, trigger: string = 'blur', message: string = 'validation.invalid_wallet_serial') => {
  if (import.meta.env.VUE_APP_CUSTOM_SERIAL_VALIDATION_ENABLED === 'true') {
    return RegExpValidator('validation.is_required', message, trigger, WalletSerial, required);
  }

  return [];
};
