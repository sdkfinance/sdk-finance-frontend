<template>
  <div class="app-filter-wrapper">
    <label
      v-if="filter.labelPosition === 'before'"
      class="app-filter-wrapper__before">{{ $t(filter.label) }}</label>
    <component
      :is="filter.type"
      :value="filterValues[filter.param]"
      :filter="filter"
      is-dropdown-simple
      is-dropdown
      :filter-values="filterValues"
      @change="changeEmit"/>
    <label
      v-if="filter.labelPosition === 'after'"
      class="app-filter-wrapper__after">{{ $t(filter.label) }}</label>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Prop,
  Vue,
} from 'vue-property-decorator';
import { IFilterEmitValue, ITableFilter } from '@/types/interfaces/TableFilters.interface';
import { IPlainObject } from '@/types/interfaces';

@Component({
  components: {
    String: () => import('@/components/data-table/filters/string-filter.vue'),
    Enumeration: () => import('@/components/data-table/filters/enumeration-filter.vue'),
    Select: () => import('@/components/data-table/filters/select-filter.vue'),
    Multiple: () => import('@/components/data-table/filters/multiple-filter.vue'),
    Date: () => import('@/components/data-table/filters/date-filter.vue'),
    SelectDateRange: () => import('@/components/data-table/filters/select-date-range-filter.vue'),
  },
})
export default class AppFilterWrapper extends Vue {

  @Prop({}) readonly value!: any;

  @Prop({
    type: Object,
    required: true,
  }) readonly filter!: ITableFilter;

  @Prop({
    type: Object,
    required: true,
  }) readonly filterValues!: IPlainObject;

  @Emit('change')
  changeEmit(event: IFilterEmitValue): IFilterEmitValue {
    return event;
  }

}
</script>

<style lang="scss">
.app-filter-wrapper {
  @apply flex items-center text-xl mr-12;

  &__before {
    @apply mr-12;
  }
}
</style>
