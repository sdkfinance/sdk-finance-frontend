<template>
  <app-date-range-select
    :date-picker-model-config="datePickerModelConfig"
    @change="updateValue" />
</template>

<script lang="ts">
import type { TTableFilterValue } from '@sdk5/shared/types';
import { defineComponent } from 'vue';

import type { TDatePickerModelConfig } from '../ui-framework';
import { AppDateRangeSelect } from '../ui-kit';
import FilterTypeMixin from './filterTypeMixin';

export default defineComponent({
  name: 'SelectDateRangeFilter',
  components: { AppDateRangeSelect },
  mixins: [FilterTypeMixin],
  setup(props, { emit }) {
    const datePickerModelConfig: Partial<TDatePickerModelConfig> = {
      start: {
        timeAdjust: '00:00:00',
      },
      end: {
        timeAdjust: '23:59:59',
      },
    };

    const emitChange = (value: TTableFilterValue, key: string) => {
      emit(
        'change',
        {
          key,
          value,
        },
        value,
        key,
      );
    };

    const updateValue = (date: string[]) => {
      const [from, to] = date;
      const [fromParam, toParam] = props.filter.params || [];
      emitChange(from, fromParam);
      emitChange(to, toParam);
    };

    return {
      datePickerModelConfig,
      updateValue,
    };
  },
});
</script>
