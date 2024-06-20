<template>
  <component
    :is="currentComponent"
    :class="buttonClasses"
    :size="size"
    :to="to"
    :type="validButtonType"
    :native-type="nativeType"
    :loading="isLoading"
    :disabled="disabled"
    v-on="$listeners">
    <i
      v-if="icon"
      :class="iconClasses" />
    <slot v-if="!onlyIcon" />
    <i
      v-if="iconRight && !onlyIcon"
      :class="iconRightClasses" />
  </component>
</template>

<script setup lang="ts">
import classNames from 'classnames';
import { Button as ELButton } from 'element-ui';
import type { PropType } from 'vue';
import { computed } from 'vue';

import { APP_BUTTON_SIZE, APP_BUTTON_SIZES, APP_BUTTON_TYPES } from './constants';
import type { TAppButtonNativeType, TAppButtonSize, TAppButtonType } from './types';

const typeValidator = (type: string): boolean => !!APP_BUTTON_TYPES[type as TAppButtonType];

const props = defineProps({
  size: {
    default: APP_BUTTON_SIZE.big,
    type: String as PropType<TAppButtonSize>,
    validator: (size: unknown): boolean => APP_BUTTON_SIZES.includes(size as TAppButtonSize),
  },
  type: {
    default: APP_BUTTON_TYPES.secondary,
    type: String as PropType<TAppButtonType>,
    validator: (type: string): boolean => !!APP_BUTTON_TYPES[type as TAppButtonType],
  },
  nativeType: {
    default: 'submit',
    type: String as PropType<TAppButtonNativeType>,
  },
  outlined: {
    default: false,
    type: Boolean,
  },
  rounded: {
    default: false,
    type: Boolean,
  },
  fullWidth: {
    default: false,
    type: Boolean,
  },
  disabled: {
    default: false,
    type: Boolean,
  },
  isLoading: {
    default: false,
    type: Boolean,
  },
  isLink: {
    default: false,
    type: Boolean,
  },
  to: {
    default: null,
    type: [Object, String],
  },
  secondary: {
    default: false,
    type: Boolean,
  },
  icon: {
    default: '',
    type: String,
  },
  iconRight: {
    default: '',
    type: String,
  },
  transparent: {
    default: false,
    type: Boolean,
  },
  onlyIcon: {
    default: false,
    type: Boolean,
  },
  noPadding: {
    type: Boolean,
    default: false,
  },
  underline: {
    type: Boolean,
    default: false,
  },
});

const BASE_ICON_CLASS_NAMES = classNames('btn-icon', 'icon');
const BASE_CLASS_NAME = 'btn-front-office';

const currentComponent = computed(() => (props.to && !props.disabled ? 'RouterLink' : ELButton));
const validButtonType = computed(() => {
  const isTypeValid = typeValidator(props.type);

  if (!isTypeValid) {
    return APP_BUTTON_TYPES.secondary;
  }

  return props.type;
});
const typeCLass = computed(() => {
  const buttonTypeClasses: Record<TAppButtonType, string> = {
    [APP_BUTTON_TYPES.primary]: 'btn--primary',
    [APP_BUTTON_TYPES.warning]: 'btn--warning',
    [APP_BUTTON_TYPES.secondary]: 'btn--secondary',
  };

  return buttonTypeClasses[validButtonType.value] ?? '';
});
const iconClasses = computed(() => classNames(BASE_ICON_CLASS_NAMES, props.icon, 'btn-icon--left'));
const iconRightClasses = computed(() => classNames(BASE_ICON_CLASS_NAMES, props.iconRight, 'btn-icon--right'));
const sizeClass = computed(() => (props.size ? `btn--${props.size === 'mini' ? APP_BUTTON_SIZE.small : props.size}` : ''));
const buttonClasses = computed(() =>
  classNames([
    'app-button',
    BASE_CLASS_NAME,
    sizeClass.value,
    typeCLass.value,
    props.underline && 'btn--underline',
    props.noPadding && 'btn--no-padding',
    props.fullWidth && 'btn--full-width',
    props.to && 'btn--link',
    props.secondary && 'btn--secondary',
    props.transparent && 'btn--transparent',
    props.outlined && 'btn--outlined',
    props.onlyIcon && 'btn--only-icon',
    props.rounded && 'btn--rounded',
  ]),
);
</script>

<style lang="scss">
.btn-front-office {
  &,
  & > span {
    @apply w-fit
    h-auto
    relative
    box-border
    inline-flex
    gap-x-[0.25rem]
    justify-center
    items-center
    text-center
    border-none;
  }

  &:disabled.is-disabled {
    @apply bg-gray-300 text-gray-600 border-transparent hover:bg-gray-300 hover:text-gray-600 hover:border-transparent;
  }

  &,
  &.btn--outlined::before {
    transition:
      background-color 0.3s,
      color 0.3s,
      border-color 0.3s;
  }

  &.btn {
    &--primary,
    &--warning {
      @apply text-gray-100 hover:text-gray-100;
    }

    &--primary {
      @apply bg-primary hover:bg-primary-hover hover:border-transparent focus:bg-primary-hover active:bg-primary-hover;
    }

    &--secondary {
      @apply bg-blue-200 text-blue-600 hover:bg-blue-250 hover:text-blue-600;
    }

    &--warning {
      @apply bg-red-warning hover:bg-red-warning;
    }

    &--link {
      @apply whitespace-nowrap;
    }

    &--only-icon {
      &.btn--large {
        @apply p-[1rem];
      }

      &.btn--big {
        @apply p-[0.75rem];
      }

      &.btn--medium {
        @apply p-[0.5rem];
      }

      &.btn--small,
      &.btn--mini {
        @apply p-[0.375rem];
      }
    }

    &--large {
      @apply py-[0.75rem] px-[1rem];
    }

    &--big {
      @apply py-[0.5625rem] px-[1rem];
    }

    &--medium {
      @apply py-[0.375rem] px-[0.75rem] rounded-[0.375rem] text-button-m;
    }

    &--small,
    &--mini {
      @apply py-[0.375rem] px-[0.5rem] rounded-[0.25rem] text-button-s;
    }

    &--large,
    &--big {
      @apply rounded-[0.5rem] text-button-l;
    }

    &--full-width {
      @apply w-full;
    }

    &--transparent,
    &--transparent:hover,
    &--transparent:active,
    &--transparent:focus {
      @apply bg-transparent border-transparent font-medium;
    }

    &--underline span {
      @apply underline underline-offset-4 decoration-dashed leading-[18px];
    }

    &--transparent:disabled.is-disabled {
      @apply bg-transparent;
    }

    &--rounded {
      @apply rounded-full;
    }

    &--no-padding {
      @apply p-0;
    }

    &--outlined {
      @apply bg-gray-100
      hover:bg-gray-100
      before:content-[""]
      before:absolute
      before:top-0
      before:left-0
      before:w-full
      before:h-full
      before:rounded-[inherit]
      before:border-[0.125rem]
      before:border-solid;

      &:disabled.is-disabled {
        @apply text-gray-600 before:border-gray-300 bg-gray-100 hover:text-gray-600 hover:bg-gray-100 hover:before:border-gray-300;
      }

      &:not(:disabled.is-disabled) {
        &.btn--secondary,
        &.btn--primary {
          @apply before:border-blue-400 hover:before:border-blue-500 text-blue-600 hover:text-blue-600;
        }

        &.btn--warning {
          @apply text-red-warning hover:text-red-warning before:border-red-warning hover:before:text-red-warning;
        }
      }
    }
  }

  .btn-icon {
    @apply inline-flex items-center justify-center w-[1rem] h-[1rem] text-[0.5rem] leading-[normal];
  }
}
</style>
