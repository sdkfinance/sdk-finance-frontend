<template>
  <app-select
    :value="filterValue"
    :placeholder="placeholder"
    class="select-filter"
    :options="options"
    v-bind="$attrs"
    option-value="value"
    :option-label="({ label }) => $t(label).toString()"
    :fit-popper-width="false"
    @change="emitChange" />
</template>

<script lang="ts">
import { isEqual } from 'lodash';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import { AppSelect } from '../ui-framework';
import SelectFilterMixin from './selectFilterMixin';

type TValue = string | boolean | any[];
export default defineComponent({
  name: 'SelectFilterOld',
  components: { AppSelect },
  extends: SelectFilterMixin,
  props: {
    selectValue: {
      type: [String, Boolean, Array] as PropType<TValue>,
      default: '',
    },
  },
  computed: {
    filterValue() {
      const { options } = this.filter;

      if (Array.isArray(options)) {
        return options.find(({ value }) => isEqual(value, this.selectValue))?.value;
      }

      return this.selectValue;
    },
  },
  methods: {
    emitChange(value: TValue) {
      if (Array.isArray(this.selectValue) && !Array.isArray(value)) {
        this.$emit('change', {
          value: this.selectValue,
          key: this.filter.param,
        });
        return;
      }

      this.$emit('change', {
        value,
        key: this.filter.param,
      });
    },
  },
});
</script>
