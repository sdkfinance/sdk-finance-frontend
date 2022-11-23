import dayjs from 'dayjs';

import { translate } from '@/i18n';
import { IPlainObject } from '@/types/interfaces';

const toDay = dayjs().format('DD.MM.YYYY');
const yesterday = dayjs().add(-1, 'day').format('DD.MM.YYYY');

let prevDate: string = '';

export const getDatePostfix = (data: Date) => {
  const date = dayjs(data).format('DD.MM.YYYY');

  if (toDay === date) {
    return `, ${translate('table.label.today')}`;
  }

  if (yesterday === date) {
    return `, ${translate('table.label.yesterday')}`;
  }

  return '';
};

export const addSeparator = (acc: IPlainObject[], item: IPlainObject): IPlainObject[] => {
  const date = dayjs(item.createdAt).format('D MMMM') + getDatePostfix(item.createdAt);

  if (prevDate === date) {
    return [...acc, item];
  }

  prevDate = date;
  return [...acc, { date, isSeparateColumn: true }, item];
};
