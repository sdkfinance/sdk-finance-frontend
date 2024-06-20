import { extractRgbNumbers } from './extractRgbNumbers';

export const isRgbString = (color?: string): color is string => {
  if (!color) {
    return false;
  }

  const rgbNumbers = extractRgbNumbers(color);

  if (!rgbNumbers) {
    return false;
  }

  const [r, g, b] = rgbNumbers;

  return typeof r !== 'undefined' && r <= 255 && typeof g !== 'undefined' && g <= 255 && typeof b !== 'undefined' && b <= 255;
};
