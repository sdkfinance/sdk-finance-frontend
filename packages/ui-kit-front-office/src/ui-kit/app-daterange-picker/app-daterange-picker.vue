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
    @update="emitChange" />
</template>

<script lang="ts">
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';

import type { IPlainObject } from '@sdk5/shared/types';
import { checkMobile } from '@sdk5/shared/utils';
import { defineComponent } from 'vue';
import DateRangePicker from 'vue2-daterange-picker';

export default defineComponent({
  name: 'AppDaterangePicker',
  components: {
    DateRangePicker,
  },
  props: {
    value: {
      type: [Array, String],
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    pickerOptions: {
      type: Object,
      default: () => ({}),
    },
    prefixIcon: {
      type: String,
      default: '',
    },
    fullWidth: { default: false, type: Boolean },
  },
  data() {
    const rangeValue: IPlainObject = {
      startDate: null,
      endDate: null,
    };
    const isMobile: boolean = false;

    return {
      isMobile,
      rangeValue,
    };
  },
  computed: {
    visibilityModel(): 'range' | boolean {
      if (this.isMobile) {
        return 'range';
      }

      return false;
    },
    fullWidthClass(): string {
      return this.fullWidth ? 'full-width' : '';
    },
    selectClasses(): string[] {
      return [this.fullWidthClass];
    },
    dateRangePicker: {
      cache: false,
      get() {
        return this.$refs.dateRangePicker as any;
      },
      set() {},
    },
  },
  methods: {
    onResize(): void {
      this.isMobile = checkMobile();
    },
    toggleCalendar(value: boolean = true): void {
      this.dateRangePicker.togglePicker(value);
    },
    emitChange(value: string) {
      this.$emit(
        'change',
        Object.values(value).map((item: string | number | Date) => new Date(item).toISOString()),
        value,
      );
    },
  },
});
</script>
