<template>
  <el-radio
    :name="name"
    :disabled="disabled"
    :label="label"
    :class="['app-radio-button', `app-radio-button--${size}`]">
    <template #default>
      <slot />
    </template>
  </el-radio>
</template>

<script lang="ts">
import { Radio, RadioGroup } from 'element-ui';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

const ACCEPTABLE_SIZES = ['medium', 'large'] as const;

type TAcceptableSizes = (typeof ACCEPTABLE_SIZES)[number];

export default defineComponent({
  name: 'AppRadioButton',
  components: {
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
  },
  props: {
    size: {
      type: String as PropType<TAcceptableSizes>,
      default: 'medium' as TAcceptableSizes,
      validator: (value: unknown): boolean => {
        return ACCEPTABLE_SIZES.indexOf(value as TAcceptableSizes) !== -1;
      },
    },
    name: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    label: { type: String, required: true },
  },
});
</script>

<style lang="scss">
.app-radio-button,
.app-radio-button .el-radio__input {
  @apply flex items-center;
}

.app-radio-button {
  @apply gap-x-8;

  .el-radio__label {
    @apply text-gray-500 p-0;
  }

  &--medium {
    .el-radio__inner {
      @apply w-[1.125rem] h-[1.125rem];

      &::after {
        @apply w-[0.5625rem] h-[0.5625rem];
      }
    }
  }

  &--large {
    .el-radio__inner {
      @apply w-[1.5rem] h-[1.5rem];

      &::after {
        @apply w-[0.75rem] h-[0.75rem];
      }
    }
  }

  .el-radio__inner {
    @apply w-[1.125rem] h-[1.125rem] after:w-[0.5625rem] after:h-[0.5625rem];
  }

  &.is-disabled {
    @apply opacity-50;
  }

  .el-radio__input {
    .el-radio__inner {
      @apply bg-white border-blue-500;
    }

    &.is-checked,
    &.is-checked.is-disabled {
      .el-radio__inner {
        @apply border-primary after:bg-primary;
      }
    }
  }
}
</style>
