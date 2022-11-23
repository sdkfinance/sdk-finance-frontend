<template>
  <date-range-picker
    ref="dateRangePicker"
    v-resize:throttle="onResize"
    :value="value"
    :date-range="rangeValue"
    auto-apply
    :single-date-picker="visibilityModel"
    :ranges="false"
    always-show-calendars
    @update="emitChange"/>
</template>

<script lang="ts">
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';

import {
  Component, Emit, Prop, Ref, Vue,
} from 'vue-property-decorator';
import DateRangePicker from 'vue2-daterange-picker';

import { IPlainObject } from '@/types/interfaces';
import { checkMobile } from '@/utils';

@Component({
  components: {
    DateRangePicker,
  },
})
export default class AppDaterangePicker extends Vue {

  @Ref('dateRangePicker') readonly dateRangePicker!: any;

  @Prop({
    type: [Array, String],
    default: '',
  }) readonly value!: [] | string;

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

  protected isMobile: boolean = false;

  protected rangeValue: IPlainObject = {
    startDate: null,
    endDate: null,
  }

  protected get visibilityModel(): 'range' | boolean {
    if (this.isMobile) {
      return 'range';
    }

    return false;
  }

  protected onResize(): void {
    this.isMobile = checkMobile();
  }

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

  public toggleCalendar(value: boolean = true): void {
    this.dateRangePicker.togglePicker(value);
  }

}
</script>
