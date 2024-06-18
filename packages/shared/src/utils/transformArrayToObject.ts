type IPlainObject = Record<string, any>;

export const transformArrayToObject = (arr: any[], getValue: any): IPlainObject =>
  arr.reduce((obj: IPlainObject, key: string): IPlainObject => {
    obj[key] = getValue ? getValue(key) : key;
    return obj;
  }, {});
