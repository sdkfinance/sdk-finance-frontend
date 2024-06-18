import dayjs from 'dayjs';

export const formatTime = (value: string): string => {
  if (value && dayjs(value).isValid()) {
    return dayjs(value).format('HH:mm');
  }

  return value;
};
