type TObj = { [key: string]: any };

const filterObjectValues = (filteredObj: TObj, [key, value]: [string, any]) => {
  const isFalsy: boolean = [null, undefined, ''].includes(value);
  const isEmptyArray: boolean = Array.isArray(value) && !value.length;

  if (isFalsy || isEmptyArray) {
    return filteredObj;
  }

  return {
    ...filteredObj,
    [key]: value,
  };
};

export default (obj: TObj): TObj => Object.entries(obj).reduce(filterObjectValues, {});
