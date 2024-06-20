export const rgbToHex = (rgb: string): string => {
  const rgbRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
  const match = rgb.match(rgbRegex);

  if (!match) {
    throw new Error('Invalid RGB string format');
  }

  const r = parseInt(match.at(1) ?? '', 10);
  const g = parseInt(match.at(2) ?? '', 10);
  const b = parseInt(match.at(3) ?? '', 10);

  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    throw new Error('RGB values must be in the range of 0 to 255');
  }

  const hex = (n: number) => n.toString(16).padStart(2, '0');

  return `#${hex(r)}${hex(g)}${hex(b)}`;
};
