import type { IRExp } from '../../types';

const DEFAULT_VALIDATION_PATTER_STRING = /^[A-Z]{2}\\d{2}[A-Z0-9]{1,30}$/;

export default {
  expression: new RegExp(import.meta.env.VUE_APP_CUSTOM_SERIAL_VALIDATION_PATTERN || DEFAULT_VALIDATION_PATTER_STRING),
  name: 'wallet_serial',
} as IRExp;
