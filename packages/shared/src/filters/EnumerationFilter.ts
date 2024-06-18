import type { TSelectOptions, TTableFilterValue } from '../types';
import { isEmptyValue } from '../utils';
import type { TFormattedStringValue } from './BaseTableFilter';
import { TableSelectFilter } from './SelectFilter';

export class TableEnumerationFilter extends TableSelectFilter {
  protected readonly MIN_VALUES_COUNT_TO_SHOW_CHIPS = 2;

  protected override getFormattedStringValues(options: { value: TTableFilterValue; filterOptions: TSelectOptions }): TFormattedStringValue[] {
    const { filterOptions, value } = options;

    if (isEmptyValue(value) || !Array.isArray(value)) {
      return [];
    }

    return value.map((valueItem) => ({
      rawValue: valueItem,
      value: this.findOptionLabelByValue({
        value: valueItem,
        filterOptions,
      }),
    }));
  }
}
