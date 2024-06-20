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
export type TTableColumnPropType<T extends object = {}> = 'selection' | (keyof T | (string & {}));
interface ITableColumnsBase {
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
  noWrap?: boolean;
  columnType?: 'selection' | 'index' | 'expand';
  prefixFormatAmountProp?: string;
}
export type ITableColumn<T extends object = {}> = ITableColumnsBase &
  (
    | {
        prop: TTableColumnPropType<T>;
      }
    | {
        prop: 'action';
        actions?: TTableColumnAction[];
        actionsAlwaysVisible?: boolean;
      }
  );
