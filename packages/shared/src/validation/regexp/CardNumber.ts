import type { IRExp } from '../../types';

export default {
  expression: /\d{4}\s\d{4}\s\d{4}\s\d{4}/g,
  name: 'cardNumber',
} as IRExp;
