<template>
  <div
    v-if="filterChips.length"
    class="table-filters-view">
    <template v-for="(chipsItem, index) in filterChips">
      <app-tag
        :key="chipsItem.param + index"
        tag-type="chips"
        :label="chipsItem.label"
        @delete="
          clearFilterValueHandler({
            filterType: chipsItem.filter.type,
            param: chipsItem.param,
            value: chipsItem.rawValue ?? chipsItem.value,
          })
        ">
        {{ $t(chipsItem.value.toString()) }}
      </app-tag>
    </template>
  </div>
</template>

<script lang="ts">
import type { BaseTableFilter, FilterChipsItem } from '@sdk5/shared/filters';
import type { IFilterEmitValue, TTableFilterValues } from '@sdk5/shared/types';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import { AppTag } from '../ui-framework';

export default defineComponent({
  name: 'TableFiltersView',
  components: {
    AppTag,
  },
  props: {
    filterValues: {
      type: Object as PropType<TTableFilterValues>,
      required: true,
    },
    filterChips: {
      type: Array as PropType<FilterChipsItem[]>,
      default: () => [],
    },
  },
  methods: {
    clearFilterValueHandler(options: {
      filterType: BaseTableFilter['type'];
      param: FilterChipsItem['param'];
      value: FilterChipsItem['value'] | Required<Pick<FilterChipsItem, 'rawValue'>>['rawValue'];
    }) {
      const { filterType, param, value } = options;

      if (filterType === 'Enumeration' || filterType === 'Multiple') {
        return this.clearArrayValue(param, value.toString());
      }

      return this.clearFilterValue(param.toString());
    },
    clearFilterValue(param: string): void {
      this.emitChange({
        key: param,
        value: null,
      });
    },
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
    },
    emitChange(value: IFilterEmitValue) {
      this.$emit('change', value);
    },
  },
});
</script>

<style lang="scss" scoped>
.table-filters-view {
  @apply flex items-center flex-wrap gap-[0.25rem] select-none;
}
</style>
