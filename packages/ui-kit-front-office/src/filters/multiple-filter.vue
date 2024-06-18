<template>
  <app-input
    ref="input"
    v-model="inputValue"
    :placeholder="placeholder"
    filter-view
    @blur="handleFilter"
    @keyup.enter.native="handleEnterKeyup" />
</template>

<script lang="ts">
import type { TTableFilterValueArrayType } from '@sdk5/shared/types';
import { defineComponent } from 'vue';

import { AppInput } from '../ui-framework';
import FilterTypeMixin from './filterTypeMixin';

const getArrayValue = (previousValues: TTableFilterValueArrayType = [], newValue: string | number): TTableFilterValueArrayType => {
  if (!previousValues) {
    return [newValue];
  }

  return [...previousValues, newValue];
};

export default defineComponent({
  name: 'MultipleFilter',
  components: { AppInput },
  extends: FilterTypeMixin,
  data() {
    const inputValue: string = '';

    return {
      inputValue,
    };
  },
  computed: {
    inputField: {
      cache: false,
      get() {
        return this.$refs.input as unknown as typeof AppInput;
      },
      set() {},
    },
  },
  methods: {
    handleEnterKeyup() {
      this.inputField.emitBlur();
    },
    handleFilter() {
      const isEmptyInput = !this.inputValue;
      const isValueAlreadyExist = this.value && (this.value as TTableFilterValueArrayType).includes(this.inputValue);

      if (isEmptyInput || isValueAlreadyExist) {
        this.inputValue = '';
        return;
      }

      this.emitValue();
      this.inputValue = '';
    },
    emitValue() {
      this.$emit('change', {
        key: this.filter.param,
        value: getArrayValue(this.value as TTableFilterValueArrayType, this.inputValue),
      });
    },
  },
});
</script>
