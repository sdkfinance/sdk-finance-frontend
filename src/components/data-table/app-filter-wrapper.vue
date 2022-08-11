<template>
  <div :class="classes">
    <component
      :is="filter.type"
      :value="filterValues[filter.param]"
      :filter="filter"
      :filter-values="filterValues"
      @change="changeEmit"/>

    <span
      v-if="filter.suffixIcon"
      :class="['filter-icon', filter.suffixIcon]"/>
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

@Component({
  components: {
    String: () => import('@/components/data-table/filters/string-filter.vue'),
    Enumeration: () => import('@/components/data-table/filters/enumeration-filter.vue'),
    Select: () => import('@/components/data-table/filters/select-filter.vue'),
    Multiple: () => import('@/components/data-table/filters/multiple-filter.vue'),
    Date: () => import('@/components/data-table/filters/date-filter.vue'),
  },
})
export default class AppFilterWrapper extends Vue {

  @Prop({
    type: Object,
    required: true,
  }) readonly filterValues!: object;

  @Prop({
    type: Object,
    required: true,
  }) readonly filter!: ITableFilter;

  get classes(): (object | string)[] {
    const {
      param,
      range: { type } = {},
    } = this.filter;

    return [
      'filter-wrapper',
      { [`filter-wrapper--${param.toLowerCase()}`]: Boolean(param) },
      { [`filter-wrapper--${type}`]: Boolean(type) },
      { 'filter-wrapper--iconed': this.filter.suffixIcon },
    ];
  }

  @Emit('change')
  changeEmit(value: IFilterEmitValue): IFilterEmitValue {
    return value;
  }

}
</script>

<style lang="scss">
.filter-wrapper {
  @apply relative;

  &--iconed {
    .el-input .el-input__inner {
      @apply pr-28;
    }
  }

  .filter-icon {
    @apply absolute text-10 text-blue-600 right-10 bottom-6;
  }
}
</style>
