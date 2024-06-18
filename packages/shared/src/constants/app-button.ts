import { APP_COMPONENTS_SIZE } from './app-component-sizes';

export const APP_BUTTON_SIZE = {
  [APP_COMPONENTS_SIZE.big]: APP_COMPONENTS_SIZE.big,
  [APP_COMPONENTS_SIZE.large]: APP_COMPONENTS_SIZE.large,
  [APP_COMPONENTS_SIZE.medium]: APP_COMPONENTS_SIZE.medium,
  [APP_COMPONENTS_SIZE.small]: APP_COMPONENTS_SIZE.small,
} as const;

export const APP_BUTTON_SIZES = [...Object.values(APP_BUTTON_SIZE), 'mini'] as const;

export const APP_BUTTON_TYPES = {
  primary: 'primary',
  warning: 'warning',
  secondary: 'secondary',
} as const;
