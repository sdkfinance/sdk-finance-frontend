<template>
  <div class="table-filters">
    <div class="table-filters__container">
      <div
        v-for="filter in simpleFilters"
        :key="filter.param"
        :style="filter.wrapperStyle"
        :class="getClasses(filter)">
        <div
          v-if="filter.label"
          class="table-filter-label">
          {{ $t(filter.label) }}
        </div>

        <app-filter-wrapper
          :filter-values="filterValues"
          :filter="filter"
          @change="changeEmit"/>
      </div>

      <app-folded-filter
        v-if="foldedFilters.length"
        :filter-values="filterValues"
        :filters="foldedFilters"
        @change="changeEmit"/>
    </div>

    <div class="table-filters__wrap">
      <table-filters-view
        :filter-values="filterValues"
        :filters="filters"
        @change="changeEmit"/>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Prop,
  Vue,
} from 'vue-property-decorator';

import AppFilterWrapper from '@/components/data-table/app-filter-wrapper.vue';
import AppFoldedFilter from '@/components/data-table/app-folded-filter.vue';
import TableFiltersView from '@/components/data-table/table-filters-view.vue';
import { IFilterEmitValue, ITableFilter, TFilters } from '@/types/interfaces/TableFilters.interface';

@Component({
  components: { AppFoldedFilter, TableFiltersView, AppFilterWrapper },
})
export default class TableFilters extends Vue {

  @Prop({
    type: Array,
    required: true,
  }) readonly filters!: TFilters;

  @Prop({
    type: Object,
    required: true,
  }) readonly filterValues!: object;

  get simpleFilters(): TFilters {
    return this.filters.filter((filter) => !filter.folded);
  }

  get foldedFilters(): TFilters {
    return this.filters.filter((filter) => filter.folded);
  }

  getClasses(filter: ITableFilter): (string | object)[] {
    return [
      'table-filter',
      { 'table-filter--range': filter.range },
      { 'table-filter--range-from': filter.range?.type === 'from' },
      { 'table-filter--range-to': filter.range?.type === 'to' },
    ];
  }

  @Emit('change')
  changeEmit(value: IFilterEmitValue): IFilterEmitValue {
    return value;
  }

}
</script>

<style lang="scss">
.table-filters {
  margin-bottom: 30px;

  .el-input .el-input__inner,
  .el-textarea__inner {
    height: 36px;
  }

  &__container,
  &__wrap,
  &__row {
    display: flex;
  }

  &__container {
    flex-wrap: wrap;
    align-items: flex-end;
    user-select: none;
  }

  &__wrap {
    flex-direction: column;
  }
}

.table-filter {
  margin: 0 6px 6px 0;
}

.table-filter-label {
  display: inline-block;
  font-weight: 600;
  font-size: 12px;
  line-height: 30px;
}
</style>
