import type { ComputedRef, Ref } from 'vue';
import { computed, ref } from 'vue';

import { translate } from '../i18n';
import type { ITableFilter, TTableFilterValue, TTableFilterValues } from '../types';
import { isEmptyValue } from '../utils';
import { FilterChipsItem } from './FilterChipsItem';

export type TFormattedStringValue = {
  rawValue: Required<NonNullable<TTableFilterValue>>;
  value: string;
};

export interface IBaseTableFilter extends ITableFilter {
  filterValueRecord: TTableFilterValues;
  displayValueString: string;
  filterChips: FilterChipsItem[];
}

export class BaseTableFilter implements IBaseTableFilter {
  static readonly MAX_VISIBLE_VALUES = 2;

  protected readonly MIN_VALUES_COUNT_TO_SHOW_CHIPS: number = 1;

  protected valueRef: Ref<TTableFilterValue> = ref(null);

  protected optionsRef: Ref<IBaseTableFilter['options']> = ref([]);

  protected displayValueStringRef: ComputedRef<string> = computed(() => this.generateValueString(this.formattedStringValues));

  protected filterValuesRecordRef: ComputedRef<TTableFilterValues> = computed(() => this.generateParamValueRecord(this.value));

  protected filterChipsRef: ComputedRef<FilterChipsItem[]> = computed(() => this.generateFilterChips(this.formattedStringValues));

  protected formattedStringValuesRef: ComputedRef<TFormattedStringValue[]> = computed(() => this.getFormattedStringValues(this.value));

  public folded: IBaseTableFilter['folded'];

  public defaultValues: IBaseTableFilter['defaultValues'];

  public label: IBaseTableFilter['label'];

  public labelPosition: IBaseTableFilter['labelPosition'];

  public name!: IBaseTableFilter['name'];

  public param!: IBaseTableFilter['param'];

  public params: IBaseTableFilter['params'];

  public placeholder: IBaseTableFilter['placeholder'];

  public type!: IBaseTableFilter['type'];

  public rangeOptions: IBaseTableFilter['rangeOptions'];

  public check: IBaseTableFilter['check'];

  /**
   * @deprecated
   */
  public range: IBaseTableFilter['range'];

  /**
   * @deprecated
   */
  public suffixIcon: IBaseTableFilter['suffixIcon'];

  constructor(ctor: ITableFilter) {
    this.setFilterOption(ctor);
  }

  protected setFilterOption(filterConfig: ITableFilter) {
    const { name, param, type, check, defaultValues, folded, label, labelPosition, options, params, placeholder, rangeOptions, range, suffixIcon } =
      filterConfig;
    this.defaultValues = defaultValues;
    this.label = label;
    this.labelPosition = labelPosition;
    this.param = param;
    this.params = params;
    this.type = type;
    this.placeholder = placeholder;
    this.rangeOptions = rangeOptions;
    this.name = name;
    this.check = check;
    this.folded = folded;
    this.optionsRef.value = options;
    this.suffixIcon = suffixIcon;
    this.range = range;
  }

  public updateOptions(filterConfig: ITableFilter): void {
    this.setFilterOption(filterConfig);
  }

  protected getFormattedStringValues(...args: any[]): TFormattedStringValue[];

  protected getFormattedStringValues(value: TTableFilterValue): TFormattedStringValue[] {
    if (isEmptyValue(value)) {
      return [];
    }

    if (Array.isArray(value)) {
      return value.map((valueItem) => ({
        value: valueItem.toString(),
        rawValue: valueItem,
      }));
    }

    return [
      {
        rawValue: value,
        value: value.toString(),
      },
    ];
  }

  protected generateFilterChips(formattedValues: TFormattedStringValue[]): FilterChipsItem[] {
    if (!Array.isArray(formattedValues) || formattedValues.length === 0) {
      return [];
    }

    if (formattedValues.length < this.MIN_VALUES_COUNT_TO_SHOW_CHIPS) {
      return [];
    }

    return formattedValues.map(
      ({ rawValue, value }) =>
        new FilterChipsItem({
          filter: this,
          label: this.label ?? this.name,
          param: this.param,
          value,
          rawValue,
        }),
    );
  }

  protected generateParamValueRecord(value: TTableFilterValue): TTableFilterValues {
    const valuesRecord: TTableFilterValues = {};

    if (this.param && !isEmptyValue(value)) {
      valuesRecord[this.param] = value;
    }

    return valuesRecord;
  }

  protected generateValueString(formattedStringValues: TFormattedStringValue[]): string {
    const translatedValues = formattedStringValues.map(({ value: formattedValue }) => translate(formattedValue).toString());

    if (translatedValues.length <= 1) {
      return translatedValues[0] ?? '';
    }

    if (translatedValues.length > BaseTableFilter.MAX_VISIBLE_VALUES) {
      const visibleValues = translatedValues.slice(0, BaseTableFilter.MAX_VISIBLE_VALUES);
      return `${visibleValues.join(', ')} +(${translatedValues.length - BaseTableFilter.MAX_VISIBLE_VALUES})`;
    }

    return translatedValues.join(', ');
  }

  public get displayValueString(): string {
    return this.displayValueStringRef.value;
  }

  public get options(): IBaseTableFilter['options'] {
    return this.optionsRef.value;
  }

  public set options(value: IBaseTableFilter['options']) {
    this.optionsRef.value = value;
  }

  public get value(): TTableFilterValue {
    return this.valueRef?.value;
  }

  public set value(value: TTableFilterValue) {
    this.valueRef.value = value;
  }

  public get filterValueRecord(): TTableFilterValues {
    return this.filterValuesRecordRef.value;
  }

  public get filterChips(): FilterChipsItem[] {
    return this.filterChipsRef.value;
  }

  protected get formattedStringValues(): TFormattedStringValue[] {
    return this.formattedStringValuesRef.value;
  }
}
