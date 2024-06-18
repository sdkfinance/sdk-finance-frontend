<template>
  <div class="app-filter-wrapper">
    <label
      v-if="filter.labelPosition === 'before'"
      class="app-filter-wrapper__before"
      >{{ filterLabel }}</label
    >
    <component
      :is="filter.type"
      :value="filterValues[filter.param]"
      :select-value="filterValues[filter.param]"
      :filter="filter"
      is-dropdown-simple
      is-dropdown
      :filter-values="filterValues"
      @change="changeEmit" />
    <label
      v-if="filter.labelPosition === 'after'"
      class="app-filter-wrapper__after"
      >{{ filterLabel }}</label
    >
  </div>
</template>

<script lang="ts">
import { BaseTableFilter } from '@sdk5/shared/filters';
import type { IFilterEmitValue, TTableFilterValue, TTableFilterValues } from '@sdk5/shared/types';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
    String: () => import('@sdk5/ui-kit-front-office').then((m) => m.StringFilter),
    Enumeration: () => import('@sdk5/ui-kit-front-office').then((m) => m.EnumerationFilter),
    Select: () => import('@sdk5/ui-kit-front-office').then((m) => m.SelectFilterOld),
    Multiple: () => import('@sdk5/ui-kit-front-office').then((m) => m.MultipleFilter),
    Date: () => import('@sdk5/ui-kit-front-office').then((m) => m.DateFilter),
    SelectDateRange: () => import('@sdk5/ui-kit-front-office').then((m) => m.SelectDateRangeFilter),
  },
})
export default class AppFilterWrapper extends Vue {
  @Prop() readonly value!: TTableFilterValue;

  @Prop({
    type: BaseTableFilter,
    required: true,
  })
  readonly filter!: BaseTableFilter;

  @Prop({
    type: Object as PropType<TTableFilterValues>,
    required: true,
  })
  readonly filterValues!: TTableFilterValues;

  protected get filterLabel(): string {
    if (!this.filter.label) {
      return '';
    }

    return this.$t(this.filter.label).toString();
  }

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
