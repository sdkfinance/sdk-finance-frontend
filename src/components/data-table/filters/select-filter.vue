<template>
  <app-select
    :value="filterValue"
    :placeholder="$t(placeholder)"
    class="select-filter"
    :options="options"
    v-bind="$attrs"
    option-value="value"
    :option-label="({ label }) => $t(label)"
    @change="emitChange"/>
</template>

<script lang="ts">
import { isEqual } from 'lodash';
import { Component, Emit, Prop } from 'vue-property-decorator';

import SelectFilterMixin from '@/components/data-table/filters/selectFilterMixin';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import { IFilterEmitValue } from '@/types/interfaces/TableFilters.interface';

type TValue = string | boolean | any[];

@Component({
  components: { AppSelect },
})
export default class SelectFilter extends SelectFilterMixin {

  @Prop({
    type: [String, Boolean, Array],
    default: '',
  }) readonly value!: TValue;

  protected get filterValue(): any {
    const { options } = this.filter;

    if (Array.isArray(options)) {
      return options.find(({ value }) => isEqual(value, this.value))?.value;
    }

    return this.value;
  }

  @Emit('change')
  emitChange(value: TValue): IFilterEmitValue {
    if (Array.isArray(this.value) && !Array.isArray(value)) {
      return {
        value: this.value,
        key: this.filter.param,
      };
    }

    return {
      value,
      key: this.filter.param,
    };
  }

}
</script>
