export const categoryColors: string[] = ['#4AA9BE', '#F5C543', '#3C4DE2', '#3879BC', '#6258BA', '#ED89CE'];

export const chartColors: string[] = ['#F7931A', '#F44336', '#9B51E0', '#3F51B5', '#1B55E9', '#2D9CDB', '#56CCF2'];

export const getDynamicColor = (colors: string[]): Function => {
  let index = 0;
  return (): string => {
    if (index >= colors.length) {
      index = 0;
    }

    index += 1;
    return colors[index - 1];
  };
};
