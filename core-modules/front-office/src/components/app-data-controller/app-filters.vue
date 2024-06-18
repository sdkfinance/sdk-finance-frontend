<template>
  <div>
    <app-filter-wrapper
      v-for="filter in filters"
      :key="filter.param"
      :filter="filter"
      :filter-values="filterValues"
      @change="onFilterChange" />
  </div>
</template>

<script lang="ts">
import type { BaseTableFilter } from '@sdk5/shared/filters';
import type { IFilterEmitValue, TTableFilterValues } from '@sdk5/shared/types';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

import AppFilterWrapper from './app-filter-wrapper.vue';

@Component({
  components: {
    AppFilterWrapper,
  },
})
export default class AppFilters extends Vue {
  @Prop({
    type: Array as PropType<BaseTableFilter[]>,
    default: () => [],
  })
  readonly filters!: BaseTableFilter[];

  @Prop({
    type: Object as PropType<TTableFilterValues>,
    default: () => ({}),
  })
  readonly filterValues!: TTableFilterValues;

  @Emit('change')
  protected onFilterChange(event: IFilterEmitValue): IFilterEmitValue {
    return event;
  }
}
</script>
