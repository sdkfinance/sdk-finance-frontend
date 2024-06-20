import type { IPlainObject } from '../types';

export const getProp = (object: IPlainObject, path: string | string[], defaultVal: any = ''): any => {
  const keys = Array.isArray(path) ? path : path.split('.');

  if (!keys[0]) {
    return undefined;
  }

  const result = object[keys[0]];

  if (result && keys.length > 1) {
    return getProp(result, keys.slice(1), defaultVal);
  }

  return result ?? defaultVal;
};
