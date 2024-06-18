import { translate } from '@sdk5/shared/i18n';
import dayjs from 'dayjs';

type IPlainObject = Record<string, any>;

const toDay = dayjs().format('DD.MM.YYYY');
const yesterday = dayjs().add(-1, 'day').format('DD.MM.YYYY');

let prevDate: string = '';

export const getSeparatorSpan = (data: IPlainObject): [number, number] => {
  if (data.columnIndex === 0 && data?.row?.isSeparateColumn) {
    return [1, 3];
  }

  if (data?.row?.isSeparateColumn) {
    return [0, 0];
  }

  return [1, 1];
};

export const getSeparatorColumnClass = (data: IPlainObject) => (data?.row?.isSeparateColumn ? 'is-separate' : '');

export const getSeparatorDatePostfix = (data: Date | string) => {
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
  const date = dayjs(item.createdAt).format('D MMMM') + getSeparatorDatePostfix(item.createdAt);

  if (prevDate === date) {
    return [...acc, item];
  }

  prevDate = date;
  return [...acc, { date, isSeparateColumn: true }, item];
};
