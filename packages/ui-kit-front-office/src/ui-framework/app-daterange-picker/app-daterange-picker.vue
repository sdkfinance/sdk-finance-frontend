<template>
  <el-date-picker
    ref="dateRangePicker"
    :value="value"
    type="daterange"
    :class="selectClasses"
    :prefix-icon="prefixIcon"
    :picker-options="pickerOptions"
    :placeholder="$t(placeholder)"
    @input="emitChange" />
</template>

<script lang="ts">
import { DatePicker } from 'element-ui';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppDaterangePicker',
  components: {
    'el-date-picker': DatePicker,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
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
    fullWidth: {
      default: false,
      type: Boolean,
    },
    value: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    fullWidthClass(): string {
      return this.fullWidth ? 'full-width' : '';
    },
    selectClasses(): string[] {
      return [this.fullWidthClass];
    },
    dateRangePicker: {
      cache: false,
      get() {
        return this.$refs.dateRangePicker as DatePicker;
      },
      set() {},
    },
  },
  methods: {
    openCalendar(): void {
      this.dateRangePicker.focus();
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

<style lang="scss">
@import '../../assets/styles/parts/input';

.full-width {
  display: block;
  width: 100% !important;
}
</style>
