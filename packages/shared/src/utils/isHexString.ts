export const isHexString = (color?: string): color is string => {
  if (!color) {
    return false;
  }

  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
};
