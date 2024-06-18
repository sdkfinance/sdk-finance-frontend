import type { IRExp } from '../../types';

export default {
  expression: /[a-zA-Z]{4}[a-zA-Z]{2}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?/,
  name: 'swift',
} as IRExp;
