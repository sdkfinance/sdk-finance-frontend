import type { IRExp } from '../../types';

export default {
  expression: /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/g,
  name: 'expDate',
} as IRExp;
