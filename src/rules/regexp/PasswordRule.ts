import { IRExp } from '@/types/interfaces';

export default {
  expression: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
  name: 'password',
} as IRExp;
