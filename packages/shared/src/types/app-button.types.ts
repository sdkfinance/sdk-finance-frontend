import type { APP_BUTTON_SIZES, APP_BUTTON_TYPES } from '../constants';

export type TAppButtonSize = (typeof APP_BUTTON_SIZES)[number];
export type TAppButtonType = keyof typeof APP_BUTTON_TYPES;
export type TAppButtonNativeType = 'button' | 'reset' | 'submit';
