<template>
  <el-tooltip
    class="app-tooltip"
    effect="dark"
    popper-class="app-tooltip"
    :value="tooltipVisible"
    :manual="manual"
    :content="content"
    :disabled="disabled"
    :placement="placement">
    <template #content>
      <slot name="content" />
    </template>
    <slot />
  </el-tooltip>
</template>

<script lang="ts">
import { Tooltip } from 'element-ui';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import { APP_TOOLTIP_POSITIONS } from './constants';
import type { TAppTooltipPosition } from './types';

const appTooltipPositionValidator = (value: unknown): boolean => !!APP_TOOLTIP_POSITIONS[value as TAppTooltipPosition];

export default defineComponent({
  name: 'AppTooltip',
  components: {
    'el-tooltip': Tooltip,
  },
  props: {
    content: { default: '', type: String },
    disabled: { default: false, type: Boolean },
    placement: {
      default: APP_TOOLTIP_POSITIONS.top,
      type: String as PropType<TAppTooltipPosition | {}>,
      validator: appTooltipPositionValidator,
    },
    tooltipVisible: {
      type: Boolean,
      default: false,
    },
    manual: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss">
.app-tooltip {
  @apply flex;

  &.el-tooltip__popper {
    @apply font-medium
      text-sm
      leading-[1rem]
      tracking-[0.0313rem]
      text-gray-100
      rounded-[0.25rem]
      max-w-220
      bg-gray-500
      py-[0.375rem]
      px-[0.5rem];

    &[x-placement^='bottom'] {
      .popper__arrow {
        @apply after:border-b-blue-600;
      }
    }

    &[x-placement^='right'] {
      .popper__arrow {
        @apply after:border-r-gray-500;
      }
    }

    &[x-placement^='left'] {
      .popper__arrow {
        @apply after:border-l-gray-500;
      }
    }

    &[x-placement^='top'] {
      .popper__arrow {
        @apply after:border-t-gray-500;
      }
    }
  }
}
</style>
