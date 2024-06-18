<template>
  <app-dropdown
    secondary
    :value="filterValue"
    :options="options"
    option-value="value"
    :option-label="optionLabelFn"
    filter-view
    placement="bottom-start"
    @input="emitChange">
    <template #trigger="{ isDropDownVisible }">
      <app-dropdown-trigger-filter-view
        :values-string="filterValueString"
        :is-dropdown-visible="isDropDownVisible"
        :placeholder="placeholder"
        @clear-filter="clearFilterHandler" />
    </template>
  </app-dropdown>
</template>

<script lang="ts">
import type { TTableFilterValue } from '@sdk5/shared/types';
import { isEqual } from 'lodash';
import { defineComponent } from 'vue';

import { AppDropdown, AppDropdownTriggerFilterView } from '../ui-framework';
import SelectFilterMixin from './selectFilterMixin';

export default defineComponent({
  name: 'SelectFilter',
  components: {
    AppDropdownTriggerFilterView,
    AppDropdown,
  },
  extends: SelectFilterMixin,
  computed: {
    filterValue(): any {
      const { options } = this.filter;

      if (Array.isArray(options)) {
        return options.find(({ value }) => isEqual(value, this.value))?.value;
      }

      return this.value;
    },
  },
  methods: {
    emitChange(value: TTableFilterValue) {
      if (Array.isArray(this.value) && !Array.isArray(value)) {
        this.$emit('change', {
          value: this.value,
          key: this.filter.param,
        });
        return;
      }

      this.$emit('change', {
        value,
        key: this.filter.param,
      });
    },
    optionLabelFn({ label }: { label: string }): string {
      return this.$t(label).toString();
    },
    clearFilterHandler() {
      this.emitChange(null);
    },
  },
});
</script>
