import WalletSerial from '../regexp/WalletSerial';
import RegExp from './RegExp';

export const WalletSerialValidator = (required: boolean = false, trigger: string = 'blur', message: string = 'validation.invalid_wallet_serial') => {
  if (import.meta.env.VUE_APP_CUSTOM_SERIAL_VALIDATION_ENABLED === 'true') {
    return RegExp('validation.is_required', message, trigger, WalletSerial, required);
  }

  return [];
};
