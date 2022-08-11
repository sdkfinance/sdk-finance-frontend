<template>
  <div class="app-date-picker">
    <el-date-picker
      :value="value"
      type="date"
      :class="selectClasses"
      :prefix-icon="prefixIcon ? prefixIcon : 'el-icon-none'"
      :editable="editable"
      :clearable="clearable"
      :format="format"
      :picker-options="pickerOptions"
      :placeholder="$t(placeholder)"
      @input="emitChange"/>
    <i
      v-if="suffixIcon"
      class="app-date-picker__suffix"
      :class="suffixIcon"/>
  </div>
</template>

<script lang="ts">
import {
  Component, Emit, Model, Prop, Vue,
} from 'vue-property-decorator';
import { DatePicker } from 'element-ui';
import { IPlainObject } from '@/types/interfaces';

@Component({
  components: {
    [DatePicker.name]: DatePicker,
  },
})
export default class AppDatePicker extends Vue {

  @Model('change') readonly value!: string;

  @Prop({ type: String, default: '' }) readonly placeholder!: string;

  @Prop({ type: Object, default: () => ({}) }) readonly pickerOptions!: object;

  @Prop({ type: String, default: '' }) readonly prefixIcon!: string;

  @Prop({ type: String, default: '' }) readonly suffixIcon!: string;

  @Prop({ default: false, type: Boolean }) readonly fullWidth!: boolean;

  @Prop({ default: false, type: Boolean }) readonly editable!: boolean;

  @Prop({ default: false, type: Boolean }) readonly clearable!: boolean;

  @Prop({ default: '', type: String }) readonly format!: boolean;

  protected get fullWidthClass(): string {
    return this.fullWidth ? 'full-width' : '';
  }

  protected get selectClasses(): IPlainObject {
    return {
      'full-width': this.fullWidth,
      'with-suffix': this.suffixIcon,
      'without-prefix': !this.prefixIcon,
    };
  }

  @Emit('change')
  protected emitChange(value: string | null): string | null {
    return value ? new Date(value).toISOString() : value;
  }

}
</script>

<style lang="scss">
@import "~@/assets/styles/parts/input";

.app-date-picker {
  position: relative;

  &__suffix {
    position: absolute;
    right: 14px;
    top: 11px;
    color: $placeholder-color;
    font-size: 12px;
  }

  .el-date-editor {
    &.without-prefix {
      .el-input__inner {
        padding-left: 14px;
      }
    }

    &.with-suffix {
      .el-input__prefix {
        display: none;
      }
    }
  }

  .full-width {
    display: block;
    width: 100% !important;
  }
}

</style>
