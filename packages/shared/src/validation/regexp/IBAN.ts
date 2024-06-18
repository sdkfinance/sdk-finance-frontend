import type { IRExp } from '../../types';

export default {
  expression: /^[A-Z]{2}[0-9]{2}[a-zA-Z0-9]{1,30}$/,
  name: 'iban',
} as IRExp;
