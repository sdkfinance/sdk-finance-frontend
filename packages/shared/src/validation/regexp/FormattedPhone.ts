import type { IRExp } from '../../types';

export default {
  expression: /^\+\([0-9]{3}\)([0-9]{2})-([0-9]{3})-([0-9]{2})-([0-9]{2})$/,
  name: 'phone',
} as IRExp;
