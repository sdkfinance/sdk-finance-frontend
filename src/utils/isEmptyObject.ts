export const isEmptyObject = (obj: any) => {
  if (!(typeof obj === 'object' && obj !== null)) throw new Error('Argument is not an object');
  return Object.getOwnPropertyNames(obj).length === 0;
};
