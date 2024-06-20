export const extractRgbNumbers = (rgbString: string) => {
  const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  const match = rgbString.match(rgbRegex);

  if (match) {
    const [, r, g, b] = match.map(Number);
    return [r, g, b];
  }

  return null;
};
