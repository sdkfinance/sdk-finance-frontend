<template>
  <component
    :is="to ? 'router-link' : 'el-button'"
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

<script lang="ts">
import classNames from 'classnames';
import { Button } from 'element-ui';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import { APP_BUTTON_SIZE, APP_BUTTON_SIZES, APP_BUTTON_TYPES } from './constants';
import type { TAppButtonNativeType, TAppButtonSize, TAppButtonType } from './types';

const sizeValidator = (size: unknown): boolean => APP_BUTTON_SIZES.includes(size as TAppButtonSize);
const typeValidator = (type: string): boolean => !!APP_BUTTON_TYPES[type as TAppButtonType];

export default defineComponent({
  name: 'AppButton',
  components: {
    [Button.name]: Button,
  },
  props: {
    size: {
      default: APP_BUTTON_SIZE.big,
      type: String as PropType<TAppButtonSize>,
      validator: sizeValidator,
    },
    type: {
      default: APP_BUTTON_TYPES.secondary,
      type: String as PropType<TAppButtonType>,
      validator: typeValidator,
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
  },
  computed: {
    validButtonType(): TAppButtonType {
      const isTypeValid = typeValidator(this.type);

      if (!isTypeValid) {
        return APP_BUTTON_TYPES.secondary;
      }

      return this.type;
    },
    buttonClasses(): string {
      return classNames([
        'app-button',
        'btn',
        this.noPadding && 'btn--no-padding',
        this.sizeClass,
        this.fullWidthClass,
        this.linkClass,
        this.secondaryClass,
        this.transparentClass,
        this.outlinedClass,
        this.typeCLass,
        this.onlyIconClass,
        this.roundedClass,
      ]);
    },
    typeCLass(): string {
      const buttonTypeClasses: Record<TAppButtonType, string> = {
        [APP_BUTTON_TYPES.primary]: 'btn--primary',
        [APP_BUTTON_TYPES.warning]: 'btn--warning',
        [APP_BUTTON_TYPES.secondary]: 'btn--secondary',
      };

      return buttonTypeClasses[this.validButtonType] ?? '';
    },
    iconClasses(): string[] {
      return ['btn-icon icon', this.icon, 'btn-icon--left'];
    },
    iconRightClasses(): string[] {
      return ['btn-icon icon', this.iconRight, 'btn-icon--right'];
    },
    sizeClass(): string {
      return this.size ? `btn--${this.size === 'mini' ? APP_BUTTON_SIZE.small : this.size}` : '';
    },
    fullWidthClass(): string {
      return this.fullWidth ? 'btn--full-width' : '';
    },
    linkClass(): string {
      return this.to ? 'btn--link' : '';
    },
    secondaryClass(): string {
      return this.secondary ? 'btn--secondary' : '';
    },
    transparentClass(): string {
      return this.transparent ? 'btn--transparent' : '';
    },
    outlinedClass(): string {
      return this.outlined ? 'btn--outlined' : '';
    },
    roundedClass(): string {
      return this.rounded ? 'btn--rounded' : '';
    },
    onlyIconClass(): string {
      return this.onlyIcon ? 'btn--only-icon' : '';
    },
  },
});
</script>

<style lang="scss">
.btn,
.btn.btn--outlined::before {
  transition:
    background-color 0.3s,
    color 0.3s,
    border-color 0.3s;
}

.btn,
.btn > span {
  @apply w-fit
    h-auto
    relative
    box-border
    inline-flex
    gap-x-[0.25rem]
    justify-center
    items-center
    text-center
    border-none
    disabled:cursor-default
    disabled:bg-gray-300
    disabled:text-gray-600
    disabled:border-transparent
    disabled:hover:bg-gray-300
    disabled:hover:text-gray-600
    disabled:hover:border-transparent;
}

.btn {
  &--primary,
  &--warning {
    @apply text-gray-100 hover:text-gray-100;
  }

  &--primary {
    @apply bg-blue-700 hover:bg-blue-800;
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

  &:not(&--only-icon) {
    &.btn--large {
      @apply py-[0.75rem] px-[1rem];
    }

    &.btn--big {
      @apply py-[0.5625rem] px-[1rem];
    }

    &.btn--medium {
      @apply py-[0.375rem] px-[0.75rem];
    }

    &.btn--small,
    &.btn--mini {
      @apply py-[0.375rem] px-[0.5rem];
    }
  }

  &--large,
  &--big {
    @apply rounded-[0.5rem] text-button-l;
  }

  &--medium {
    @apply rounded-[0.375rem] text-button-m;
  }

  &--small,
  &--mini {
    @apply rounded-[0.25rem] text-button-s;
  }

  &--full-width {
    @apply w-full #{!important};
  }

  &--transparent {
    background-color: transparent;
    color: #7288a3;
    padding: 5px;
    border-color: transparent;
  }

  &--transparent:hover,
  &--transparent:active,
  &--transparent:focus {
    background-color: transparent;
    color: #4c617f;
    border-color: transparent;
  }

  &--transparent:disabled {
    @apply bg-transparent;
  }

  &--rounded {
    @apply rounded-full;
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
      before:border-solid
      disabled:text-gray-600
      disabled:before:border-gray-300
      disabled:bg-gray-100
      disabled:hover:text-gray-600
      disabled:hover:bg-gray-100
      disabled:hover:before:border-gray-300;

    &:not(:disabled) {
      &.btn--secondary,
      &.btn--primary {
        @apply before:border-blue-400 hover:before:border-blue-500 text-blue-600 hover:text-blue-600;
      }

      &.btn--warning {
        @apply text-red-warning hover:text-red-warning before:border-red-warning hover:before:text-red-warning;
      }
    }
  }

  .btn-icon {
    @apply inline-flex items-center justify-center w-[1rem] h-[1rem] text-[0.5rem] leading-[normal];
  }
}

.app-button.btn.btn--no-padding {
  @apply p-0;
}
</style>
