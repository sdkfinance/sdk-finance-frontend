<template>
  <div
    class="app-input app-select"
    :class="{
      'app-select--dropdown': isDropdown,
      'app-select--simple': isDropdownSimple,
      'app-select--secondary': isDropdownSecondary,
      'app-select--custom': isCustom
    }">
    <label
      v-if="getSelectedLabel && isDropdownSimple"
      class="app-input__label">{{ getSelectedLabel }}</label>
    <label
      v-else-if="label"
      class="app-input__label app-select__label">
      {{ $t(label) }}
    </label>
    <el-select
      v-model="inputModel"
      :clearable="isDropdown ? false : clearable"
      :disabled="disabled"
      :class="selectClasses"
      :value-key="valueKey"
      :filterable="filterable"
      :multiple="multiple"
      :size="size"
      :placeholder="isEmptyValue ? $t(placeholder) : ''"
      @focus="$emit('focus')"
      @blur="$emit('blur')">
      <template #prefix>
        <slot
          name="prefix"
          v-bind="{ inputModel, selectedImage, currentItem, getSelectedLabel }">
          <img
            v-if="selectedImage"
            :src="selectedImage"
            alt="Item image"
            :class="isDropdown ? '' : 'mt-12 ml-5'"
            class="app-select__prefix-image">
        </slot>
      </template>
      <slot v-bind="{ inputModel, selectedImage, options }">
        <slot
          name="before-options"
          v-bind="{ inputModel, selectedImage, options }"/>
        <el-option
          v-for="(item, i) in options"
          :key="`option_${i}`"
          :label="getLabel(item)"
          :value="optionValue ? item[optionValue] : item">
          <slot
            name="option"
            :scope="item">
            <i
              v-if="item.icon"
              class="mr-10"
              :class="item.icon"/>
            <img
              v-else-if="item.image"
              :src="item.image"
              alt="Item image"
              class="mr-10 w-18 h-18 inline">
            {{ getLabel(item) }}
          </slot>
        </el-option>
      </slot>
    </el-select>
  </div>
</template>

<script lang="ts">
import { Option, Select } from 'element-ui';
import { isEmpty, isEqual } from 'lodash';
import { LocaleMessage } from 'vue-i18n';
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';

import { getProp } from '@/utils';

const sizeValidator = (size: string): boolean => ['medium', 'small', 'mini', ''].includes(size);

type TOption = string | { [key: string]: any };
type TLabelFunction = (label: TOption) => string;

@Component({
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
  },
})
export default class AppSelect extends Vue {

  @Prop() readonly value!: any;

  @Prop({ default: '', type: String }) readonly placeholder!: string;

  @Prop({ default: false, type: Boolean }) readonly isDropdown!: boolean;

  @Prop({ default: false, type: Boolean }) readonly isDropdownSimple!: boolean;

  @Prop({ default: false, type: Boolean }) readonly isDropdownSecondary!: boolean;

  @Prop({ default: false, type: Boolean }) readonly isCustom!: boolean;

  @Prop({ type: Boolean, default: false }) readonly multiple!: boolean;

  @Prop({ default: '', type: String }) readonly label!: string;

  @Prop({ default: 'value', type: String }) readonly valueKey!: string;

  @Prop({ default: false, type: Boolean }) readonly clearable!: boolean;

  @Prop({ default: false, type: Boolean }) readonly disabled!: boolean;

  @Prop({ default: () => ([]), type: Array }) readonly options!: [];

  @Prop({ default: '', type: [String, Function] }) readonly optionLabel!: string | TLabelFunction;

  @Prop({ default: '', type: String }) readonly selectedLabel!: string;

  @Prop({ default: '', type: String }) readonly optionValue!: string;

  @Prop({ default: false, type: Boolean }) readonly fullWidth!: boolean;

  @Prop({ default: false, type: Boolean }) readonly filterable!: boolean;

  @Prop({ default: 'medium', type: String, validator: sizeValidator }) readonly size!: string;

  protected get inputModel(): any {
    return this.value;
  }

  protected set inputModel(value: any) {
    this.updateValue(value);
  }

  protected get fullWidthClass(): string {
    return this.fullWidth ? 'full-width' : '';
  }

  protected get selectedImage(): string {
    return this.inputModel?.image || '';
  }

  protected get filterableClass(): string {
    return this.filterable ? 'filterable' : '';
  }

  protected get selectClasses(): string[] {
    return [this.fullWidthClass, this.filterableClass];
  }

  protected get isEmptyValue(): boolean {
    return isEmpty(this.inputModel);
  }

  @Emit('input')
  @Emit('change')
  protected updateValue(value: string): string {
    return value;
  }

  protected getLabel(option: TOption): TOption {
    if (!this.optionLabel || typeof option !== 'object') {
      return option;
    }

    if (typeof this.optionLabel === 'function') {
      return this.optionLabel(option);
    }

    return this.$t(getProp(option, this.optionLabel));
  }

  protected get currentItem(): any {
    return this.options
      .find((option) => isEqual((this.optionValue ? option[this.optionValue] : option), this.inputModel));
  }

  protected get getSelectedLabel(): string | LocaleMessage {
    const currentItem: TOption | undefined = this.options
      .find((option) => isEqual((this.optionValue ? option[this.optionValue] : option), this.inputModel));

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
  }

}
</script>

<style lang="scss">
@import "~@/assets/styles/parts/input";

.el-select {
  @apply w-full;

  .el-icon-circle-close,
  .el-icon-circle-check {
    @apply hidden #{!important};
  }
}

.el-select:not(.filterable) {
  .is-focus {
    .el-input__inner {
      @apply bg-blue-accent text-white border-blue-accent;

      &::placeholder {
        @apply text-white;
      }
    }

    .el-input__suffix,
    .el-select__caret.is-reverse {
      @apply text-white;
    }
  }
}

.el-select-dropdown,
.el-select-dropdown.is-multiple {
  @apply rounded-sm mt-3;

  box-shadow: 0 0 16px rgb(224 237 255 / 70%);

  .popper__arrow {
    @apply hidden;
  }

  .el-select-dropdown__item {
    @apply h-32 text-lg;

    line-height: 32px;
    color: $placeholder-color;

    &.selected {
      @apply font-medium text-blue-accent;

      &::after {
        @apply right-8 #{!important};
      }
    }

    &:hover,
    &.hover {
      background-color: $secondary-color !important;
    }
  }
}

.el-popper[x-placement^="bottom"] {
  @apply mt-3;
}

.el-select-group__title {
  @apply text-base text-blue-500;
}

.el-select-group__wrap:not(:last-of-type)::after {
  @apply hidden;
}

.app-select {
  @apply text-left leading-none flex flex-col;

  &__label {
    @apply inline-block text-black text-base mb-8 font-semibold;
  }

  &__prefix-image {
    @apply mr-8 w-18 h-18 inline rounded-round;
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
      @apply w-full pr-40 text-base text-gray-500 transition duration-500;
    }

    .el-input__inner {
      @apply text-transparent #{!important};
    }

    .el-input--prefix .el-input__inner {
      @apply pl-11 #{!important};
    }
  }

  .el-icon-arrow-up {
    @apply text-6 font-bold;

    /* stylelint-disable */
    &::before {
      content: "\e940";
      font-family: 'icomoon', serif !important;
      @apply text-6 leading-normal #{!important};
    }
    /* stylelint-enable */
  }

  .el-select .el-input .el-select__caret {
    @apply text-6 text-blue-600;
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
        content: "\e940";
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
    @apply flex h-full;

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
      @apply text-lg font-normal text-blue-700;
    }
  }

  .app-input__label {
    @apply text-left w-full;
  }
}

</style>
