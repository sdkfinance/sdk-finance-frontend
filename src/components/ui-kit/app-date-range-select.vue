<template>
  <span class="daterange-container">
    <app-select
      v-model="selectedPeriod"
      :options="availableOptions"
      is-dropdown
      is-dropdown-simple
      placeholder="placeholder.select.select_period"
      :option-label="({ label }) => $t(label)"
      value-key="value"
      selected-label="selectedLabel"
      @change="onChange"/>
    <app-daterange-picker
      ref="rangePicker"
      class="date-range-picker"
      @change="emitChange"/>
  </span>
</template>

<script lang="ts">
import dayjs from 'dayjs';
import { isEqual } from 'lodash';
import {
  Component, Emit, Model, Prop,
  Ref, Vue, Watch,
} from 'vue-property-decorator';

import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppDaterangePicker from '@/components/ui-kit/app-daterange-picker.vue';
import { IPlainObject } from '@/types/interfaces';

const AVAILABLE_SELECT_TYPES = ['all', 'week', 'month', 'custom'] as const;
type TAvailableSelectTypes = typeof AVAILABLE_SELECT_TYPES[number];

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

@Component({
  components: {
    AppDaterangePicker,
    AppSelect,
  },
})
export default class AppDateRangeSelect extends Vue {

  @Ref('rangePicker') readonly rangePicker!: AppDaterangePicker;

  @Model('change', { type: [String, Array] }) input!: [string, string] | string;

  @Prop({
    type: Array,
    default: () => AVAILABLE_SELECT_TYPES,
    validator: (types: TAvailableSelectTypes[]) => selectTypesValidator(types, 'selectTypes'),
  }) readonly selectTypes!: TAvailableSelectTypes[];

  @Prop({
    type: Array,
    default: () => [],
    validator: (types: TAvailableSelectTypes[]) => selectTypesValidator(types, 'excludeSelectTypes'),
  }) readonly excludeSelectTypes!: TAvailableSelectTypes[];

  @Emit('change')
  protected emitChange<T>(value: T): T {
    return value;
  }

  protected selectedPeriod: IPlainObject = this.availableOptions[0];

  protected get availableSelectTypes(): TAvailableSelectTypes[] {
    return this.selectTypes.filter((type) => !this.excludeSelectTypes.includes(type));
  }

  protected get availableOptions(): IPlainObject[] {
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
    return allTypes.filter(({ value }) => this.availableSelectTypes.includes(value));
  }

  @Watch('input', { immediate: true })
  onInput(newValue: string[], oldValue: string[]): void {
    if (!Array.isArray(newValue) && isEqual(newValue, oldValue)) return;

    const [from, to] = newValue;
    const {
      all, week, month, custom,
    } = this.availableOptions.reduce((acc, type) => ({ ...acc, [type.value]: type }), {});

    if (!from && !to) {
      this.selectedPeriod = all;
      return;
    }

    const dayJsFrom = dayjs(from);
    const dayJsTo = dayjs(to);
    const dayJs = dayjs();

    const isFirstDayOfTheWeek = dayJsFrom.isSame(dayJs.startOf('week'));
    const isLastDayOfTheWeek = dayJsTo.isSame(dayJs.endOf('week'));
    if (isFirstDayOfTheWeek && isLastDayOfTheWeek) {
      this.selectedPeriod = week;
      return;
    }

    const isFirstDayOfThisMonth = dayJsFrom.isSame(dayJs.startOf('month'));
    const isLastDayOfThisMonth = dayJsTo.isSame(dayJs.endOf('month'));
    if (isFirstDayOfThisMonth && isLastDayOfThisMonth) {
      this.selectedPeriod = month;
      return;
    }

    this.selectedPeriod = custom;
  }

  protected onChange(data: { value: string }): void {
    this.rangePicker.toggleCalendar(false);

    if (data.value === 'all') {
      this.emitChange(['', '']);
    }

    if (data.value === 'custom') {
      this.rangePicker.toggleCalendar();
    }

    if (data.value === 'month') {
      const firstDayOfThisMonth = dayjs().startOf('month').toISOString();
      const lastDayOfThisMonth = dayjs().endOf('month').toISOString();

      this.emitChange([firstDayOfThisMonth, lastDayOfThisMonth]);
    }

    if (data.value === 'week') {
      const firstDayOfThisWeek = dayjs().startOf('week').toISOString();
      const lastDayOfThisWeek = dayjs().endOf('week').toISOString();

      this.emitChange([firstDayOfThisWeek, lastDayOfThisWeek]);
    }
  }

}
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
