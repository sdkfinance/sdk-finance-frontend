<template>
  <el-date-picker
    ref="dateRangePicker"
    :value="value"
    type="daterange"
    :class="selectClasses"
    :prefix-icon="prefixIcon"
    :picker-options="pickerOptions"
    :placeholder="$t(placeholder)"
    @input="emitChange"/>
</template>

<script lang="ts">
import {
  Component, Emit, Model, Prop, Ref, Vue,
} from 'vue-property-decorator';
import { DatePicker } from 'element-ui';

@Component({
  components: {
    [DatePicker.name]: DatePicker,
  },
})
export default class AppDateRangePicker extends Vue {

  @Ref('dateRangePicker') readonly dateRangePicker!: DatePicker

  @Model('change') readonly value!: string;

  @Prop({
    type: String,
    default: '',
  }) readonly placeholder!: string;

  @Prop({
    type: Object,
    default: () => ({}),
  }) readonly pickerOptions!: object;

  @Prop({
    type: String,
    default: '',
  }) readonly prefixIcon!: string;

  @Prop({ default: false, type: Boolean }) readonly fullWidth!: boolean;

  protected get fullWidthClass(): string {
    return this.fullWidth ? 'full-width' : '';
  }

  protected get selectClasses(): string[] {
    return [this.fullWidthClass];
  }

  @Emit('change')
  protected emitChange(value: string): string[] {
    return Object.values(value)
      .map((item: string | number | Date) => new Date(item).toISOString());
  }

  public openCalendar(): void {
    this.dateRangePicker.focus();
  }

}
</script>

<style lang="scss">
@import "~@/assets/styles/parts/input";

.full-width {
  display: block;
  width: 100% !important;
}
</style>
