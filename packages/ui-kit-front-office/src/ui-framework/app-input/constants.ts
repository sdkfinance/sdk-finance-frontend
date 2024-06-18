import { APP_COMPONENTS_SIZE } from '@sdk5/shared/constants';

import type { TAppInputSize } from './types';

export const APP_INPUT_SIZE = {
  [APP_COMPONENTS_SIZE.large]: APP_COMPONENTS_SIZE.large,
  [APP_COMPONENTS_SIZE.medium]: APP_COMPONENTS_SIZE.medium,
  [APP_COMPONENTS_SIZE.small]: APP_COMPONENTS_SIZE.small,
} as const;

export const APP_INPUT_SIZES = Object.values(APP_INPUT_SIZE);

export const APP_INPUT_TYPE = {
  text: 'text',
  textarea: 'textarea',
  number: 'number',
  password: 'password',
} as const;

export const appInputSizeValidator = (value: unknown): boolean => APP_INPUT_SIZES.includes(value as TAppInputSize);
