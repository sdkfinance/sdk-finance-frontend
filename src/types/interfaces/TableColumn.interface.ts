type TType = 'string' | 'date' | 'datetime' | 'time' | 'prefixedAmount' | 'displayAmount' | 'percent';
type TSubType = 'select' | 'percent' | 'fixed' | 'string';
export interface ITableColumn {
  prop: string;
  label?: string;
  width?: string;
  'min-width'?: string;
  fixed?: boolean;
  type?: TType;
  subType?: TSubType;
  sortable?: boolean;
  className?: string;
  isHide?: boolean;
  hideOnMobile?: boolean;
  withTooltip?: boolean;
  localePrefix?: string; // prefix for path to i18n variables
  align?: 'left' | 'center' | 'right';
}
