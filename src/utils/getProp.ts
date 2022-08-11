import { IPlainObject } from '@/types/interfaces';

export const getProp = (object: IPlainObject, path: any, defaultVal: any = ''): any => {
  const keys = Array.isArray(path) ? path : path.split('.');
  const result = object[keys[0]];
  if (result && keys.length > 1) {
    return getProp(result, keys.slice(1), defaultVal);
  }

  return result ?? defaultVal;
};
