import { IRExp } from '@/types/interfaces';

export default {
  expression: /^\+\([0-9]{3}\)([0-9]{2})-([0-9]{3})-([0-9]{2})-([0-9]{2})$/,
  name: 'phone',
} as IRExp;
