export type TFilterRange = 'from' | 'to';

export interface IFilterRange {
  type: TFilterRange;
  param: string;
}

interface ISelectOption {
  label: string;
  value: any;
}

export type TSelectOptions =
  | ISelectOption[]
  | {
      [key: string]: string | number;
    };

type TFilteredSelectOptions = (options: { role: string }) => TSelectOptions;
export type TTableFilterValueArrayType = (string | number)[];
export type TTableFilterValue = boolean | string | number | TTableFilterValueArrayType | null;
export type TTableFilterLabelPosition = 'before' | 'after';
export type TTableFilterCheckFn = ({ role }: { role: string }) => boolean;
export type TFilterOptions = TSelectOptions | TFilteredSelectOptions;
export type TTableFilterValues = Record<ITableFilter['param'], TTableFilterValue>;

export type TTableFilterType = 'String' | 'Enumeration' | 'Select' | 'Multiple' | 'Date' | 'SelectDateRange' | 'Range' | 'Period';

export type TTableFilterRangeType = Extract<TTableFilterType, 'Date' | 'String'>;

export type TTableFilterRangeDirectionOption = {
  param: string;
  placeholder: string;
};

export type TTableFilterRangeOptions = {
  type: TTableFilterRangeType;
  from: TTableFilterRangeDirectionOption;
  to: TTableFilterRangeDirectionOption;
};

export interface ITableFilter {
  name: string;
  type: TTableFilterType;
  param: string;
  params?: string[];
  label?: string;
  labelPosition?: TTableFilterLabelPosition;
  placeholder?: string;
  /**
   * @deprecated
   */
  suffixIcon?: string;
  /**
   * @deprecated
   */
  range?: IFilterRange;
  folded?: boolean;
  options?: TFilterOptions;
  defaultValues?: TTableFilterValues;
  check?: TTableFilterCheckFn;
  rangeOptions?: TTableFilterRangeOptions;
}

export type TFilters = ITableFilter[];

export interface IFilterEmitValue {
  key: string;
  value: TTableFilterValue;
}
