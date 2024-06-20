<template>
  <el-dropdown-item
    :class="[{ 'is-selected': isOptionSelected }]"
    :icon="option.icon || ''"
    :command="option.command || option">
    <slot
      name="option"
      v-bind="{ isOptionSelected }" />
  </el-dropdown-item>
</template>

<script lang="ts">
import type { IOption } from '@sdk5/shared/types';
import { isEmptyValue } from '@sdk5/shared/utils';
import { DropdownItem } from 'element-ui';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppDropdownMenuItemContainer',
  components: {
    [DropdownItem.name]: DropdownItem,
  },
  props: {
    value: { type: [Object, Array, String, Number, Boolean], default: undefined },
    option: { type: [Object, String] as PropType<IOption>, required: true },
    displayLabel: { type: String, default: undefined },
    optionValue: { type: [String, Boolean, Object], required: true },
  },
  computed: {
    isOptionSelected() {
      if (isEmptyValue(!this.value)) {
        return false;
      }

      if (Array.isArray(this.value)) {
        return this.value.findIndex((valueItem) => valueItem === this.optionValue) > -1;
      }

      return this.value === this.optionValue;
    },
  },
});
</script>
