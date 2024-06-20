<template>
  <label :class="appSwitchClassnames">
    <span
      v-if="isShowLabelBefore"
      :class="leftLabelClassList">
      {{ calculatedLeftLabel }}
      <slot name="afterLabel" />
    </span>
    <el-switch
      :value="value"
      :disabled="disabled"
      :width="width"
      @change="switchChangeHandler" />
    <span
      v-if="isShowLabelAfter"
      :class="rightLabelClassList">
      {{ calculatedRightLabel }}
    </span>
  </label>
</template>

<script lang="ts">
export default {
  name: 'AppSwitch',
  model: {
    prop: 'value',
    event: 'change',
  },
};
</script>

<script setup lang="ts">
import { useI18n } from '@sdk5/shared/i18n';
import classNames from 'classnames';
import { Switch as ElSwitch } from 'element-ui';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label?: string;
    enableLabel?: string;
    disableLabel?: string;
    isDynamicLabelColor?: boolean;
    isLabelAfter?: boolean;
    fullWidth?: boolean;
    secondary?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    value?: boolean;
    leftLabel?: string;
    rightLabel?: string;
    width?: number;
  }>(),
  {
    label: '',
    enableLabel: '',
    disableLabel: '',
    isDynamicLabelColor: false,
    isLabelAfter: false,
    fullWidth: false,
    secondary: false,
    disabled: false,
    readonly: false,
    width: 30,
    leftLabel: undefined,
    rightLabel: undefined,
    value: undefined,
  },
);

const emit = defineEmits<{
  (event: 'change', payload: boolean): void;
}>();

const { t } = useI18n();

const isDynamicLabel = computed(() => Boolean(props.enableLabel) && Boolean(props.disableLabel));
const isShowLabelBefore = computed(() => props.leftLabel || ((!!props.label || isDynamicLabel.value) && !props.isLabelAfter));
const isShowLabelAfter = computed(() => props.rightLabel || ((!!props.label || isDynamicLabel.value) && props.isLabelAfter));
const isDoubleLabelView = computed(() => !!props.leftLabel && !!props.rightLabel);
const calculatedLeftLabel = computed(() => {
  if (isDoubleLabelView.value) {
    return t(props.leftLabel!).toString();
  }

  if (isDynamicLabel.value) {
    return props.value ? (t(props.enableLabel) as string) : (t(props.disableLabel) as string);
  }

  return t(props.label) as string;
});
const calculatedRightLabel = computed(() => {
  if (isDoubleLabelView.value) {
    return t(props.rightLabel!).toString();
  }

  if (isDynamicLabel.value) {
    return props.value ? (t(props.enableLabel) as string) : (t(props.disableLabel) as string);
  }

  return t(props.label) as string;
});
const isRightLabelActive = computed(() => props.isDynamicLabelColor && props.value);
const isLeftLabelActive = computed(() => {
  if (props.isDynamicLabelColor) {
    return isDoubleLabelView.value ? !props.value : props.value;
  }

  return false;
});
const leftLabelClassList = computed(() =>
  classNames('app-switch__label', 'app-switch__label--before', {
    'app-switch__label--active': isLeftLabelActive.value,
    'app-switch__label--inactive': !isLeftLabelActive.value,
  }),
);
const rightLabelClassList = computed(() =>
  classNames('app-switch__label', 'app-switch__label--after', {
    'app-switch__label--active': isRightLabelActive.value,
    'app-switch__label--inactive': !isRightLabelActive.value,
  }),
);
const appSwitchClassnames = computed(() =>
  classNames(
    'app-switch',
    'app-switch--front-office',
    { 'app-switch--full-width': props.fullWidth },
    { 'app-switch--secondary': props.secondary },
    { 'app-switch--disabled': props.disabled },
    { 'app-switch--double-label': isDoubleLabelView.value },
  ),
);

const switchChangeHandler = (value: boolean) => {
  if (props.readonly) {
    return;
  }

  emit('change', value);
};
</script>

<style lang="scss">
.app-switch.app-switch--front-office {
  @apply inline-flex items-center gap-x-[0.5rem];

  &.app-switch {
    &--full-width {
      @apply w-full flex items-center justify-between;
    }

    &--disabled,
    .el-switch.is-disabled {
      @apply opacity-50;
    }

    &--double-label {
      .app-switch {
        &__label {
          &--active {
            @apply text-primary;
          }
        }
      }
    }

    .el-switch__core {
      @apply bg-blue-500
      border-none
      h-[1.125rem]
      rounded-[0.8125rem]
      after:top-[0.125rem]
      after:left-[0.125rem]
      after:w-[0.875rem]
      after:h-[0.875rem]
      after:bg-gray-100;
    }

    &--double-label .el-switch .el-switch__core,
    .el-switch.is-checked .el-switch__core {
      @apply bg-primary after:bg-gray-100;
    }

    .el-switch.is-checked .el-switch__core {
      @apply after:ml-[-1.0625rem] after:left-full;
    }
  }

  .app-switch {
    &__label {
      @apply inline-flex items-center font-medium leading-[1.375rem] m-0 text-[0.875rem] text-blue-500 transition-colors duration-200 ease-in-out;

      &--active {
        @apply text-black;
      }
    }
  }
}
</style>
