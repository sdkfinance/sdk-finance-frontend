import { IPlainObject } from '@/types/interfaces';

export const clearEmptyValue = <T extends IPlainObject> (target: T, emptyTypes: any[] = [undefined, '', null]): T => {

  Object.keys(target).forEach((key: string) => {
    if (emptyTypes.includes(target[key])) {
      delete target[key];
    } else if (typeof target[key] === 'object') {
      clearEmptyValue(target[key], emptyTypes);
    }
  });

  return target;
};
