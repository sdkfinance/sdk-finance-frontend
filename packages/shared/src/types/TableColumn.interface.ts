import type { TableColumn } from 'element-ui';

import type { TAppButtonSize, TAppButtonType } from './app-button.types';

type TType = 'string' | 'date' | 'datetime' | 'time' | 'prefixedAmount' | 'displayAmount' | 'percent';
type TSubType = 'select' | 'percent' | 'fixed' | 'string';
export type TTableColumnAction = {
  actionFn: (...args: any[]) => void;
  label: string | ((...args: any) => string);
  isDisabled?: boolean | ((...args: any) => boolean);
  icon?: string;
  visible?: boolean | ((...args: any[]) => boolean);
  buttonOptions?: {
    type?: TAppButtonType;
    outlined?: boolean;
    size?: TAppButtonSize;
  };
};
export interface ITableColumn {
  prop: 'action' | 'selection' | (string & {});
  label?: string;
  width?: string;
  'min-width'?: string;
  fixed?: TableColumn['fixed'];
  type?: TType;
  subType?: TSubType;
  sortable?: boolean;
  className?: string;
  isHide?: boolean;
  hideOnMobile?: boolean;
  withTooltip?: boolean;
  localePrefix?: string; // prefix for path to i18n variables
  align?: TableColumn['align'];
  resizable?: boolean;
  /**
   * @description Works only with 'action' column
   */
  actions?: TTableColumnAction[];
  actionsAlwaysVisible?: boolean;
  noWrap?: boolean;
  columnType?: 'selection' | 'index' | 'expand';
}
