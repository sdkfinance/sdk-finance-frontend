import { ENV_VARIABLES, extractRgbNumbers, hexToRgb, isHexString, isRgbString } from '@sdk5/shared';

interface IColorVariableRecord {
  variableValue?: string;
  defaultValue: string;
}
type TColorPropertyKey = `--${string}`;

const DEFAULT_PRIMARY_HOVER_COLOR_RGB = hexToRgb('#1449D0').join(' ');
const DEFAULT_PRIMARY_COLOR_RGB = hexToRgb('#1B55E9').join(' ');

const processColorVariable = (options: IColorVariableRecord & { propertyKey: TColorPropertyKey }) => {
  const { propertyKey, defaultValue, variableValue } = options;
  const root = document.documentElement;

  let colorRgbString = variableValue;

  if (isHexString(variableValue)) {
    colorRgbString = hexToRgb(variableValue).join(' ');
  }

  if (isRgbString(variableValue)) {
    const rgbNumbers = extractRgbNumbers(variableValue);

    if (rgbNumbers !== null) {
      colorRgbString = rgbNumbers.join(' ');
    }
  }

  root.style.setProperty(propertyKey, colorRgbString || defaultValue);
};

export const setupAppColors = () => {
  const colorVariablesMap = new Map<TColorPropertyKey, IColorVariableRecord>([
    ['--primary-color', { variableValue: ENV_VARIABLES.appPrimaryColor, defaultValue: DEFAULT_PRIMARY_COLOR_RGB }],
    ['--primary-hover-color', { variableValue: ENV_VARIABLES.appPrimaryHoverColor, defaultValue: DEFAULT_PRIMARY_HOVER_COLOR_RGB }],
  ]);
  [...colorVariablesMap.entries()].forEach(([propertyKey, variableRecord]) =>
    processColorVariable({
      propertyKey,
      ...variableRecord,
    }),
  );
};
