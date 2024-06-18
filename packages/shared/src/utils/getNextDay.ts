export const getNextDay = (date: Date = new Date()): Date => {
  const dateCopy = new Date(date);
  dateCopy.setDate(dateCopy.getDate() + 1);
  return dateCopy;
};
