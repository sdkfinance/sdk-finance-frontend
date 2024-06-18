import type { APP_TOOLTIP_POSITIONS } from './constants';

export type TAppTooltipPosition = (typeof APP_TOOLTIP_POSITIONS)[keyof typeof APP_TOOLTIP_POSITIONS];
