import type { APP_INPUT_SIZES, APP_INPUT_TYPE } from './constants';

export type TInputValue = string | number;
export type TAppInputValue = TInputValue;
export type TAppInputSize = (typeof APP_INPUT_SIZES)[number];
export type TAppInputType = (typeof APP_INPUT_TYPE)[keyof typeof APP_INPUT_TYPE];
export type TAppInputResizeProp = 'none' | 'both' | 'horizontal' | 'vertical';
