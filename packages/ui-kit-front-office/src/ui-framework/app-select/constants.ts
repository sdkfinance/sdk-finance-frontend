import { APP_COMPONENTS_SIZE } from '@sdk5/shared/constants';

export const APP_SELECT_SIZES = [APP_COMPONENTS_SIZE.large, APP_COMPONENTS_SIZE.medium, APP_COMPONENTS_SIZE.small];
export const APP_SELECT_SIZE: {
  [K in keyof Pick<typeof APP_COMPONENTS_SIZE, 'large' | 'medium' | 'small'>]: K;
} = {
  large: 'large',
  medium: 'medium',
  small: 'small',
} as const;
