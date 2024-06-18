type IPlainObject = Record<string, any>;

export const serializeValues = (params: IPlainObject): IPlainObject =>
  Object.entries(params).reduce(
    (values, [key, value]) => ({
      ...values,
      [key]: typeof value === 'object' ? JSON.stringify(value) : value,
    }),
    {},
  );
