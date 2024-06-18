import type { IRExp } from '../../types';

const DEFAULT_PHONE_PATTERN = /^\+?\d{9,15}$/;

export default {
  // /^((\+[0-9]{1,3})?-?[0-9]{2,3}-?[0-9]{2,3}-?[0-9]{2,3}-?[0-9]{2,3}-?)|([0-9]{11,13})$/im
  expression: new RegExp(import.meta.env?.VUE_APP_PHONE_VALIDATION_PATTERN ?? DEFAULT_PHONE_PATTERN),
  name: 'phone',
} as IRExp;
