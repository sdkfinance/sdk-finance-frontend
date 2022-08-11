<template>
  <app-input
    ref="input"
    v-model="inputValue"
    :placeholder="$t(placeholder)"
    @blur="handleFilter"
    @keyup.enter.native="$event => inputField.emitBlur($event)"/>
</template>

<script lang="ts">
import {
  Component, Emit, Model, Ref,
} from 'vue-property-decorator';
import FilterTypeMixin from '@/components/data-table/filters/filterTypeMixin';
import AppInput from '@/components/ui-framework/app-input.vue';
import { IFilterEmitValue } from '@/types/interfaces/TableFilters.interface';

type TValue = (string | number)[];

const getArrayValue = (previousValues: TValue = [], newValue: string | number): TValue => {
  if (!previousValues) {
    return [newValue];
  }

  return [...previousValues, newValue];
};

@Component({
  components: { AppInput },
})
export default class MultipleFilter extends FilterTypeMixin {

  @Ref('input') readonly inputField!: AppInput;

  @Model('change', {
    required: true,
  }) readonly value!: TValue;

  public inputValue: string = '';

  @Emit('change')
  emitValue(): IFilterEmitValue {
    return {
      key: this.filter.param,
      value: getArrayValue(this.value, this.inputValue),
    };
  }

  handleFilter() {
    const isEmptyInput = !this.inputValue;
    const isValueAlreadyExist = this.value && this.value.includes(this.inputValue);

    if (isEmptyInput || isValueAlreadyExist) {
      this.inputValue = '';
      return;
    }

    this.emitValue();
    this.inputValue = '';
  }

}
</script>
