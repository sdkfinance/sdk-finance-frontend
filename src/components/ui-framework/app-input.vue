<template>
  <div class="app-input">
    <label
      v-if="label"
      class="app-input__label">{{ $t(label) }}</label>

    <slot>
      <component
        :is="inputComponentName"
        ref="appInput"
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
        :size="size"
        :clearable="clearable"
        :disabled="disabled"
        :show-password="showPassword"
        :autocomplete="autocomplete"
        :controls="false"
        v-bind="$attrs"
        v-on="$listeners">
        <template #suffix>
          <slot name="suffix"/>
        </template>
      </component>

      <p
        v-if="!hasInputError && helper"
        class="app-input__helper">
        {{ helper }}
      </p>
    </slot>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Emit, Vue, Ref,
} from 'vue-property-decorator';
import { Input } from 'element-ui';
import { IPlainObject } from '@/types/interfaces';

const sizeValidator = (size: string): boolean => ['medium', 'small', 'mini', ''].includes(size);

export type TInputValue = string | number;

@Component({
  inheritAttrs: false,
  components: {
    [Input.name]: Input,
  },
})
export default class AppInput extends Vue {

  @Ref('appInput') readonly inputField!: AppInput;

  @Prop({ type: [String, Number] }) readonly value!: TInputValue;

  @Prop({ type: String, default: 'text' }) readonly type!: string;

  @Prop({ type: String, default: '' }) readonly prefixIcon!: string;

  @Prop({ type: String, default: '' }) readonly suffixIcon!: string;

  @Prop({ type: String, default: '' }) readonly label!: string;

  @Prop({ type: Number, default: null }) readonly maxlength!: number;

  @Prop({ type: Number, default: null }) readonly minlength!: number;

  @Prop({ type: Number, default: Number.MIN_SAFE_INTEGER }) readonly min!: number;

  @Prop({ type: Number, default: Number.MAX_SAFE_INTEGER }) readonly max!: number;

  @Prop({ type: Number, default: 2 }) readonly rows!: number;

  @Prop({ default: '', type: String }) readonly placeholder!: string;

  @Prop({ default: false, type: Boolean }) readonly clearable!: boolean;

  @Prop({ default: false, type: Boolean }) readonly showPassword!: boolean;

  @Prop({ default: false, type: Boolean }) readonly disabled!: boolean;

  @Prop({ default: false, type: Boolean }) readonly smallText!: boolean;

  @Prop({ type: String, default: '' }) readonly name!: string;

  @Prop({ type: String, default: 'off' }) readonly autocomplete!: string;

  @Prop({ default: 'medium', type: String, validator: sizeValidator }) readonly size!: string;

  @Prop({ default: '', type: String }) readonly helper!: string;

  protected elInput: IPlainObject = {};

  protected get inputModel(): TInputValue {
    return this.value;
  }

  protected get inputComponentName(): string {
    return this.type === 'number' ? 'el-input-number' : 'el-input';
  }

  protected set inputModel(value: TInputValue) {
    this.updateValue(value);
  }

  protected get smallTextClass() {
    return this.smallText ? 'small-text' : '';
  }

  protected get inputClasses() {
    return [this.smallTextClass];
  }

  protected get hasInputError(): boolean {
    return this.elInput?.validateState === 'error';
  }

  public focus(): void {
    this.inputField.focus();
  }

  @Emit('blur')
  public emitBlur(e: Event): Event {
    return e;
  }

  @Emit('input')
  protected updateValue(value: TInputValue): TInputValue {
    return value;
  }

  @Emit('change')
  protected changeValue(value: TInputValue): TInputValue {
    return value;
  }

  protected mounted(): void {
    this.elInput = this.$refs.appInput || {};
  }

}
</script>

<style lang="scss">
@import "~@/assets/styles/parts/input";

.app-input {
  @apply text-left leading-none;

  &__label {
    @apply font-semibold mb-8 text-black inline-block;
  }

  .small-text {
    @apply text-sm;
  }

  &__helper {
    @apply absolute top-full left-0 text-blue-600 text-sm text-left pt-2 mt-4;
  }

  &__additional {
    @apply flex items-center bg-white pl-10 font-medium my-2 mr-10;
  }

  .el-input--small .el-input__inner {
    @apply text-sm;
  }
}
</style>
