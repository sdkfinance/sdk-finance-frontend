import { IPlainObject } from '@/types/interfaces/PlainObject.interface';

export type TFilterRange = 'from' | 'to';

export interface IFilterRange {
  type: TFilterRange;
  param: string;
}

interface ISelectOption {
  label: string;
  value: any;
}

export type TSelectOptions = ISelectOption[] | {
  [key: string]: string | number;
}

type TFilteredSelectOptions = (options: {
  role: string;
}) => TSelectOptions

export type TFilterOptions = TSelectOptions | TFilteredSelectOptions;

export interface ITableFilter {
  name: string;
  type: string;
  param: string;
  params?: string[];
  label?: string;
  labelPosition?: 'before' | 'after';
  placeholder?: string;
  suffixIcon?: string;
  range?: IFilterRange;
  folded?: boolean;
  options?: TFilterOptions;
  defaultValues?: IPlainObject;
  check?: ({ role }: { role: string }) => boolean;
}

export type TFilters = ITableFilter[];

export interface IFilterEmitValue {
  key: string;
  value: boolean | string | number | (string | number)[] | null;
}
