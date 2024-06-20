import { isHexString } from './isHexString';

export const hexToRgb = (hex: string) => {
  if (!hex) {
    throw new Error('Hex is required');
  }

  if (!isHexString(hex)) {
    throw new Error('Hex is invalid');
  }

  let hexContent = hex.replace(/^#/, '');

  if (hexContent.length === 3) {
    hexContent = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }

  const bigint = parseInt(hexContent, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b] as const;
};
