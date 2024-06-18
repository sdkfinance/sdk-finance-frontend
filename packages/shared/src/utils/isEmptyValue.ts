export const isEmptyValue = (value: any): value is undefined | null => {
  const isEmptyPrimitive = [null, undefined, ''].includes(value);
  const isEmptyArray = Array.isArray(value) && !value.length;
  const isObject = typeof value === 'object' && value !== null;
  const isEmptyObject = isObject && !Object.keys(value).length;

  return isEmptyPrimitive || isEmptyArray || isEmptyObject;
};
