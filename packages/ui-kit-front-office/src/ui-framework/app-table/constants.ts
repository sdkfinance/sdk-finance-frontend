import { APP_COMPONENTS_SIZE } from '@sdk5/shared/constants';

export const MAX_ROWS_COUNT = 10;
export const DEFAULT_ROW_HEIGHT = 36;
export const TABLE_SCROLLING_NONE_CLASS_NAME = 'is-scrolling-none';
export const TABLE_CELL_PADDING = 12;
export const TABLE_SCROLLBAR_HEIGHT = 6;
export const APP_TABLE_SIZE = {
  [APP_COMPONENTS_SIZE.medium]: APP_COMPONENTS_SIZE.medium,
  [APP_COMPONENTS_SIZE.large]: APP_COMPONENTS_SIZE.large,
  [APP_COMPONENTS_SIZE.big]: APP_COMPONENTS_SIZE.big,
} as const;
export const TABLE_SIZE = {
  [APP_TABLE_SIZE.medium]: DEFAULT_ROW_HEIGHT,
  [APP_TABLE_SIZE.large]: 50,
  [APP_TABLE_SIZE.big]: 60,
} as const;
