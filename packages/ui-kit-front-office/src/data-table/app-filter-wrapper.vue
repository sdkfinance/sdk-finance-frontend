<template>
  <div :class="classes">
    <component
      :is="filter.type"
      :value="filter.value"
      :filter="filter"
      :filter-values="filterValues"
      @change="changeEmit" />
  </div>
</template>

<script lang="ts">
import { BaseTableFilter } from '@sdk5/shared/filters';
import type { IFilterEmitValue, TTableFilterType, TTableFilterValues } from '@sdk5/shared/types';
import type { AsyncComponent, PropType } from 'vue';
import { defineAsyncComponent, defineComponent } from 'vue';

const APP_FILTER_WRAPPER_COMPONENTS: Record<Exclude<TTableFilterType, 'SelectDateRange'>, AsyncComponent> = {
  String: defineAsyncComponent(() => import('../filters/string-filter.vue')),
  Enumeration: defineAsyncComponent(() => import('../filters/enumeration-filter.vue')),
  Select: defineAsyncComponent(() => import('../filters/select-filter.vue')),
  Multiple: defineAsyncComponent(() => import('../filters/multiple-filter.vue')),
  Date: defineAsyncComponent(() => import('../filters/date-filter.vue')),
  Range: defineAsyncComponent(() => import('../filters/range-filter.vue')),
  Period: defineAsyncComponent(() => import('../filters/period-filter.vue')),
};

export default defineComponent({
  name: 'AppFilterWrapper',
  components: APP_FILTER_WRAPPER_COMPONENTS,
  props: {
    filterValues: {
      type: Object as PropType<TTableFilterValues>,
      required: true,
    },
    filter: {
      type: [BaseTableFilter, Object] as PropType<BaseTableFilter>,
      required: true,
    },
  },
  computed: {
    classes(): (object | string)[] {
      const { param, range: { type } = {} } = this.filter;

      return [
        'filter-wrapper',
        { [`filter-wrapper--${param.toLowerCase()}`]: Boolean(param) },
        { [`filter-wrapper--${type}`]: Boolean(type) },
        { 'filter-wrapper--iconed': this.filter.suffixIcon },
      ];
    },
  },
  methods: {
    changeEmit(value: IFilterEmitValue) {
      this.$emit('change', value);
    },
  },
});
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
