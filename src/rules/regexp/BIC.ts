import { IRExp } from '@/types/interfaces';

export default {
  expression: /[a-zA-Z]{4}[a-zA-Z]{2}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?/,
  name: 'bic',
} as IRExp;
