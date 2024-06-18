<template>
  <div class="period-filter">
    <app-date-picker
      ref="appDatePickerRef"
      v-model="dateModel"
      range-mode
      large-view
      :model-config="{
        start: {
          timeAdjust: '00:00:00',
        },
        end: {
          timeAdjust: '23:59:59',
        },
      }"
      :popover-options="{ keepVisibleOnInput: true }"
      @popoverWillShow="popoverWillShowHandler"
      @popoverWillHide="popoverWillHideHandler">
      <template #default="{ togglePopover }">
        <app-dropdown-trigger-filter-view
          :is-dropdown-visible="isDatePickerVisible"
          :values-string="filterValueString"
          :placeholder="placeholder"
          clickable
          @click="togglePopover"
          @clear-filter="clearFilterHandler" />
      </template>
      <template #footer="{ inputValue, clear }">
        <div class="period-filter-footer">
          <div class="period-filter-footer__inputs footer-inputs">
            <app-input
              :value="inputValue.start"
              :size="APP_INPUT_SIZE.large"
              :placeholder="fromPlaceholder"
              readonly />
            <span class="footer-inputs__divider">–</span>
            <app-input
              :value="inputValue.end"
              :size="APP_INPUT_SIZE.large"
              :placeholder="toPlaceholder"
              readonly />
            <app-button
              class="footer-inputs__clear-button"
              :size="APP_BUTTON_SIZE.medium"
              :type="APP_BUTTON_TYPE.secondary"
              transparent
              @click="clear">
              {{ $t('action.clear') }}
            </app-button>
          </div>
          <div class="period-filter-footer__action">
            <app-button
              :disabled="isApplyButtonDisabled"
              :type="APP_BUTTON_TYPE.primary"
              :size="APP_BUTTON_SIZE.big"
              @click="applyButtonClickHandler">
              {{ $t('action.apply') }}
            </app-button>
          </div>
        </div>
      </template>
    </app-date-picker>
  </div>
</template>

<script lang="ts">
import type { TTableFilterRangeOptions, TTableFilterValue } from '@sdk5/shared/types';
import { defineComponent } from 'vue';

import type { TDatePickerRangeObjectValue } from '../ui-framework';
import { APP_BUTTON_SIZE, APP_BUTTON_TYPES, APP_INPUT_SIZE, AppButton, AppDatePicker, AppDropdownTriggerFilterView, AppInput } from '../ui-framework';
import FilterTypeMixin from './filterTypeMixin';

export default defineComponent({
  name: 'PeriodFilter',
  components: {
    AppDatePicker,
    AppDropdownTriggerFilterView,
    AppButton,
    AppInput,
  },
  extends: FilterTypeMixin,
  data() {
    return {
      APP_BUTTON_SIZE,
      APP_BUTTON_TYPE: APP_BUTTON_TYPES,
      APP_INPUT_SIZE,
      dateModel: null as TDatePickerRangeObjectValue | null,
      isDatePickerVisible: false,
    };
  },
  computed: {
    isApplyButtonDisabled() {
      return this.dateModel === null;
    },
    filterValue() {
      return this.value;
    },
    filterParam() {
      return this.filter.param;
    },
    rangeOptions() {
      return this.filter.rangeOptions as TTableFilterRangeOptions;
    },
    fromPlaceholder() {
      return this.rangeOptions.from?.placeholder ?? this.placeholder;
    },
    toPlaceholder() {
      return this.rangeOptions.to?.placeholder ?? this.placeholder;
    },
    appDatePickerRef: {
      cache: false,
      get() {
        return this.$refs.appDatePickerRef as unknown as typeof AppDatePicker;
      },
      set() {},
    },
  },
  watch: {
    filterValue: [{ deep: true, immediate: true, handler: 'filterValueChangeHandler' }],
  },
  methods: {
    popoverWillShowHandler() {
      this.isDatePickerVisible = true;
    },
    popoverWillHideHandler() {
      this.isDatePickerVisible = false;
    },
    clearFilterHandler() {
      this.emitChange(null);
    },
    applyButtonClickHandler() {
      if (!this.dateModel) {
        return;
      }

      const { end, start } = this.dateModel as unknown as TDatePickerRangeObjectValue<string>;
      this.emitChange([start?.toString() ?? '', end?.toString() ?? '']);
      this.appDatePickerRef.hideDatePicker();
    },
    filterValueChangeHandler(value: TTableFilterValue) {
      const [fromValue, toValue] = Array.isArray(value) ? value : [];

      this.dateModel = {
        end: toValue?.toString() ?? '',
        start: fromValue?.toString() ?? '',
      };
    },
    emitChange(value: [string, string] | null) {
      this.$emit(
        'change',
        {
          key: this.filterParam,
          value: value as string[] | null,
        },
        value,
      );
    },
  },
});
</script>

<style lang="scss">
.period-filter {
  &-footer {
    @apply w-full flex items-center justify-between;

    &__inputs {
      @apply grid grid-flow-col items-center;

      grid-template-columns: 110px auto 110px;
    }
  }

  .footer-inputs {
    &__divider {
      @apply text-lg font-medium text-gray-500 leading-[normal] w-[1.5rem] text-center;
    }

    &__clear-button {
      font-variant: small-caps;
    }
  }
}
</style>
