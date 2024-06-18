import numbro from 'numbro';

type IPlainObject = Record<string, any>;

numbro.setDefaults({ mantissa: 2, trimMantissa: true, roundingFunction: Math.floor });

export const getFormattedAmount = (value: number, formatOptions?: IPlainObject) => {
  if (formatOptions) {
    return numbro(value).format(formatOptions);
  }

  return numbro(value).format();
};
