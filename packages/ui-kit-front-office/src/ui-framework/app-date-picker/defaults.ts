import type { TDatePickerModelConfig, TDatePickerPopoverOptions, TDatePickerTitlePosition } from './types';

export const DEFAULT_DATE_PICKER_POPOVER_OPTIONS: TDatePickerPopoverOptions = {
  visibility: 'focus',
  hideDelay: 1,
  showDelay: 0,
  placement: 'bottom-start',
  transition: 'slide-fade',
  positionFixed: false,
  keepVisibleOnInput: false,
};
export const DEFAULT_DATE_PICKER_MODEL_CONFIG: TDatePickerModelConfig = {
  type: 'string',
  mask: 'iso',
  timeAdjust: 'now',
};
export const DEFAULT_DATE_PICKER_INPUT_VALUE_FORMAT = 'YYYY-MM-DD';
export const DEFAULT_DATE_PICKER_TITLE_POSITION: TDatePickerTitlePosition = 'center';
export const DEFAULT_DATE_PICKER_INPUT_DEBOUNCE_DELAY = 500;
