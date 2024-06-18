<template>
  <div class="table-filters">
    <div class="table-filters__wrapper">
      <div class="table-filters__container">
        <div
          v-for="filter in simpleFilters"
          :key="filter.param"
          :class="getClasses(filter)">
          <app-filter-wrapper
            :filter-values="filterValues"
            :filter="filter"
            @change="changeEmit" />
        </div>

        <app-folded-filter
          v-if="foldedFilters.length"
          :filter-values="filterValues"
          :filters="foldedFilters"
          @change="changeEmit" />
      </div>
      <template v-if="isClearFiltersButtonVisible">
        <app-button
          size="small"
          outlined
          clear
          filters
          @click="clearFiltersButtonClickHandler">
          {{ $t('action.clear_all_filters') }}
        </app-button>
      </template>
    </div>

    <table-filters-view
      :filter-values="filterValues"
      :filter-chips="filterValuesChips"
      @change="changeEmit" />
  </div>
</template>

<script lang="ts">
import type { BaseTableFilter, FilterChipsItem } from '@sdk5/shared/filters';
import type { IFilterEmitValue, TTableFilterValues } from '@sdk5/shared/types';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import { AppButton } from '../ui-framework';
import AppFilterWrapper from './app-filter-wrapper.vue';
import AppFoldedFilter from './app-folded-filter.vue';
import TableFiltersView from './table-filters-view.vue';

export default defineComponent({
  name: 'TableFilters',
  components: {
    AppFoldedFilter,
    TableFiltersView,
    AppFilterWrapper,
    AppButton,
  },
  props: {
    filters: {
      type: Array as PropType<BaseTableFilter[]>,
      required: true,
    },
    filterValues: {
      type: Object as PropType<TTableFilterValues>,
      required: true,
    },
  },
  computed: {
    simpleFilters(): BaseTableFilter[] {
      return this.filters.filter((filter) => !filter.folded);
    },
    foldedFilters(): BaseTableFilter[] {
      return this.filters.filter((filter) => filter.folded);
    },
    filterValuesChips(): FilterChipsItem[] {
      return this.filters.map((filterInstance) => filterInstance.filterChips).flat();
    },
    isClearFiltersButtonVisible(): boolean {
      return Object.keys(this.filterValues).length > 0;
    },
  },
  methods: {
    getClasses(filter: BaseTableFilter): (string | object)[] {
      return [
        'table-filter',
        { 'table-filter--range': filter.range },
        { 'table-filter--range-from': filter.range?.type === 'from' },
        { 'table-filter--range-to': filter.range?.type === 'to' },
      ];
    },
    clearFiltersButtonClickHandler() {
      this.emitClearFiltersEvent();
    },
    changeEmit(value: IFilterEmitValue) {
      this.$emit('change', value);
    },
    emitClearFiltersEvent() {
      this.$emit('clear-filters');
    },
  },
});
</script>

<style lang="scss">
.table-filters {
  @apply grid grid-flow-row gap-y-[0.5rem];

  margin-bottom: 30px;

  &__wrapper,
  &__container,
  &__wrap,
  &__row {
    display: flex;
  }

  &__container {
    @apply gap-[0.25rem];
  }

  &__container,
  &__wrapper {
    @apply flex items-end flex-wrap select-none;
  }

  &__wrapper {
    @apply gap-[0.5rem];
  }
}

.table-filter-label {
  display: inline-block;
  font-weight: 600;
  font-size: 12px;
  line-height: 30px;
}
</style>
