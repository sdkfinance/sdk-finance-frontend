export const capitalizeText = <T>(s: T): T | string => {
  if (typeof s !== 'string') {
    return s;
  }

  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};
