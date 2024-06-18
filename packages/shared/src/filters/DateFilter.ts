import type { TTableFilterValue } from '../types';
import { formatDate, isEmptyValue } from '../utils';
import type { TFormattedStringValue } from './BaseTableFilter';
import { BaseTableFilter } from './BaseTableFilter';

export class TableDateFilter extends BaseTableFilter {
  protected override getFormattedStringValues(value: TTableFilterValue): TFormattedStringValue[] {
    if (isEmptyValue(value)) {
      return [];
    }

    return [
      {
        value: formatDate(value.toString(), false),
        rawValue: value,
      },
    ];
  }
}
