<template>
  <div
    v-if="valuesWithFilters.length"
    class="table-filters-view">
    <div class="table-filters-view__head">
      <span class="table-filters-view__label">
        {{ $t('filter.active_filters') }}:
      </span>
      <app-button
        size="small"
        class="table-filters-view__button"
        @click="clearAllFilters">
        {{ $t('action.clear_all_filters') }}
      </app-button>
    </div>
    <div class="table-filters-view__row">
      <template
        v-for="({ filter, value }, index) in valuesWithFilters">
        <template v-if="filter.type === 'Enumeration'">
          <app-tag
            v-for="(filterValue, valueIndex) of value"
            :key="filter.param + index + valueIndex"
            :label="filter.name"
            @delete="clearArrayValue(filter.param, filterValue)">
            {{ $t(filter.options[filterValue]) }}
          </app-tag>
        </template>

        <template v-else-if="filter.type === 'Multiple'">
          <app-tag
            v-for="(filterValue, valueIndex) of value"
            :key="filter.param + index + valueIndex"
            :label="filter.name"
            @delete="clearArrayValue(filter.param, filterValue)">
            {{ filterValue }}
          </app-tag>
        </template>

        <app-tag
          v-else
          :key="filter.param + index"
          :label="filter.name"
          @delete="clearFilterValue(filter.param)">
          {{ getFilterValue({ filter, value }) }}
        </app-tag>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { LocaleMessage } from 'vue-i18n';
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';
import { LocalStorageService } from '@/services/LocalStorageService';
import { formatDate } from '@/utils';
import AppTag from '@/components/ui-framework/app-tag.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import {
  ITableFilter,
  TFilterOptions,
  TFilters, TSelectOptions,
} from '@/types/interfaces/TableFilters.interface';

interface IFilterValue {
  key: string;
  value: (string | number)[] | null;
}

interface IValueWithFilter {
  filter: ITableFilter;
  value: any;
}

const getSelectOptions = (options: TFilterOptions): TSelectOptions => {
  if (typeof options === 'function') {
    return options({ role: LocalStorageService.get('role') });
  }

  return options;
};

const parsers: {
  [key: string]: (valueWIthFilter: IValueWithFilter) => string | number;
} = {
  Select: (valueWIthFilter) => {
    const { filter, value } = valueWIthFilter;
    const options = getSelectOptions(filter.options!);

    if (Array.isArray(options)) {
      return options.find(({ value: optionValue }) => {
        const optionParsedValue = JSON.stringify(optionValue);
        const filterParsedValue = JSON.stringify(value);

        return optionParsedValue === filterParsedValue;
      })?.label || '';
    }

    return options[value];
  },
  Date: ({ value }) => formatDate(value, false),
};

@Component({
  components: {
    AppTag,
    AppButton,
  },
})
export default class TableFiltersView extends Vue {

  @Prop({
    type: Array,
    required: true,
  }) readonly filters!: TFilters;

  @Prop({
    type: Object,
    required: true,
  }) readonly filterValues!: {
    [key: string]: (string | number)[] | string | number;
  };

  get valuesWithFilters(): IValueWithFilter[] {
    return Object.entries(this.filterValues).map(([param, value]) => {
      const valueFilter = this.filters.find((filter) => filter.param === param);

      return {
        filter: valueFilter!,
        value,
      };
    });
  }

  @Emit('change')
  emitChange(value: IFilterValue): IFilterValue {
    return value;
  }

  getFilterValue(valueWithFilter: IValueWithFilter): LocaleMessage {
    const { filter, value } = valueWithFilter;

    const parser = parsers[filter.type];

    if (!parser) {
      return value;
    }

    const parserResult: string | number = parser(valueWithFilter);

    return this.$t(`${parserResult}`);
  }

  clearFilterValue(param: string): void {
    this.emitChange({
      key: param,
      value: null,
    });
  }

  clearArrayValue(param: string, arrayValue: string | number): void {
    const values = this.filterValues[param];

    if (!Array.isArray(values)) {
      return;
    }

    const value = values.filter((filterValue) => filterValue !== arrayValue);

    this.emitChange({
      key: param,
      value: value.length ? value : null,
    });
  }

  clearAllFilters(): void {
    this.filters.forEach((filter: ITableFilter): void => {
      this.clearFilterValue(filter.param);
    });
  }

}
</script>

<style lang="scss">
.table-filters-view {
  margin-top: 24px;

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  &__label {
    font-weight: 600;
    font-size: 12px;
    color: #161515;
    margin-bottom: 12px;
  }

  &__button {
    align-self: center;
    margin-left: auto;
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    user-select: none;
  }

  .el-tag {
    margin: 0 4px 4px 0;
  }
}
</style>
