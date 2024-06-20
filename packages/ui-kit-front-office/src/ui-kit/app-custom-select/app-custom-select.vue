<template>
  <div
    class="app-custom-select"
    :class="{ 'app-custom-select--open': isOpen }">
    <div class="app-custom-select__label">
      {{ $t(label) }}
    </div>
    <div
      v-click-outside="close"
      class="app-custom-select__wrapper"
      tabindex="0"
      @focusin="open"
      @click="open">
      <div class="app-custom-select__control">
        <div class="app-custom-select__control__input">
          <div
            class="app-custom-select__value"
            :class="{ 'app-custom-select__value--empty': !inputValue }">
            {{ inputValue ? inputValue : $t(placeholder) }}
          </div>
          <div class="app-custom-select__placeholder">
            {{ $t(placeholder) }}
          </div>
          <span
            type="button"
            role="button"
            class="app-custom-select__arrow icon-select-arrow-down"
            @click.stop="toggle" />
        </div>
        <div
          class="app-custom-select__dropdown"
          :style="{ height: (isOpen ? dropDownHeight : 0) + 'px' }"
          @click.stop>
          <slot
            name="input"
            v-bind="{ inputValue }">
            <app-input
              v-model="inputValue"
              :placeholder="inputPlaceholder" />
          </slot>
          <div
            v-loading="isLoading"
            class="app-custom-select__dropdown-group">
            <div class="app-custom-select__title">
              {{ $t(optionsTitle) }}
            </div>
            <div
              ref="dropDownOptions"
              v-infinite-scroll="loadMore"
              :infinite-scroll-disabled="isLoadMoreDisabled">
              <slot
                name="options"
                v-bind="{ setValueManual, records, removeItem }" />
              <div
                v-if="isListEmpty"
                class="app-custom-select__empty">
                {{ $t('other.empty_list') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { IPaginationResponse, IPlainObject } from '@sdk5/shared/types';
import { errorNotification } from '@sdk5/shared/utils';
import { defineComponent } from 'vue';

import { AppInput } from '../../ui-framework';
import { categoryColors, getDynamicColor } from '../colors';

const DEFAULT_DROPDOWN_HEIGHT = 100;

export default defineComponent({
  name: 'AppCustomSelect',
  components: { AppInput },
  props: {
    value: { type: [String, Object], required: true },
    onLoad: { type: Function, default: null },
    placeholder: { type: String, default: '' },
    inputPlaceholder: { type: String, default: '' },
    label: { type: String, default: '' },
    optionsTitle: { type: String, default: 'form.label.saved_templates' },
  },
  data() {
    const dropDownHeight: number = DEFAULT_DROPDOWN_HEIGHT;
    const response: IPaginationResponse<any> = {} as IPaginationResponse<any>;
    const recordsBuffer: IPlainObject[] = [];
    const isLoaded: boolean = false;
    const isLoading: boolean = false;
    const isOpen: boolean = false;

    return {
      isOpen,
      isLoading,
      isLoaded,
      recordsBuffer,
      response,
      dropDownHeight,
    };
  },
  computed: {
    inputValue: {
      get(): any {
        return this.value;
      },
      set(value: any) {
        this.setValue(value);
      },
    },
    records(): IPlainObject[] {
      const getColor = getDynamicColor(categoryColors);
      return this.recordsBuffer?.map((record) => ({ ...record, color: getColor() })) || [];
    },
    isLoadMoreDisabled(): boolean {
      return !!(Object.keys(this.response)?.length && this.response?.totalPages === this.response?.pageNumber);
    },
    isListEmpty(): boolean {
      return this.onLoad ? !this.records.length : false;
    },
    dropDownOptions: {
      cache: false,
      get() {
        return this.$refs.dropDownOptions as HTMLElement;
      },
      set() {},
    },
  },
  watch: {
    records: [{ immediate: true, handler: 'calculateDropDownHeight' }],
  },
  methods: {
    toggle(): void {
      this.isOpen = !this.isOpen;
    },
    close(): void {
      this.isOpen = false;
    },
    open(): void {
      this.isOpen = true;

      if (!this.isLoaded) {
        this.loadMore();
        this.isLoaded = true;
      }
    },
    removeItem(removeId: string): void {
      this.recordsBuffer = this.recordsBuffer.filter(({ id }) => id !== removeId);
    },
    async loadMore(): Promise<void> {
      if (!this.onLoad) {
        return;
      }

      const { pageNumber = -1, pageSize = 20, totalPages = 1 } = this.response || {};
      const nextPage = pageNumber + 1;

      if (nextPage > totalPages - 1 || this.isLoading) {
        return;
      }

      this.isLoading = true;
      const { response, error } = await this.onLoad({ pageNumber: nextPage, pageSize });
      this.isLoading = false;

      if (error) {
        errorNotification(error);
        this.recordsBuffer = [];
        return;
      }

      this.response = response;

      if (response.pageNumber === 0) {
        this.recordsBuffer = response?.records || [];
        return;
      }

      this.recordsBuffer = [...this.recordsBuffer, ...response.records];
    },
    async calculateDropDownHeight(): Promise<void> {
      await this.$nextTick();
      const listHeight = this.dropDownOptions?.scrollHeight || 0;
      this.dropDownHeight = listHeight + DEFAULT_DROPDOWN_HEIGHT;
    },
    setValue<T>(value: T) {
      this.$emit('input', value);
      this.$emit('manual-input', value);
    },
    setValueManual<T>(value: T) {
      this.close();
      this.$emit('input', value);
    },
  },
});
</script>

<style lang="scss">
.app-custom-select {
  @apply flex flex-col;

  &--open {
    .app-custom-select__control {
      @apply border-primary;
    }

    .app-custom-select__arrow {
      @apply rotate-180;
    }

    .app-custom-select__value {
      @apply absolute opacity-0;
    }

    .app-custom-select__placeholder {
      @apply static opacity-100;
    }
  }

  &__label {
    @apply inline-block text-black text-base mb-8 font-semibold leading-none;
  }

  &__value {
    @apply text-gray-500 transition-opacity text-base font-medium;

    &--empty {
      @apply text-blue-500;
    }
  }

  &__placeholder {
    @apply text-blue-500 absolute opacity-0 transition-opacity font-medium;
  }

  &__title {
    @apply text-blue-500 mb-2 mt-10;
  }

  &__wrapper {
    @apply relative h-44 outline-none;
  }

  &__control {
    @apply absolute top-0 left-0 right-0 min-h-full rounded-7 border border-blue-400 z-10 bg-white transition duration-500;

    &__input {
      @apply px-14 h-42 rounded-7 flex items-center justify-between leading-5 cursor-pointer;
    }
  }

  &__arrow {
    @apply text-6 text-blue-600 font-semibold transform transition duration-500 mr-2;

    &::before {
      @apply text-6 #{!important};
    }
  }

  &__dropdown {
    @apply h-0 max-h-320 px-14 overflow-hidden transition-all duration-500;

    &-group {
      @apply overflow-auto h-4/5;

      -ms-overflow-style: none;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  &__empty {
    @apply text-center text-blue-500;
  }
}

.is-error {
  .app-custom-select__control {
    @apply border-red-error;
  }
}
</style>
