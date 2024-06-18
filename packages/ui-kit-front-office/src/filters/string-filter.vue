<template>
  <app-input
    ref="input"
    v-model="inputValue"
    :placeholder="placeholder"
    filter-view
    @blur="handleFilter"
    @keyup.native.enter="handleEnterKeyup" />
</template>

<script lang="ts">
import type { IFilterEmitValue, TTableFilterValue } from '@sdk5/shared/types';
import { defineComponent } from 'vue';

import { AppInput } from '../ui-framework';
import FilterTypeMixin from './filterTypeMixin';

export default defineComponent({
  name: 'StringFilter',
  components: { AppInput },
  mixins: [FilterTypeMixin],
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
  watch: {
    value: [{ immediate: true, handler: 'handleValue' }],
  },
  methods: {
    handleFilter(): void {
      if (!this.inputValue && !this.value) {
        return;
      }

      this.changeEmit({
        key: this.filter.param,
        value: this.inputValue,
      });
    },
    handleEnterKeyup(): void {
      this.inputField.emitBlur();
    },
    handleValue(value: TTableFilterValue): void {
      const truthValue = value ?? '';

      this.inputValue = `${truthValue}`;
    },
    changeEmit(value: IFilterEmitValue) {
      this.$emit('change', value);
    },
  },
});
</script>
