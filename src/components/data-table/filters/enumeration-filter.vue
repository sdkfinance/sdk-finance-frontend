<template>
  <app-select
    :value="value"
    :placeholder="$t(placeholder)"
    class="enumeration-filter"
    :options="options"
    option-label="label"
    option-value="value"
    v-bind="$attrs"
    multiple
    @change="handleFilterChange">
    <span
      v-if="valueLength"
      slot="prefix">
      {{ $t(filter.name) }}
      ({{ valueLength }})
    </span>
  </app-select>
</template>

<script lang="ts">
import { Component, Emit, Prop } from 'vue-property-decorator';

import SelectFilterMixin from '@/components/data-table/filters/selectFilterMixin';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import { IFilterEmitValue } from '@/types/interfaces/TableFilters.interface';

type TValue = (string | number)[] | null;

@Component({
  components: { AppSelect },
})
export default class EnumerationFilter extends SelectFilterMixin {

  @Prop({
    required: true,
  }) readonly value!: TValue;

  get valueLength(): number {
    return this.value?.length || 0;
  }

  @Emit('change')
  emitChange(value: IFilterEmitValue): IFilterEmitValue {
    return value;
  }

  handleFilterChange(value: TValue): void {
    this.emitChange({
      key: this.filter.param,
      value,
    });
  }

}
</script>

<style lang="scss">
.enumeration-filter {
  .el-select__tags {
    display: none;
  }

  .el-input__prefix span {
    display: flex;
    height: 100%;
    padding-left: 13px;
    align-items: center;
    color: inherit;
    font-weight: 500;
  }

  .is-focus {
    .el-input__prefix span {
      color: #fff;
    }
  }
}
</style>
