function addZeros(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

export function formatDate(
  date: string,
  withTime: boolean = true,
  yearFirst: boolean = false,
): string {
  const dateObj = new Date(date);

  if (dateObj.toString() === 'Invalid Date') return date;

  const fullYear = dateObj.getFullYear();
  const year = `${fullYear}`.substr(-2, 2);
  const day = addZeros(dateObj.getDate());
  const month = addZeros(dateObj.getMonth() + 1);

  let dateString = `${day}.${month}.${year}`;

  if (yearFirst) {
    dateString = `${fullYear}-${month}-${day}`;
  }

  if (withTime) {
    const hours = addZeros(dateObj.getHours());
    const minutes = addZeros(dateObj.getMinutes());
    const seconds = addZeros(dateObj.getSeconds());

    const time = `${hours}:${minutes}:${seconds}`;

    dateString = `${dateString} ${time}`;
  }

  return dateString;
}
