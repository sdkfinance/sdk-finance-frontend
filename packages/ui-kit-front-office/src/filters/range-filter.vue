<template>
  <div class="range-filter">
    <app-dropdown
      filter-view
      secondary
      :hide-on-click="false"
      placement="bottom-start">
      <template #dropdownMenu>
        <div class="range-filter__inputs-container">
          <component
            :is="currentFilterComponent"
            v-model="fromValue"
            v-bind="filterFromComponentProps" />
          <component
            :is="currentFilterComponent"
            v-model="toValue"
            v-bind="filterToComponentProps" />
        </div>
      </template>
      <template #trigger="{ isDropDownVisible }">
        <app-dropdown-trigger-filter-view
          :values-string="filterValueString"
          :is-dropdown-visible="isDropDownVisible"
          :placeholder="placeholder"
          @clear-filter="clearFilterHandler" />
      </template>
      <template #afterOptions="{ hideDropdown }">
        <app-button
          size="small"
          secondary
          full-width
          :disabled="isApplyButtonDisabled"
          @click="applyButtonClickHandler(hideDropdown)">
          {{ $t('action.apply') }}
        </app-button>
      </template>
    </app-dropdown>
  </div>
</template>

<script lang="ts">
import type { TTableFilterValue } from '@sdk5/shared/types';
import { isEmptyValue } from '@sdk5/shared/utils';
import { computed, defineComponent, ref } from 'vue';

import type { TDatePickerModelConfig } from '../ui-framework';
import { AppButton, AppDatePicker, AppDropdown, AppDropdownTriggerFilterView, AppInput } from '../ui-framework';
import FilterTypeMixin from './filterTypeMixin';

export default defineComponent({
  name: 'RangeFilter',
  components: {
    AppDatePicker,
    AppInput,
    AppButton,
    AppDropdown,
    AppDropdownTriggerFilterView,
  },
  extends: FilterTypeMixin,
  setup(props, { emit }) {
    const filterComponentBaseProps = {
      prefixIcon: '',
      appendToBody: false,
      autoWidth: true,
    };
    const toValue = ref('');
    const fromValue = ref('');

    const rangeOptions = computed(() => props.filter.rangeOptions);
    const currentFilterComponent = computed(() => {
      const componentsByType = {
        Date: AppDatePicker,
        String: AppInput,
      };

      return componentsByType[rangeOptions.value?.type ?? 'String'];
    });
    const filterParam = computed(() => props.filter.param);
    const isApplyButtonDisabled = computed(() => isEmptyValue(fromValue.value) && isEmptyValue(toValue.value));

    const emitChange = (value: [string, string] | null) => {
      emit(
        'change',
        {
          key: filterParam.value,
          value: value as string[] | null,
        },
        value,
      );
    };
    const clearFilterHandler = () => {
      emitChange(null);
    };
    const filterValueChangeHandler = (value: TTableFilterValue) => {
      const [fromValueLocal, toValueLocal] = Array.isArray(value) ? value : [];

      fromValue.value = fromValueLocal?.toString() ?? '';
      toValue.value = toValueLocal?.toString() ?? '';
    };
    const applyButtonClickHandler = (hideDropdownFn: () => void) => {
      if (isEmptyValue(fromValue.value) && isEmptyValue(toValue.value)) {
        return;
      }

      if (hideDropdownFn) {
        hideDropdownFn();
      }

      emitChange([fromValue.value, toValue.value]);
    };

    return {
      toValue,
      fromValue,
      filterComponentBaseProps,
      currentFilterComponent,
      emitChange,
      clearFilterHandler,
      filterValueChangeHandler,
      applyButtonClickHandler,
      isApplyButtonDisabled,
      rangeOptions,
    };
  },
  computed: {
    filterFromComponentProps() {
      return {
        ...this.filterComponentBaseProps,
        placeholder: this.rangeOptions?.from?.placeholder ?? this.placeholder,
        maxDate: this.toValue ?? null,
        modelConfig: {
          timeAdjust: '00:00:00',
        } as TDatePickerModelConfig,
      };
    },
    filterToComponentProps() {
      return {
        ...this.filterComponentBaseProps,
        placeholder: this.rangeOptions?.to?.placeholder ?? this.placeholder,
        minDate: this.fromValue ?? null,
        modelConfig: {
          timeAdjust: '23:59:59',
        } as TDatePickerModelConfig,
      };
    },
    filterValue() {
      return this.value;
    },
  },
  watch: {
    filterValue: [{ deep: true, immediate: true, handler: 'filterValueChangeHandler' }],
  },
});
</script>

<style lang="scss">
.range-filter {
  &__inputs-container {
    @apply grid grid-cols-2 justify-between gap-x-[0.25rem] px-[0.75rem] w-[220px];
  }
}
</style>
