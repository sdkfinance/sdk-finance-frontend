import { IPlainObject } from '@/types/interfaces';

export const getDeepKeys = (obj: IPlainObject) => {
  let keys: string[] = [];
  Object.keys(obj).forEach((key) => {
    keys.push(key);

    if (Array.isArray(obj[key])) {
      obj[key].forEach((field: IPlainObject, idx: number) => {
        const deepKeys: string[] = getDeepKeys(field);
        keys = keys.concat(deepKeys.map((deepKey: string) => `${key}.${idx}.${deepKey}`));
      });
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      const deepKeys: string[] = getDeepKeys(obj[key]);
      keys = keys.concat(deepKeys.map((deepKey: string) => `${key}.${deepKey}`));
    }

  });
  return keys;
};
