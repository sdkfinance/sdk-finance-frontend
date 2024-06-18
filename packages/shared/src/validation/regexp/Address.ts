import type { IRExp } from '../../types';

export default {
  expression: /^[^!@#$%^&*()_+={}[\]\\|?"№;:~]+$/,
  name: 'address',
} as IRExp;
