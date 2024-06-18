import dayjs from 'dayjs';

import type { TFormattedStringValue } from '../BaseTableFilter';
import { TableRangeFilter } from './RangeFilter';

export class TablePeriodFilter extends TableRangeFilter {
  protected override getFromToValuesFromFormattedValues(formattedValues: TFormattedStringValue[]): { fromValue: string; toValue: string } {
    const [{ rawValue: fromRawValue }, { rawValue: toRawValue }] = formattedValues;

    const fromValueString = dayjs(fromRawValue.toString()).format('DD MMM');
    const toValueString = dayjs(toRawValue.toString()).format('DD MMM');

    return {
      fromValue: fromValueString,
      toValue: toValueString,
    };
  }
}
