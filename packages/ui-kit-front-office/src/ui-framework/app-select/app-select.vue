<template>
  <div :class="appSelectClassNames">
    <label
      v-if="getSelectedLabel && isDropdownSimple"
      class="app-input__label">
      {{ getSelectedLabel }}
    </label>
    <label
      v-else-if="label"
      class="app-input__label app-select__label">
      {{ $t(label) }}
    </label>
    <el-select
      v-model="inputModel"
      :popper-class="popperClassName"
      :clearable="false"
      :disabled="disabled"
      :class="selectClasses"
      :value-key="valueKey"
      :filterable="filterable"
      :multiple="multiple"
      :size="size"
      :placeholder="isEmptyValue ? $t(placeholder) : ''"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      @visible-change="visibleChangeHandler">
      <template #prefix>
        <slot
          name="prefix"
          v-bind="{ inputModel, selectedImage, currentItem, getSelectedLabel }">
          <img
            v-if="selectedImage"
            :src="selectedImage"
            alt="Item image"
            :class="isDropdown ? '' : 'mt-12 ml-5'"
            class="app-select__prefix-image" />
        </slot>
      </template>
      <slot v-bind="{ inputModel, selectedImage, options }">
        <slot
          name="before-options"
          v-bind="{ inputModel, selectedImage, options }" />
        <el-option
          v-for="(item, i) in options"
          :key="`option_${i}`"
          :label="getLabel(item)"
          :value="optionValue ? getProp(item, optionValue) : item"
          :disabled="item.disabled">
          <slot
            name="option"
            :scope="item">
            <i
              v-if="item.icon"
              :class="item.icon" />
            <img
              v-else-if="item.image"
              :src="item.image"
              class="w-18 h-18 inline" />
            <span>{{ getLabel(item) }}</span>
          </slot>
        </el-option>
      </slot>
    </el-select>
  </div>
</template>

<script lang="ts">
import { getProp } from '@sdk5/shared/utils';
import { Option, Select } from 'element-ui';
import { isEmpty, isEqual } from 'lodash';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { LocaleMessage } from 'vue-i18n';

import { APP_SELECT_SIZE, APP_SELECT_SIZES } from './constants';
import type { TAppSelectSize } from './types';

type TOption = string | Record<any, any>;
type TLabelFunction = (label: any) => string;

const sizeValidator = (size: unknown): boolean => APP_SELECT_SIZES.includes(size as TAppSelectSize);

export default defineComponent({
  name: 'AppSelect',
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
  },
  props: {
    value: { default: undefined, type: [String, Number, Object, Array] },
    placeholder: { default: '', type: String },
    isDropdown: { default: false, type: Boolean },
    isDropdownSimple: { default: false, type: Boolean },
    isDropdownSecondary: { default: false, type: Boolean },
    isCustom: { default: false, type: Boolean },
    multiple: { type: Boolean, default: false },
    label: { default: '', type: String },
    valueKey: { default: 'value', type: String },
    clearable: { default: false, type: Boolean },
    disabled: { default: false, type: Boolean },
    options: { default: () => [], type: Array as PropType<Record<string, any>[]> },
    optionLabel: { default: '', type: [String, Function] as PropType<string | TLabelFunction> },
    selectedLabel: { default: '', type: String },
    optionValue: { default: '', type: String },
    fullWidth: { default: false, type: Boolean },
    filterable: { default: false, type: Boolean },
    size: {
      default: APP_SELECT_SIZE.medium,
      type: String as PropType<TAppSelectSize>,
      validator: sizeValidator,
    },
    fitPopperWidth: { default: true, type: Boolean },
  },
  setup() {
    return {
      getProp,
    };
  },
  computed: {
    inputModel: {
      get(): any {
        return this.value;
      },
      set(value: any) {
        this.updateValue(value);
      },
    },
    fullWidthClass(): string {
      return this.fullWidth ? 'full-width' : '';
    },
    selectedImage(): string {
      return this.inputModel?.image || '';
    },
    filterableClass(): string {
      return this.filterable ? 'filterable' : '';
    },
    selectClasses(): string[] {
      return [this.fullWidthClass, this.filterableClass];
    },
    isEmptyValue(): boolean {
      return isEmpty(this.inputModel);
    },
    appSelectTypesClassNames() {
      return [
        this.isDropdown && 'app-select--dropdown',
        this.isDropdownSimple && 'app-select--simple',
        this.isDropdownSecondary && 'app-select--secondary',
        this.isCustom && 'app-select--custom',
      ];
    },
    sizeClassNames(): string[] {
      return [`app-select--${this.size}`, `app-input--${this.size}`];
    },
    appSelectClassNames() {
      return ['app-input', 'app-select', ...this.sizeClassNames, ...this.appSelectTypesClassNames];
    },
    popperClassName(): string {
      const classNames = ['app-select-dropdown'];

      if (this.fitPopperWidth) {
        classNames.push('app-select-dropdown--fit-width');
      }

      return classNames.join(' ');
    },
    currentItem(): any {
      return this.options.find((option) => isEqual(this.optionValue ? option[this.optionValue] : option, this.inputModel));
    },
    getSelectedLabel(): string | LocaleMessage {
      const currentItem: TOption | undefined = this.options.find((option) =>
        isEqual(this.optionValue ? option[this.optionValue] : option, this.inputModel),
      );

      if (this.selectedLabel && currentItem) {
        return this.$t(currentItem[this.selectedLabel]);
      }

      if (typeof this.optionLabel === 'function' && currentItem) {
        return this.optionLabel(currentItem);
      }

      if (typeof this.optionLabel === 'string' && currentItem) {
        return currentItem[this.optionLabel];
      }

      return this.$t(this.placeholder);
    },
  },
  methods: {
    getLabel(option: TOption): TOption {
      if (!this.optionLabel || typeof option !== 'object') {
        return option;
      }

      if (typeof this.optionLabel === 'function') {
        return this.optionLabel(option);
      }

      return this.$t(getProp(option, this.optionLabel));
    },
    visibleChangeHandler() {
      if (this.fitPopperWidth) {
        this.fitPopperWith();
      }
    },
    fitPopperWith() {
      const selectPopperElement = document.querySelectorAll<HTMLDivElement>('.app-select-dropdown.app-select-dropdown--fit-width');
      selectPopperElement.forEach((node) => {
        const nodeMinWidth = node.style.minWidth;
        node.style.maxWidth = nodeMinWidth;
      });
    },
    updateValue(value: string) {
      this.$emit('input', value);
      this.$emit('change', value);
    },
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/parts/input';
@import '../../assets/styles/parts/select_dropdown';

.app-select-dropdown {
  &.el-select-dropdown,
  &.el-select-dropdown.is-multiple {
    @apply border-none mt-3;

    .el-select-dropdown {
      &__list {
        @apply p-0;
      }

      &__item {
        &.selected {
          @apply text-blue-500;

          &::after {
            @apply right-8 #{!important};
          }
        }
      }
    }
  }
}

.el-select-group__title {
  @apply text-base text-blue-500;
}

.el-select-group__wrap:not(:last-of-type)::after {
  @apply hidden;
}

.app-select {
  @apply text-left leading-none flex flex-col;

  .el-select {
    @apply w-full;

    .el-icon-circle-close,
    .el-icon-circle-check {
      @apply hidden #{!important};
    }

    .el-input.is-focus .el-input__inner {
      @apply border-primary;
    }
  }

  &__label {
    @apply inline-flex text-black text-base mb-8 font-semibold;
  }

  &__prefix-image {
    @apply mr-8 w-18 h-18 inline rounded-round;
  }

  &.app-input {
    .el-input {
      .el-select__caret {
        @apply text-6 text-blue-600;
      }

      .el-icon-arrow-up {
        @apply text-6 font-bold;

        /* stylelint-disable */
        &::before {
          content: '\e940';
          font-family: 'icomoon', serif !important;
        }

        /* stylelint-enable */
      }

      &--large,
      &--medium,
      &--small {
        .el-input {
          &__suffix {
            &-inner {
              i.el-select__caret {
                @apply w-[1rem] h-[1rem];
              }
            }
          }
        }
      }
    }
  }

  &--custom {
    .is-focus {
      .el-input__prefix {
        @apply text-white;
      }

      .el-input__inner {
        @apply text-transparent #{!important};
      }
    }

    .el-input__prefix {
      @apply w-full pr-[3rem] text-base text-gray-500 transition duration-500;
    }

    .el-input__inner {
      @apply text-transparent #{!important};
    }

    .el-input--prefix .el-input__inner {
      @apply pl-11 #{!important};
    }
  }
}

.app-select--dropdown {
  @apply w-fit relative leading-none;

  .el-input--prefix .el-input__inner {
    @apply pl-35 #{!important};
  }

  .el-input.el-input--suffix .el-input__inner {
    @apply pr-20 #{!important};
  }

  .el-input__prefix {
    @apply flex items-center left-10 #{!important};
  }

  .el-input__suffix {
    @apply mr-10;

    .el-icon-arrow-up {
      @apply font-bold text-6 text-blue-600 w-fit #{!important};

      /* stylelint-disable */
      &::before {
        content: '\e940';
        font-family: 'icomoon', serif !important;
        @apply text-6 leading-normal #{!important};
      }

      /* stylelint-enable */
    }
  }

  .el-select {
    @apply h-full;
  }

  .el-input {
    @apply flex h-full before:hidden;

    .el-input__inner {
      @apply border-none bg-blue-200 text-blue-600 rounded-full py-9 pr-20 h-full;
    }
  }

  &.app-select--simple {
    .app-input__label {
      @apply pr-24 mb-0 text-blue-600 font-medium text-xl text-left;
    }

    .el-select {
      @apply absolute right-0 bottom-2 w-full;

      .el-input__inner {
        @apply bg-transparent w-full h-full opacity-0 p-0 #{!important};
      }
    }

    .el-input__suffix {
      @apply mr-0;
    }
  }

  &.app-select--secondary {
    .app-input__label {
      @apply text-lg font-normal text-primary;
    }
  }

  .app-input__label {
    @apply text-left w-full;
  }
}
</style>
