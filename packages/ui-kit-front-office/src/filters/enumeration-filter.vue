<template>
  <app-dropdown
    v-model="localFilterValues"
    secondary
    :options="options"
    option-value="value"
    :option-label="optionLabelFn"
    multiple
    filter-view
    placement="bottom-start"
    :hide-on-click="false">
    <template #trigger="{ isDropDownVisible }">
      <app-dropdown-trigger-filter-view
        :values-string="filterValueString"
        :is-dropdown-visible="isDropDownVisible"
        :placeholder="placeholder"
        @clear-filter="clearFilterHandler" />
    </template>
    <template #option="{ option, isOptionSelected }">
      <app-checkbox :checked="isOptionSelected">
        {{ $t(option.label) }}
      </app-checkbox>
    </template>
    <template #afterOptions="{ hideDropdown }">
      <app-button
        size="small"
        secondary
        full-width
        @click="applyButtonClickHandler(hideDropdown)">
        Apply
      </app-button>
    </template>
  </app-dropdown>
</template>

<script lang="ts">
import type { IFilterEmitValue, TTableFilterValue, TTableFilterValueArrayType } from '@sdk5/shared/types';
import { defineComponent } from 'vue';

import { AppButton, AppCheckbox, AppDropdown, AppDropdownTriggerFilterView } from '../ui-framework';
import SelectFilterMixin from './selectFilterMixin';

export default defineComponent({
  name: 'EnumerationFilter',
  components: {
    AppDropdownTriggerFilterView,
    AppButton,
    AppDropdown,
    AppCheckbox,
  },
  extends: SelectFilterMixin,
  data() {
    return {
      localFilterValues: [] as TTableFilterValueArrayType,
    };
  },
  watch: {
    value: [
      {
        immediate: true,
        handler: 'valueChangeHandler',
      },
    ],
  },
  methods: {
    handleFilterChange(value: TTableFilterValue): void {
      this.emitChange({
        key: this.filter.param,
        value,
      });
    },
    applyButtonClickHandler(closeDropdownFn: () => void) {
      if (closeDropdownFn) {
        closeDropdownFn();
      }

      this.handleFilterChange(this.localFilterValues);
    },
    optionLabelFn({ label }: { label: string }): string {
      return this.$t(label).toString();
    },
    clearFilterHandler() {
      this.emitChange({ key: this.filter.param, value: null });
    },
    valueChangeHandler(value: TTableFilterValueArrayType) {
      this.localFilterValues = value ?? [];
    },
    emitChange(value: IFilterEmitValue) {
      this.$emit('change', value);
    },
  },
});
</script>

<style lang="scss">
.enumeration-filter {
  .el-select__tags {
    display: none;
  }

  .el-input__prefix span {
    white-space: nowrap;
    width: 100%;
    display: flex;
    height: 100%;
    align-items: center;
    color: inherit;
    font-weight: 500;
  }
}
</style>
