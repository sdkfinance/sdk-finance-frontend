import type { BaseTableFilter, IBaseTableFilter, TFormattedStringValue } from './BaseTableFilter';

interface IFilterChipsItem<T extends BaseTableFilter> extends Pick<IBaseTableFilter, 'param'>, Required<Pick<IBaseTableFilter, 'label'>> {
  value: string | number;
  rawValue: TFormattedStringValue['rawValue'];
  filter: T;
}

export class FilterChipsItem<T extends BaseTableFilter = BaseTableFilter> implements IFilterChipsItem<T> {
  readonly param: string;

  readonly value: string | number;

  readonly label: string;

  readonly filter: T;

  readonly rawValue: IFilterChipsItem<T>['rawValue'];

  constructor(ctor: IFilterChipsItem<T>) {
    const { param, value, label, filter, rawValue } = ctor;
    this.param = param;
    this.value = value;
    this.label = label;
    this.filter = filter;
    this.rawValue = rawValue;
  }
}
