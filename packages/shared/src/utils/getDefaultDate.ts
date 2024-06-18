import dayjs from 'dayjs';

export type TDateType = 'date' | 'datetime' | 'time';

export const getDefaultDate = (value: string, type: TDateType = 'datetime'): string => {
  if (!value || !dayjs(value).isValid()) {
    return value;
  }

  if (type === 'datetime') {
    return dayjs(value).format('DD.MM.YYYY HH:mm:ss');
  }

  if (type === 'date') {
    return dayjs(value).format('DD.MM.YYYY');
  }

  if (type === 'time') {
    return dayjs(value).format('HH:mm:ss');
  }

  return value;
};
