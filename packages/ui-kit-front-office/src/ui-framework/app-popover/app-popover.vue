<template>
  <el-popover
    :placement="placement"
    :width="width"
    :popper-class="popoverClass"
    :trigger="trigger">
    <template #reference>
      <slot name="action" />
    </template>
    <slot />
  </el-popover>
</template>

<script lang="ts">
import { Popover } from 'element-ui';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppPopover',
  components: {
    [Popover.name]: Popover,
  },
  props: {
    width: { default: 300, type: Number },
    popoverClass: { default: '', type: String },
    placement: {
      default: 'top',
      type: String,
      validator: (value: any): boolean => {
        return [
          'top',
          'top-start',
          'top-end',
          'bottom',
          'bottom-start',
          'bottom-end',
          'left',
          'left-start',
          'left-end',
          'right',
          'right-start',
          'right-end',
        ].includes(value);
      },
    },
    trigger: {
      default: 'hover',
      type: String,
      validator(value: any): boolean {
        return ['click', 'focus', 'hover', 'manual'].includes(value);
      },
    },
  },
});
</script>
