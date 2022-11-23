<template>
  <app-input
    ref="input"
    v-model="inputValue"
    :placeholder="$t(placeholder)"
    @blur="handleFilter"
    @keyup.native.enter="handleEnterKeyup"/>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component';
import {
  Component, Emit, Model, Ref, Watch,
} from 'vue-property-decorator';

import FilterTypeMixin from '@/components/data-table/filters/filterTypeMixin';
import AppInput from '@/components/ui-framework/app-input.vue';
import { IFilterEmitValue } from '@/types/interfaces/TableFilters.interface';

type TValue = string | undefined | null;

@Component({
  components: { AppInput },
})
export default class StringFilter extends mixins(FilterTypeMixin) {

  @Ref('input') readonly inputField!: AppInput;

  @Model('change', {
    required: true,
  }) readonly value!: TValue;

  public inputValue: string = '';

  @Watch('value', { immediate: true })
  handleValue(value: TValue): void {
    const truthValue = value ?? '';

    this.inputValue = `${truthValue}`;
  }

  @Emit('change')
  changeEmit(value: IFilterEmitValue): IFilterEmitValue {
    return value;
  }

  handleFilter(): void {
    if (!this.inputValue && !this.value) return;

    this.changeEmit({
      key: this.filter.param,
      value: this.inputValue,
    });
  }

  handleEnterKeyup(e: KeyboardEvent): void {
    this.inputField.emitBlur(e);
  }

}
</script>
