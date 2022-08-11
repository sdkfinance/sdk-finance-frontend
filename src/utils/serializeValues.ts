import { IPlainObject } from '@/types/interfaces';

export const serializeValues = (params: IPlainObject): IPlainObject => Object.entries(params).reduce((values, [key, value]) => ({
  ...values,
  [key]: typeof value === 'object' ? JSON.stringify(value) : value,
}), {});
