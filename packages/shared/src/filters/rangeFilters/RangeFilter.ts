import config from '../../config';
import type { TTableFilterRangeOptions, TTableFilterValue, TTableFilterValues } from '../../types';
import { formatDate, isEmptyValue } from '../../utils';
import type { TFormattedStringValue } from '../BaseTableFilter';
import { FilterChipsItem } from '../FilterChipsItem';
import { TableBaseRangeFilter } from './BaseRangeFilter';

export type TTableRangeFilterValue = [string, string];
export class TableRangeFilter extends TableBaseRangeFilter {
  private getRangeParams(): { fromParamName: string; toParamName: string } {
    const { param: toParamName } = this.rangeOptions!.to;
    const { param: fromParamName } = this.rangeOptions!.from;
    return {
      fromParamName,
      toParamName,
    };
  }

  protected getFromToValuesFromFormattedValues(formattedValues: TFormattedStringValue[]): { fromValue: string; toValue: string } {
    const [{ value: fromValue }, { value: toValue }] = formattedValues;
    return {
      fromValue,
      toValue,
    };
  }

  private isRangeValueValid(value: TTableFilterValue): value is TTableRangeFilterValue {
    if (!Array.isArray(value) || isEmptyValue(value) || value.length !== 2 || !value.every((item) => typeof item === 'string')) {
      return false;
    }

    return true;
  }

  private getFromToValueString({ fromValue, toValue }: ReturnType<typeof this.getFromToValuesFromFormattedValues>): string {
    return `${fromValue} ${config.emptyChar} ${toValue}`;
  }

  private getFormattedRangeValue(rangeValue: string): string {
    const formatFunctionsByFilterType: Record<TTableFilterRangeOptions['type'], (value: string) => string> = {
      Date: (value: string) => formatDate(value, false),
      String: (value: string) => value,
    };

    return formatFunctionsByFilterType[this.rangeOptions!.type](rangeValue);
  }

  protected override generateParamValueRecord(value: TTableFilterValue): TTableFilterValues {
    const valuesRecord: TTableFilterValues = {};

    if (!this.isRangeValueValid(value)) {
      return valuesRecord;
    }

    const [fromValue, toValue] = value;
    const { fromParamName, toParamName } = this.getRangeParams();

    if (fromValue) {
      valuesRecord[fromParamName] = fromValue;
    }

    if (toValue) {
      valuesRecord[toParamName] = toValue;
    }

    return valuesRecord;
  }

  protected override generateFilterChips(formattedValues: TFormattedStringValue[]): FilterChipsItem[] {
    if (!Array.isArray(formattedValues) || formattedValues.length === 0) {
      return [];
    }

    const { fromValue, toValue } = this.getFromToValuesFromFormattedValues(formattedValues);
    const valueString = this.getFromToValueString({ fromValue, toValue });
    return [
      new FilterChipsItem({
        filter: this,
        label: this.name,
        param: this.param,
        rawValue: valueString,
        value: valueString,
      }),
    ];
  }

  protected override getFormattedStringValues(rangeValues: TTableFilterValue): TFormattedStringValue[] {
    if (!this.isRangeValueValid(rangeValues)) {
      return [];
    }

    return rangeValues.map((rangeValue) => ({
      rawValue: rangeValue,
      value: this.getFormattedRangeValue(rangeValue),
    }));
  }

  protected override generateValueString(formattedValues: TFormattedStringValue[]): string {
    if (!Array.isArray(formattedValues) || formattedValues.length === 0) {
      return '';
    }

    const { fromValue, toValue } = this.getFromToValuesFromFormattedValues(formattedValues);

    return this.getFromToValueString({ fromValue, toValue });
  }
}
