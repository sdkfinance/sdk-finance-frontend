<template>
  <div class="date-filter">
    <app-date-picker
      :prefix-icon="''"
      :picker-options="pickerOptions"
      :value="valueString"
      :placeholder="placeholder"
      :model-config="modelConfig"
      filter-view
      @change="emitChange" />
  </div>
</template>

<script lang="ts">
import type { IFilterRange, TFilterRange, TTableFilterValue } from '@sdk5/shared/types';
import { computed, defineComponent } from 'vue';

import { AppDatePicker, type TDatePickerModelConfig } from '../ui-framework';
import FilterTypeMixin from './filterTypeMixin';

export default defineComponent({
  name: 'DateFilter',
  components: { AppDatePicker },
  extends: FilterTypeMixin,
  setup(props, { emit }) {
    const range = computed<IFilterRange | null>(() => props.filter.range || null);
    const rangeValue = computed<TTableFilterValue>(() => {
      const { param } = range.value || {};

      if (!param) {
        return null;
      }

      return props.filterValues[param];
    });
    const rangeType = computed<TFilterRange | null>(() => range.value?.type || null);
    const pickerOptions = computed(() => {
      const { type } = range.value || {};

      return {
        disabledDate(time: Date): boolean {
          if (!rangeValue.value) {
            return false;
          }

          if (type === 'from') {
            return time.getTime() > new Date(rangeValue.value as string).getTime();
          }

          if (type === 'to') {
            return time.getTime() < new Date(rangeValue.value as string).getTime();
          }

          return false;
        },
      };
    });
    const modelConfig = computed<Partial<TDatePickerModelConfig>>(() => ({
      timeAdjust: rangeType.value === 'from' ? '00:00:00' : '23:59:59',
    }));

    const emitChange = (value: string) => {
      emit(
        'change',
        {
          key: props.filter.param,
          value: value ?? null,
        },
        value,
      );
    };

    return {
      modelConfig,
      pickerOptions,
      emitChange,
    };
  },
  computed: {
    valueString(): string {
      if (!this.value) {
        return '';
      }

      return `${this.value}`;
    },
  },
});
</script>

<style lang="scss">
.table-filter {
  &--range {
    .el-input {
      @apply w-auto;
    }
  }
}
</style>
