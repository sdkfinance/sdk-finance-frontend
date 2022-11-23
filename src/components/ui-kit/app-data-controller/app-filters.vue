<template>
  <div>
    <app-filter-wrapper
      v-for="filter in filters"
      :key="filter.param"
      :filter="filter"
      :filter-values="filterValues"
      @change="onFilterChange"/>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Prop,
  Vue,
} from 'vue-property-decorator';

import AppFilterWrapper from '@/components/ui-kit/app-data-controller/app-filter-wrapper.vue';
import { IPlainObject } from '@/types/interfaces';
import { IFilterEmitValue, ITableFilter } from '@/types/interfaces/TableFilters.interface';

@Component({
  components: {
    AppFilterWrapper,
  },
})
export default class AppFilters extends Vue {

  @Prop({ type: Array, default: () => ([]) }) readonly filters!: ITableFilter[];

  @Prop({ type: Object, default: () => ({}) }) readonly filterValues!: IPlainObject;

  @Emit('change')
  protected onFilterChange(event: IFilterEmitValue): IFilterEmitValue {
    return event;
  }

}
</script>
