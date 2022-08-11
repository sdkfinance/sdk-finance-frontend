import { IRExp } from '@/types/interfaces';

export default {
  expression: /\d{4}\s\d{4}\s\d{4}\s\d{4}/g,
  name: 'cardNumber',
} as IRExp;
