<template>
  <div :class="appInputClassNames">
    <div
      v-if="currentInputLabel || $slots['label-action']"
      class="app-input__label-container">
      <label class="app-input__label">
        {{ $t(currentInputLabel) }}
      </label>
      <slot name="label-action" />
    </div>

    <slot>
      <el-input
        ref="elInput"
        v-model="inputModel"
        :prefix-icon="prefixIcon"
        :suffix-icon="suffixIcon"
        :name="name"
        :type="type"
        :minlength="minlength"
        :rows="rows"
        :min="min"
        :max="max"
        :class="inputClasses"
        :placeholder="$t(placeholder)"
        :size="currentInputSize"
        :clearable="clearable"
        :disabled="disabled"
        :show-password="showPassword"
        :autocomplete="autocomplete"
        :controls="false"
        :readonly="readonly"
        :resize="resize"
        :autosize="autosize"
        v-bind="$attrs"
        @blur="emitBlurAndFocusOutEvents"
        @focus="emitFocus">
        <template #suffix>
          <slot name="suffix" />
        </template>
        <template #prefix>
          <slot name="prefix" />
        </template>
      </el-input>

      <p
        v-if="!hasInputError && helper"
        class="app-input__helper">
        {{ helper }}
      </p>
    </slot>
  </div>
</template>

<script lang="ts">
import { Input } from 'element-ui';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import { APP_INPUT_SIZE, APP_INPUT_TYPE, appInputSizeValidator } from './constants';
import type { TAppInputResizeProp, TAppInputSize, TAppInputType, TAppInputValue } from './types';

type IPlainObject = Record<string, any>;

export default defineComponent({
  name: 'AppInput',
  components: {
    [Input.name]: Input,
  },
  inheritAttrs: false,
  props: {
    value: { type: [String, Number], default: undefined },
    type: { type: String as PropType<TAppInputType>, default: APP_INPUT_TYPE.text },
    prefixIcon: { type: String, default: '' },
    suffixIcon: { type: String, default: '' },
    label: { type: String, default: '' },
    maxlength: { type: Number, default: null },
    minlength: { type: Number, default: null },
    min: { type: Number, default: Number.MIN_SAFE_INTEGER },
    max: { type: Number, default: Number.MAX_SAFE_INTEGER },
    rows: { type: Number, default: 2 },
    placeholder: { default: '', type: String },
    clearable: { default: false, type: Boolean },
    showPassword: { default: false, type: Boolean },
    disabled: { default: false, type: Boolean },
    smallText: { default: false, type: Boolean },
    name: { type: String, default: '' },
    autocomplete: { type: String, default: 'off' },
    size: {
      default: APP_INPUT_SIZE.medium,
      type: String as PropType<TAppInputSize>,
      validator: appInputSizeValidator,
    },
    helper: { default: '', type: String },
    filterView: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    resize: { type: String as PropType<TAppInputResizeProp>, default: undefined },
    autosize: { type: Boolean, default: false },
  },
  data() {
    const elInput: IPlainObject = {};

    return {
      elInput,
    };
  },
  computed: {
    validSize() {
      const sizeIsValid = appInputSizeValidator(this.size);

      if (!sizeIsValid) {
        return APP_INPUT_SIZE.large;
      }

      return this.size;
    },
    currentInputLabel(): string {
      if (this.filterView) {
        return '';
      }

      return this.label;
    },
    currentInputSize(): TAppInputSize {
      if (this.filterView) {
        return APP_INPUT_SIZE.small;
      }

      return this.validSize;
    },
    filterViewClassName(): string[] {
      return [this.filterView ? 'app-input--filter-view' : ''];
    },
    disabledClassName(): string[] {
      return [this.disabled ? 'app-input--disabled' : ''];
    },
    helpTextClassName(): string[] {
      return [this.helper ? 'app-input--help-text' : ''];
    },
    sizeClassNames(): string[] {
      return [`app-input--${this.currentInputSize}`];
    },
    appInputClassNames(): string[] {
      return ['app-input', ...this.sizeClassNames, ...this.helpTextClassName, ...this.disabledClassName, ...this.filterViewClassName];
    },
    inputModel: {
      get(): TAppInputValue {
        return Number.isNaN(this.value) ? '' : (this.value as TAppInputValue);
      },
      set(value: TAppInputValue) {
        this.updateValue(value);
      },
    },
    smallTextClass() {
      return this.smallText ? 'small-text' : '';
    },
    inputClasses() {
      return [this.smallTextClass];
    },
    hasInputError(): boolean {
      return this.elInput?.validateState === 'error';
    },
    inputField: {
      cache: false,
      get() {
        return this.$refs.elInput as Input & {
          resizeTextarea?: () => void;
        };
      },
      set() {},
    },
  },
  mounted(): void {
    this.elInput = this.$refs.appInput || {};
  },
  methods: {
    focus(): void {
      this.inputField.focus();
    },
    emitBlur() {
      this.inputField?.blur();
    },
    resizeTextarea() {
      if (typeof this.inputField?.resizeTextarea !== 'function' || this.type !== APP_INPUT_TYPE.textarea) {
        return;
      }

      this.inputField.resizeTextarea();
    },
    emitFocus(e: Event) {
      this.$emit('focus', e);
      this.$emit('focusin', e);
    },
    emitBlurAndFocusOutEvents(e: Event) {
      this.$emit('blur', e);
      this.$emit('focusout', e);
    },
    updateValue(value: TAppInputValue) {
      this.$emit('input', value);
    },
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/parts/input';

.app-input {
  @apply text-left leading-none;

  .small-text {
    @apply text-sm;
  }

  &__additional {
    @apply flex items-center bg-white pl-10 font-medium my-2 mr-10;
  }
}
</style>
