<template>
  <div class="table-filter">
    <app-select
      v-if="filters.length"
      v-model="chosenFilter"
      :options="filters"
      :option-label="({ label }) => $t(label)"
      value-key="param"
      class="app-folded-filter-label table-filter-label"/>

    <app-filter-wrapper
      :filter-values="filterValues"
      :filter="chosenFilter"
      @change="emitChange"/>
  </div>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';

import AppFilterWrapper from '@/components/data-table/app-filter-wrapper.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import { ITableFilter, TFilters } from '@/types/interfaces/TableFilters.interface';

@Component({
  components: { AppSelect, AppFilterWrapper },
})
export default class AppFoldedFilter extends Vue {

  @Prop({
    type: Array,
    required: true,
  }) readonly filters!: TFilters;

  @Prop({
    type: Object,
    required: true,
  }) readonly filterValues!: object;

  public chosenFilter: ITableFilter = this.filters[0];

  @Emit('change')
  emitChange(value: ITableFilter): ITableFilter {
    return value;
  }

}
</script>

<style lang="scss">
.app-folded-filter-label {
  width: 100%;

  .el-select {
    .el-input,
    .el-input.is-focus {
      .el-input__inner {
        padding: 0;
        background-color: transparent;
        border: none;
        color: inherit;
        font-size: 12px;
        font-weight: 600;
      }

      .el-icon-arrow-up::before {
        color: #000;
      }
    }

    .el-input__suffix {
      right: -5px;
    }

    .el-input.is-focus {
      .el-input__inner,
      .el-icon-arrow-up::before {
        color: $primary-color;
      }
    }
  }
}
</style>
