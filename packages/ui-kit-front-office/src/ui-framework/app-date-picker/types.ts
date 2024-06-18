import type { APP_DATE_PICKER_RANGE_EMIT_VALUE_TYPE } from './constants';

export type TVDatePickerRef = {
  inputValues: [string | null, string | null];
  hidePopover: () => void;
  showPopover: () => void;
  togglePopover: () => void;
  updateValue: (value: TDatePickerDateValue) => Promise<void>;
  focusDate: (date: Date | string) => Promise<void>;
};
export type TDatePickerDay = {
  /**
   * @description  Day number (1 - 31)
   */
  day: number;
  /**
   * @description  Day number from the end of the month (1 - 31)
   */
  dayFromEnd: number;
  /**
   * @description  Day weekday number (1:Sun - 7:Sat)
   */
  weekday: number;
  /**
   * @description  Weekday ordinal position from the start of the month (1 - 6)
   */
  weekdayOrdinal: number;
  /**
   * @description  Weekday ordinal position from the end of the month (1 - 6)
   */
  weekdayOrdinalFromEnd: number;
  /**
   * @description Month number (1 - 12)
   */
  month: number;
  /**
   * @description Week number from the start of the month (1 - 6)
   */
  week: number;
  /**
   * @description Week number from the end of the month (1 - 6)
   */
  weekFromEnd: number;
  /**
   * @description Week number of the year (usually 1 - 52)
   */
  weeknumber: number;
  /**
   * @description  ISO year week number of the year (usually 1 - 52)
   */
  isoWeeknumber: number;
  /**
   * @description
   */
  weekdayPosition: number;
  /**
   * @description
   */
  weekdayPositionFromEnd: number;

  /**
   * @description Year number.
   */
  year: number;

  /**
   * @description Date for this day
   */
  date: Date;
  /**
   * @description Result of calling date.getTime() for this day
   */
  dateTime: number;
  /**
   * @description Day lies in the currently active month.
   */
  inMonth: boolean;
  /**
   * @description Day lies in the month before the currently active month
   */
  inPrevMonth: boolean;
  /**
   * @description Day lies in the month after the currently active month
   */
  inNextMonth: boolean;
  /**
   * @description Original event that triggered the event
   */
  event: Event;
  /**
   * @description Day content HTML element
   */
  el: HTMLElement;
  id: string;
  label: string;
  ariaLabel: string;
  isDisabled: boolean;
  isFocusable: boolean;
  classes: (string | Record<string, unknown>)[];
  range: { start: Date; end: Date };
  dateFromTime: (...args: any[]) => unknown;
  popovers: unknown[];
  attributes: unknown[];
  attributesMap: Record<string, unknown>;
};
export type TDatePickerWeekNumberPosition = 'left' | 'left-outside' | 'range' | 'right-outside';
export type TDatePickerShowWeeksNumbers = boolean | TDatePickerWeekNumberPosition;
export type TDatePickerTitlePosition = 'left' | 'right' | 'center';
export type TDatePickerPopoverPlacement =
  | 'auto'
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right';
export type TDatePickerPopoverVisibility = 'click' | 'hover' | 'hover-focus' | 'focus' | 'visible' | 'hidden';
export type TDatePickerPopoverOptions = {
  keepVisibleOnInput: boolean;
  /**
   * @description When the popover appears
   */
  visibility: TDatePickerPopoverVisibility;
  /**
   * @description Where the popover appears
   */
  placement: TDatePickerPopoverPlacement;
  /**
   * @description strategy: positionFixed ? 'fixed' : 'absolute'
   */
  positionFixed: boolean;
  /**
   * @description Delay (ms) before popover is shown
   */
  showDelay: number;
  /**
   * @description Delay (ms) before popover is hidden
   * should be > 0
   */
  hideDelay: number;
  /**
   * @description Transition to use when displaying the popover
   */
  transition: 'slide-fade' | 'fade' | 'none' | '';
};

export type TDatePickerModelConfig = {
  type: 'auto' | 'string' | 'number';
  /**
   * @see https://v2.vcalendar.io/format-parse-dates.html#mask-tokens
   */
  mask: 'iso' | (string & {});
  /**
   * @see https://v2.vcalendar.io/format-parse-dates.html#mask-tokens
   * @description HH:mm:ss | 'now'
   */
  timeAdjust: 'now' | (string & {});
} & {
  start?: Partial<TDatePickerModelConfig>;
  end?: Partial<TDatePickerModelConfig>;
};

export type TDatePickerDateValue<T extends Date | string = Date> = number | string | T | null;
export type TDatePickerRangeObjectValue<T extends Date | string = Date> = {
  start: TDatePickerDateValue<T>;
  end: TDatePickerDateValue<T>;
};
export type TDatePickerDate<T extends Date | string = Date> = TDatePickerDateValue<T> | TDatePickerRangeObjectValue<T>;

export type TAppDatePickerRangeEmitValueType = keyof typeof APP_DATE_PICKER_RANGE_EMIT_VALUE_TYPE;
