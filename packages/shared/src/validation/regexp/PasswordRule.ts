import type { IRExp } from '../../types';

export default {
  expression: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
  name: 'password',
} as IRExp;
