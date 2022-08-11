<template>
  <app-date-range-select
    @change="updateValue"/>
</template>

<script lang="ts">
import { Component, Emit, Prop } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { IFilterEmitValue } from '@/types/interfaces/TableFilters.interface';
import FilterTypeMixin from '@/components/data-table/filters/filterTypeMixin';
import AppDateRangeSelect from '@/components/ui-kit/app-date-range-select.vue';

type TValue = string | boolean | any[];

@Component({
  components: { AppDateRangeSelect },
})
export default class SelectDateRangeFilter extends mixins(FilterTypeMixin) {

  @Prop({
    type: [String, Boolean, Array],
    default: '',
  }) readonly value!: TValue;

  protected updateValue(date: string[]): void {
    const [from, to] = date;
    const [fromParam, toParam] = this.filter.params || [];

    this.emitChange(from, fromParam);
    this.emitChange(to, toParam);
  }

  @Emit('change')
  emitChange(value: TValue, key: string): IFilterEmitValue {
    return {
      key,
      value,
    };
  }

}
</script>
