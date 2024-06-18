export const TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  DEFAULT: 'default',
} as const;

export const POSITION = {
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  TOP_RIGHT: 'top-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center',
  BOTTOM_RIGHT: 'bottom-right',
} as const;

export const EVENTS = {
  ADD: 'add',
  DISMISS: 'dismiss',
  UPDATE: 'update',
  CLEAR: 'clear',
  UPDATE_DEFAULTS: 'update_defaults',
} as const;

export const VT_NAMESPACE = 'vue-toast';

export type TType = (typeof TYPE)[keyof typeof TYPE];
export type TPosition = (typeof POSITION)[keyof typeof POSITION];
export type TEvents = (typeof EVENTS)[keyof typeof EVENTS];
