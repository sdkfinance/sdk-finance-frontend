export const getDecodedParamValue = (value: any): any => {
  const decodedValue = decodeURIComponent(value);

  try {
    return JSON.parse(decodedValue);
  } catch {
    return decodedValue;
  }
};
