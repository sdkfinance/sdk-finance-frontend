export const getDecodedParams = (
  params: { [key: string]: string },
  [key, value]: [string, string],
): { [key: string]: any } => {
  const decodedValue = decodeURIComponent(value);

  try {
    return {
      ...params,
      [key]: JSON.parse(decodedValue),
    };
  } catch {
    return {
      ...params,
      [key]: decodedValue,
    };
  }
};
