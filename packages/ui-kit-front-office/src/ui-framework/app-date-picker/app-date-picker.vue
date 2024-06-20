<template>
  <div :class="appDatePickerClassNames">
    <date-picker
      ref="datePickerRef"
      v-model="modelValue"
      mode="date"
      :popover="datepickerPopoverOptions"
      :input-debounce="inputDebounceDelay"
      :masks="datepickerMasks"
      :attributes="datepickerAttributes"
      :select-attribute="datePickerSelectAttribute"
      :drag-attribute="datePickerDragAttribute"
      :is-range="rangeMode"
      :columns="gatePickerColumnsProp"
      :title-position="titlePosition"
      :model-config="datePickerModelConfig"
      :min-date="minDate"
      :max-date="maxDate"
      :trim-weeks="trimWeeks"
      :show-weeknumbers="showWeekNumbers"
      :show-iso-weeknumbers="showIsoWeekNumbers"
      @drag="emitDragEvent"
      @dayclick="emitDayClickEvent"
      @daymouseenter="emitDayMouseEnterEvent"
      @daymouseleave="emitDayMouseLeaveEvent"
      @dayfocusin="emitDayFocusInEvent"
      @dayfocusout="emitDayFocusOutEvent"
      @popoverWillShow="emitPopoverWillShowEvent"
      @popoverDidShow="emitPopoverDidShowEvent"
      @popoverWillHide="emitPopoverWillHideEvent"
      @popoverDidHide="emitPopoverDidHideEvent">
      <template #default="{ inputValue, inputEvents, updateValue, showPopover, hidePopover, togglePopover }">
        <slot
          name="default"
          v-bind="{
            inputValue,
            inputEvents,
            updateValue,
            showPopover,
            hidePopover,
            togglePopover,
            editable,
            placeholder,
          }">
          <template v-if="!hideTriggers">
            <template v-if="rangeMode">
              <app-button
                type="primary"
                :size="APP_BUTTON_SIZE.medium"
                @click="togglePopover">
                Toggle
              </app-button>
            </template>
            <app-input
              v-else
              :size="currentDatepickerSize"
              :placeholder="`${$t(placeholder)}`"
              :readonly="!editable"
              :value="inputValue"
              :label="inputLabel"
              :disabled="inputDisabled"
              @focus="inputEvents.focusin"
              @focusout="inputEvents.focusout"
              @input="inputEvents.input({ target: { value: $event } })" />
          </template>
        </slot>
      </template>
      <template #header-left-button>
        <slot name="header-left-button">
          <app-button
            outlined
            only-icon
            icon="icon-arrow-left"
            native-type="button"
            :size="APP_BUTTON_SIZE.medium" />
        </slot>
      </template>
      <template #header-right-button>
        <slot name="header-right-button">
          <app-button
            outlined
            only-icon
            icon="icon-arrow-right"
            native-type="button"
            :size="APP_BUTTON_SIZE.medium" />
        </slot>
      </template>
      <template #footer>
        <div
          v-if="$scopedSlots.footer"
          class="app-date-picker__footer">
          <slot
            name="footer"
            v-bind="{
              inputValue: datePickerInputValue,
              clear: clearDatePickerValue,
            }" />
        </div>
      </template>
    </date-picker>
  </div>
</template>

<script lang="ts">
import { useIsUaWebview } from '@sdk5/shared/composables';
import { checkMobile } from '@sdk5/shared/utils';
import { DatePicker } from 'v-calendar';
import type { PropType } from 'vue';
import { computed, defineComponent, onMounted, ref } from 'vue';

import { APP_BUTTON_SIZE, AppButton } from '../app-button';
import type { TAppInputSize } from '../app-input';
import { APP_INPUT_SIZE, AppInput, appInputSizeValidator } from '../app-input';
import { DATE_PICKER_DRAG_ATTRIBUTE, DATE_PICKER_SELECT_ATTRIBUTE, DATEPICKER_ATTRIBUTES } from './configs';
import { APP_DATE_PICKER_RANGE_EMIT_VALUE_TYPE } from './constants';
import {
  DEFAULT_DATE_PICKER_INPUT_DEBOUNCE_DELAY,
  DEFAULT_DATE_PICKER_INPUT_VALUE_FORMAT,
  DEFAULT_DATE_PICKER_MODEL_CONFIG,
  DEFAULT_DATE_PICKER_POPOVER_OPTIONS,
  DEFAULT_DATE_PICKER_TITLE_POSITION,
} from './defaults';
import type {
  TAppDatePickerRangeEmitValueType,
  TDatePickerDate,
  TDatePickerDateValue,
  TDatePickerDay,
  TDatePickerModelConfig,
  TDatePickerPopoverOptions,
  TDatePickerRangeObjectValue,
  TDatePickerShowWeeksNumbers,
  TDatePickerTitlePosition,
  TVDatePickerRef,
} from './types';
import { isDate, isRangeValueObject } from './utils';

export default defineComponent({
  name: 'AppDatePicker',
  components: {
    AppInput,
    AppButton,
    DatePicker,
  },
  model: {
    event: 'change',
    prop: 'value',
  },
  props: {
    value: {
      type: [String, Object, Number] as PropType<TDatePickerDate>,
      default: null,
    },
    placeholder: {
      type: String,
      default: '',
    },
    editable: {
      default: false,
      type: Boolean,
    },
    format: {
      type: String,
      default: DEFAULT_DATE_PICKER_INPUT_VALUE_FORMAT,
    },
    filterView: {
      type: Boolean,
      default: false,
    },
    autoWidth: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String as PropType<TAppInputSize>,
      default: APP_INPUT_SIZE.medium,
      validator: appInputSizeValidator,
    },
    rangeMode: {
      type: Boolean,
      default: false,
    },
    largeView: {
      type: Boolean,
      default: false,
    },
    rangeValueEmitType: {
      type: String as PropType<TAppDatePickerRangeEmitValueType>,
      default: APP_DATE_PICKER_RANGE_EMIT_VALUE_TYPE.object,
    },
    hideTriggers: {
      type: Boolean,
      default: false,
    },
    inputDebounceDelay: {
      type: Number,
      default: DEFAULT_DATE_PICKER_INPUT_DEBOUNCE_DELAY,
    },
    titlePosition: {
      type: String as PropType<TDatePickerTitlePosition>,
      default: DEFAULT_DATE_PICKER_TITLE_POSITION,
    },
    trimWeeks: {
      type: Boolean,
      default: false,
    },
    showWeekNumbers: {
      type: [Boolean, String] as PropType<TDatePickerShowWeeksNumbers>,
      default: false,
    },
    showIsoWeekNumbers: {
      type: [Boolean, String] as PropType<TDatePickerShowWeeksNumbers>,
      default: false,
    },
    minDate: {
      type: [Date, String, Number] as PropType<TDatePickerDateValue>,
      default: null,
    },
    maxDate: {
      type: [Date, String, Number] as PropType<TDatePickerDateValue>,
      default: null,
    },
    popoverOptions: {
      type: Object as PropType<Partial<TDatePickerPopoverOptions>>,
      default: () => {},
    },
    modelConfig: {
      type: Object as PropType<Partial<TDatePickerModelConfig>>,
      default: () => {},
    },
    inputLabel: {
      type: String,
      default: '',
    },
    inputDisabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { isWebview } = useIsUaWebview();
    const isMobile = checkMobile();
    const datePickerRef = ref(null as unknown as TVDatePickerRef);
    const isMounted = ref(false);

    const datePickerModelConfig = computed<TDatePickerModelConfig>(() => ({
      ...DEFAULT_DATE_PICKER_MODEL_CONFIG,
      ...props.modelConfig,
    }));

    const datepickerMasks = computed(() => ({
      input: props.format,
    }));

    const currentDatepickerSize = computed(() => {
      if (props.filterView) {
        return APP_INPUT_SIZE.small;
      }

      return props.size;
    });

    const datePickerInputValue = computed(() => {
      if (!isMounted.value) {
        return null;
      }

      const [start, end] = datePickerRef.value?.inputValues ?? [null, null];

      if (props.rangeMode) {
        return {
          start,
          end,
        };
      }

      return start;
    });

    const datepickerPopoverOptions = computed(() => ({
      ...DEFAULT_DATE_PICKER_POPOVER_OPTIONS,
      ...props.popoverOptions,
    }));

    const gatePickerColumnsProp = computed(() => {
      if (isWebview || isMobile) {
        return 1;
      }

      if (props.largeView === true) {
        return 2;
      }

      return 1;
    });

    const appDatePickerClassNames = computed(() => [
      'app-date-picker',
      props.filterView && 'app-date-picker--filter-view',
      props.autoWidth && 'app-date-picker--auto-width',
      props.rangeMode && 'app-date-picker--range',
      props.largeView && 'app-date-picker--large-view',
    ]);

    const resetDateHours = (date: Date): Date => {
      return new Date(new Date(date).setHours(0, 0, 0, 0));
    };

    const getModelValueDate = (value: TDatePickerDate): TDatePickerDate => {
      if (isDate(value)) {
        return resetDateHours(value);
      }

      if (isRangeValueObject(value)) {
        const { end, start } = value;
        return {
          end: isDate(end) ? resetDateHours(end) : end,
          start: isDate(start) ? resetDateHours(start) : start,
        };
      }

      return value;
    };

    const getDatePickerEmitValue = (value: TDatePickerDate): TDatePickerDate<string> | (string | number | null)[] => {
      if (isDate(value)) {
        return value.toISOString();
      }

      if (isRangeValueObject(value)) {
        const { end, start } = value;
        const startValue = isDate(start) ? start.toISOString() : start;
        const endValue = isDate(end) ? end.toISOString() : end;

        if (props.rangeValueEmitType === APP_DATE_PICKER_RANGE_EMIT_VALUE_TYPE.object) {
          return {
            start: startValue,
            end: endValue,
          };
        }

        return [startValue, endValue];
      }

      return value;
    };

    const showDatePicker = () => {
      datePickerRef.value?.showPopover();
    };
    const hideDatePicker = () => {
      datePickerRef.value?.hidePopover();
    };
    const toggleDatePicker = () => {
      datePickerRef.value?.togglePopover();
    };
    const clearDatePickerValue = () => {
      return datePickerRef.value?.updateValue(null);
    };
    const focusDate = (date: Date | string) => {
      return datePickerRef.value?.focusDate(date);
    };
    const emitDragEvent = (range: TDatePickerRangeObjectValue) => {
      emit('drag', range);
    };
    const emitPopoverWillShowEvent = (contentRoot: HTMLElement) => {
      emit('popoverWillShow', contentRoot);
    };
    const emitPopoverDidShowEvent = (contentRoot: HTMLElement) => {
      emit('popoverDidShow', contentRoot);
    };
    const emitPopoverWillHideEvent = (contentRoot: HTMLElement) => {
      emit('popoverWillHide', contentRoot);
    };
    const emitPopoverDidHideEvent = (contentRoot: HTMLElement) => {
      emit('popoverDidHide', contentRoot);
    };
    const emitDayClickEvent = (dayObject: TDatePickerDay) => {
      emit('dayClick', dayObject);
    };
    const emitDayMouseEnterEvent = (dayObject: TDatePickerDay) => {
      emit('dayMouseEnter', dayObject);
    };
    const emitDayMouseLeaveEvent = (dayObject: TDatePickerDay) => {
      emit('dayMouseLeave', dayObject);
    };
    const emitDayFocusInEvent = (dayObject: TDatePickerDay) => {
      emit('dayFocusIn', dayObject);
    };
    const emitDayFocusOutEvent = (dayObject: TDatePickerDay) => {
      emit('dayFocusOut', dayObject);
    };
    const emitChange = (value: TDatePickerDate) => {
      emit('change', getDatePickerEmitValue(value), value);
    };

    const modelValue = computed({
      get() {
        return getModelValueDate(props.value);
      },
      set(value: TDatePickerDate) {
        emitChange(value);
      },
    });

    onMounted(() => {
      isMounted.value = true;
    });

    return {
      modelValue,
      APP_BUTTON_SIZE,
      datePickerDragAttribute: DATE_PICKER_DRAG_ATTRIBUTE,
      datePickerSelectAttribute: DATE_PICKER_SELECT_ATTRIBUTE,
      datepickerAttributes: DATEPICKER_ATTRIBUTES,
      isMounted,
      datePickerModelConfig,
      datepickerMasks,
      currentDatepickerSize,
      datePickerRef,
      datePickerInputValue,
      datepickerPopoverOptions,
      gatePickerColumnsProp,
      appDatePickerClassNames,
      getModelValueDate,
      getDatePickerEmitValue,
      showDatePicker,
      hideDatePicker,
      toggleDatePicker,
      clearDatePickerValue,
      focusDate,
      emitDragEvent,
      emitPopoverWillShowEvent,
      emitPopoverDidShowEvent,
      emitPopoverWillHideEvent,
      emitPopoverDidHideEvent,
      emitDayClickEvent,
      emitDayMouseEnterEvent,
      emitDayMouseLeaveEvent,
      emitDayFocusInEvent,
      emitDayFocusOutEvent,
      emitChange,
    };
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/parts/input';

.app-date-picker {
  @apply relative;

  &--auto-width {
    .el-date-editor {
      @apply w-auto;
    }
  }

  &--large-view {
    .vc-container {
      .vc-pane-layout {
        @apply gap-x-[1.5rem] px-[0.75rem] pt-[0.75rem] pb-[1rem];

        .vc-pane {
          .vc-weeks,
          .vc-header {
            @apply p-0;
          }
        }
      }
    }
  }

  .app-button {
    .btn-icon {
      &::before {
        @apply text-[1em];
      }
    }
  }

  .vc-container {
    @apply font-[inherit] border-0 shadow-[0px_8px_20px_0px_rgba(161,182,198,0.35)];

    .vc-popover-caret {
      @apply hidden;
    }

    .vc-weekday {
      @apply flex items-center justify-center text-blue-500 font-semibold text-sm leading-[140%] p-0 mb-[0.5rem];
    }

    .vc-highlight {
      @apply w-full h-full;
      @apply rounded-none #{!important};

      &.app-date-picker {
        &--highlight-drag-start,
        &--highlight-drag-end,
        &--highlight-selected-start,
        &--highlight-selected-end {
          @apply bg-primary;
        }

        &--highlight-selected-base,
        &--highlight-drag-base {
          @apply bg-blue-20;
        }

        &--highlight-today {
          @apply bg-gray-100;
        }
      }
    }

    .vc-arrow {
      @apply hover:bg-transparent border-0;
    }

    .vc-header,
    .vc-arrows-container {
      @apply p-[0.75rem];
    }

    .vc-header {
      @apply mb-[1rem] p-[0.75rem] pb-0 h-[2rem] box-content;

      .vc-title {
        @apply text-gray-500 text-lg leading-[normal] font-medium;
      }
    }

    .vc-weeks {
      @apply pt-0 px-[0.75rem] pb-[1rem] grid-cols-[repeat(7,2rem)];

      &.vc-show-weeknumbers {
        @apply grid-cols-[auto_repeat(7,2rem)];
      }
    }

    .vc-day,
    .vc-weekday {
      @apply h-[2rem] w-full;
    }

    .vc-day {
      @apply min-h-[unset];
    }

    .vc-day-content {
      @apply text-md leading-[normal] text-gray-500 font-medium rounded-none w-full h-full;
      @apply hover:bg-blue-200 hover:text-primary focus:bg-transparent focus:font-medium;
      @apply font-medium #{!important};

      &.is-disabled {
        @apply text-blue-400 hover:bg-transparent hover:text-blue-400 cursor-default;
      }

      &.app-date-picker {
        &--highlight-content-today,
        &--highlight-drag-content-start,
        &--highlight-drag-content-end,
        &--highlight-content-selected-start,
        &--highlight-content-selected-end,
        &--highlight-drag-content-base,
        &--highlight-content-selected-base {
          @apply hover:bg-transparent;
        }

        &--highlight-content-today {
          @apply text-primary;
        }

        &--highlight-drag-content-start,
        &--highlight-drag-content-end,
        &--highlight-content-selected-start,
        &--highlight-content-selected-end {
          @apply text-gray-100;
        }

        &--highlight-drag-content-base,
        &--highlight-content-selected-base {
          @apply text-gray-500;
        }
      }
    }

    .vc-pane-layout {
      .vc-pane,
      .vc-weeks {
        @apply min-w-[unset];
      }
    }
  }

  &__suffix {
    @apply absolute right-[14px] top-1/2 -translate-y-1/2 text-sm leading-none text-gray-placeholder;
  }

  &__footer {
    @apply p-[0.75rem] border-t border-t-blue-400 flex items-center;
  }
}
</style>
