export const APP_COMPONENTS_SIZE = {
  large: 'large',
  big: 'big',
  medium: 'medium',
  small: 'small',
  ultraSmall: 'ultraSmall',
} as const;

export type TAppComponentSize = (typeof APP_COMPONENTS_SIZE)[keyof typeof APP_COMPONENTS_SIZE];

export const APP_COMPONENTS_SIZES = [
  APP_COMPONENTS_SIZE.large,
  APP_COMPONENTS_SIZE.big,
  APP_COMPONENTS_SIZE.medium,
  APP_COMPONENTS_SIZE.small,
] as Readonly<TAppComponentSize[]>;
