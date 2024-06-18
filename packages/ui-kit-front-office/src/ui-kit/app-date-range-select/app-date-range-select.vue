<template>
  <span class="daterange-container">
    <app-select
      v-model="selectedPeriod"
      :options="availableOptions"
      is-dropdown
      is-dropdown-simple
      placeholder="placeholder.select.select_period"
      :option-label="({ label }) => $t(label).toString()"
      value-key="value"
      selected-label="selectedLabel"
      @change="onChange" />
    <app-date-picker
      ref="datePickerRef"
      :value="null"
      :range-value-emit-type="APP_DATE_PICKER_RANGE_EMIT_VALUE_TYPE.array"
      :model-config="datePickerModelConfig"
      range-mode
      large-view
      hide-triggers
      @change="emitChange" />
  </span>
</template>

<script lang="ts">
import type { IPlainObject } from '@sdk5/shared/types';
import dayjs from 'dayjs';
import { isEqual } from 'lodash';
import type { PropType } from 'vue';
import { computed, defineComponent, onMounted, ref, watch } from 'vue';

import { APP_DATE_PICKER_RANGE_EMIT_VALUE_TYPE, AppDatePicker, AppSelect, type TDatePickerModelConfig } from '../../ui-framework';

const AVAILABLE_SELECT_TYPES = ['all', 'week', 'month', 'custom'] as const;
type TAvailableSelectTypes = (typeof AVAILABLE_SELECT_TYPES)[number];

const selectTypesValidator = (types: TAvailableSelectTypes[], propName: string): boolean => {
  if (!Array.isArray(types)) {
    // eslint-disable-next-line no-console
    console.error(`Prop ${propName} has to be Array`);
  }

  if (!types.every((type) => AVAILABLE_SELECT_TYPES.includes(type))) {
    // eslint-disable-next-line no-console
    console.error(`Prop ${propName} has to be Array and include only this types: ${AVAILABLE_SELECT_TYPES.join(', ')}`);
  }

  return true;
};

export default defineComponent({
  name: 'AppDateRangeSelect',
  components: { AppSelect, AppDatePicker },
  model: {
    prop: 'input',
    event: 'change',
  },
  props: {
    selectTypes: {
      type: Array as PropType<TAvailableSelectTypes[]>,
      default: () => AVAILABLE_SELECT_TYPES,
      validator: (types: TAvailableSelectTypes[]) => selectTypesValidator(types, 'selectTypes'),
    },
    excludeSelectTypes: {
      type: Array,
      default: () => [],
      validator: (types: TAvailableSelectTypes[]) => selectTypesValidator(types, 'excludeSelectTypes'),
    },
    input: { type: [String, Array] as PropType<string | string[]>, default: undefined },
    datePickerModelConfig: {
      type: Object as PropType<Partial<TDatePickerModelConfig>>,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const datePickerRef = ref(null as unknown as typeof AppDatePicker);
    const selectedPeriod = ref({} as IPlainObject);
    const availableSelectTypes = computed<TAvailableSelectTypes[]>(() =>
      props.selectTypes.filter((type) => !props.excludeSelectTypes.includes(type)),
    );
    const availableOptions = computed<IPlainObject[]>(() => {
      const allTypes: IPlainObject[] = [
        {
          label: 'entity.date_range.all_time',
          selectedLabel: 'entity.date_range.for_all_time',
          value: 'all',
        },
        {
          label: 'entity.date_range.this_week',
          selectedLabel: 'entity.date_range.for_this_week',
          value: 'week',
        },
        {
          label: 'entity.date_range.this_month',
          selectedLabel: 'entity.date_range.for_this_month',
          value: 'month',
        },
        {
          label: 'entity.date_range.custom_period',
          selectedLabel: 'entity.date_range.for_custom_period',
          value: 'custom',
        },
      ];
      return allTypes.filter(({ value }) => availableSelectTypes.value.includes(value));
    });

    const emitChange = <T,>(value: T) => {
      emit('change', value);
    };

    const onInput = (newValue: string | string[], oldValue?: string | string[]) => {
      if (!Array.isArray(newValue) && isEqual(newValue, oldValue)) {
        return;
      }

      const [from, to] = newValue;
      const { all, week, month, custom } = availableOptions.value.reduce((acc, type) => ({ ...acc, [type.value]: type }), {});

      if (!from && !to) {
        selectedPeriod.value = all;
        return;
      }

      const dayJsFrom = dayjs(from);
      const dayJsTo = dayjs(to);
      const dayJs = dayjs();

      const isFirstDayOfTheWeek = dayJsFrom.isSame(dayJs.startOf('week'));
      const isLastDayOfTheWeek = dayJsTo.isSame(dayJs.endOf('week'));

      if (isFirstDayOfTheWeek && isLastDayOfTheWeek) {
        selectedPeriod.value = week;
        return;
      }

      const isFirstDayOfThisMonth = dayJsFrom.isSame(dayJs.startOf('month'));
      const isLastDayOfThisMonth = dayJsTo.isSame(dayJs.endOf('month'));

      if (isFirstDayOfThisMonth && isLastDayOfThisMonth) {
        selectedPeriod.value = month;
        return;
      }

      selectedPeriod.value = custom;
    };

    const onChange = (data: { value: string }) => {
      datePickerRef.value.hideDatePicker();

      if (data.value === 'all') {
        emitChange(['', '']);
      }

      if (data.value === 'custom') {
        datePickerRef.value.showDatePicker();
      }

      if (data.value === 'month') {
        const firstDayOfThisMonth = dayjs().startOf('month').toISOString();
        const lastDayOfThisMonth = dayjs().endOf('month').toISOString();

        emitChange([firstDayOfThisMonth, lastDayOfThisMonth]);
      }

      if (data.value === 'week') {
        const firstDayOfThisWeek = dayjs().startOf('week').toISOString();
        const lastDayOfThisWeek = dayjs().endOf('week').toISOString();

        emitChange([firstDayOfThisWeek, lastDayOfThisWeek]);
      }
    };

    watch(
      () => props.input,
      (newValue, oldValue) => {
        onInput(newValue, oldValue);
      },
      {
        immediate: true,
      },
    );

    onMounted(() => {
      selectedPeriod.value = availableOptions.value.at(0) ?? {};
    });

    return {
      selectedPeriod,
      availableSelectTypes,
      availableOptions,
      APP_DATE_PICKER_RANGE_EMIT_VALUE_TYPE,
      emitChange,
      onInput,
      onChange,
      datePickerRef,
    };
  },
});
</script>

<style lang="scss">
.daterange-container {
  @apply relative;

  .date-range-picker {
    height: 1px;

    @apply absolute top-0 left-0 block w-full;

    & .form-control {
      max-height: 36px;

      @apply opacity-0 overflow-hidden invisible;
    }
  }

  .daterangepicker {
    @apply -mt-10;
  }
}

.daterangepicker.openscenter::after,
.daterangepicker.openscenter::before {
  @apply hidden;
}
</style>
