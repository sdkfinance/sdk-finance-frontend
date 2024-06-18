import type { IRExp } from '../../types';

export default {
  expression: /^[^0-9!@#$%^&*()_+\-={}[\]\\/|.,?"№;:~]+$/,
  name: 'name',
} as IRExp;
