import { IRExp } from '@/types/interfaces';

export default {
  // /^((\+[0-9]{1,3})?-?[0-9]{2,3}-?[0-9]{2,3}-?[0-9]{2,3}-?[0-9]{2,3}-?)|([0-9]{11,13})$/im
  expression: /^([0-9]{11,13})$/im,
  name: 'phone',
} as IRExp;
