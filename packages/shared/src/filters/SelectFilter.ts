import { isEqual } from 'lodash';
import type { ComputedRef } from 'vue';
import { computed } from 'vue';

import { LocalStorageService } from '../services';
import type { ITableFilter, TSelectOptions, TTableFilterValue } from '../types';
import { isEmptyValue } from '../utils';
import type { IBaseTableFilter, TFormattedStringValue } from './BaseTableFilter';
import { BaseTableFilter } from './BaseTableFilter';

export class TableSelectFilter extends BaseTableFilter {
  private filterOptionsRef: ComputedRef<TSelectOptions>;

  constructor(ctor: ITableFilter) {
    super(ctor);

    this.filterOptionsRef = computed(() => this.getSelectOptions(this.options));
    this.formattedStringValuesRef = computed(() => this.getFormattedStringValues({ value: this.value, filterOptions: this.filterOptions }));
  }

  protected override getFormattedStringValues(options: { value: TTableFilterValue; filterOptions: TSelectOptions }): TFormattedStringValue[] {
    const { value, filterOptions } = options;

    if (isEmptyValue(value)) {
      return [];
    }

    const valueLabel = this.findOptionLabelByValue({ filterOptions, value });

    if (!valueLabel) {
      return [];
    }

    return [
      {
        rawValue: value,
        value: valueLabel,
      },
    ];
  }

  protected findOptionLabelByValue(options: { value: TTableFilterValue; filterOptions: TSelectOptions }): string {
    const { filterOptions, value } = options;
    let selectOptionsString = '';

    if (Array.isArray(filterOptions)) {
      selectOptionsString = filterOptions.find(({ value: optionValue }) => isEqual(optionValue, value))?.label || '';
    } else {
      selectOptionsString = `${filterOptions[value as string]}`;
    }

    return selectOptionsString;
  }

  private getSelectOptions(options: IBaseTableFilter['options']): TSelectOptions {
    if (!options) {
      return [];
    }

    if (typeof options === 'function') {
      return options({ role: LocalStorageService.get('role') });
    }

    return options;
  }

  protected get filterOptions(): TSelectOptions {
    return this.filterOptionsRef.value;
  }
}
