<template>
  <div
    class="app-custom-select"
    :class="{'app-custom-select--open': isOpen}">
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
            :class="{'app-custom-select__value--empty': !inputValue}">
            {{ inputValue ? inputValue : $t(placeholder) }}
          </div>
          <div class="app-custom-select__placeholder">
            {{ $t(placeholder) }}
          </div>
          <span
            type="button"
            role="button"
            class="app-custom-select__arrow icon-select-arrow-down"
            @click.stop="toggle"/>
        </div>
        <div
          class="app-custom-select__dropdown"
          :style="{height: (isOpen ? dropDownHeight : 0) + 'px'}"
          @click.stop>
          <slot
            name="input"
            v-bind="{ inputValue }">
            <app-input
              v-model="inputValue"
              :placeholder="inputPlaceholder"/>
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
                v-bind="{ setValueManual, records, removeItem }"/>
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
import {
  Component, Emit, Prop, Ref,
  Vue, Watch,
} from 'vue-property-decorator';

import AppInput from '@/components/ui-framework/app-input.vue';
import { categoryColors, getDynamicColor } from '@/components/ui-kit/colors';
import { IPaginationResponse, IPlainObject } from '@/types/interfaces';
import { errorNotification } from '@/utils';

const DEFAULT_DROPDOWN_HEIGHT = 100;

@Component({
  components: { AppInput },
})
export default class AppCustomSelect extends Vue {

  @Ref('dropDownOptions') readonly dropDownOptions!: HTMLElement;

  @Prop({ type: [String, Object], required: true }) readonly value!: any;

  @Prop({ type: Function, default: null }) readonly onLoad!: Function;

  @Prop({ type: String, default: '' }) readonly placeholder!: string;

  @Prop({ type: String, default: '' }) readonly inputPlaceholder!: string;

  @Prop({ type: String, default: '' }) readonly label!: string;

  @Prop({ type: String, default: 'form.label.saved_templates' }) readonly optionsTitle!: string;

  protected isOpen: boolean = false;

  protected isLoading: boolean = false;

  protected isLoaded: boolean = false;

  protected recordsBuffer: IPlainObject[] = [];

  protected response: IPaginationResponse<any> = {} as IPaginationResponse<any>;

  protected dropDownHeight: number = DEFAULT_DROPDOWN_HEIGHT;

  public get inputValue(): any {
    return this.value;
  }

  public set inputValue(value: any) {
    this.setValue(value);
  }

  public get records(): IPlainObject[] {
    const getColor = getDynamicColor(categoryColors);
    return this.recordsBuffer?.map((record) => ({ ...record, color: getColor() })) || [];
  }

  protected get isLoadMoreDisabled(): boolean {
    return !!(Object.keys(this.response)?.length && this.response?.totalPages === this.response?.pageNumber);
  }

  protected get isListEmpty(): boolean {
    return this.onLoad ? !this.records.length : false;
  }

  @Watch('records', { immediate: true })
  protected async calculateDropDownHeight(): Promise<void> {
    await this.$nextTick();
    const listHeight = this.dropDownOptions?.scrollHeight || 0;
    this.dropDownHeight = listHeight + DEFAULT_DROPDOWN_HEIGHT;
  }

  @Emit('input')
  @Emit('manual-input')
  protected setValue<T>(value: T): T {
    return value;
  }

  @Emit('input')
  public setValueManual<T>(value: T): T {
    this.close();
    return value;
  }

  protected toggle(): void {
    this.isOpen = !this.isOpen;
  }

  protected close(): void {
    this.isOpen = false;
  }

  protected open(): void {
    this.isOpen = true;

    if (!this.isLoaded) {
      this.loadMore();
      this.isLoaded = true;
    }
  }

  public removeItem(removeId: string): void {
    this.recordsBuffer = this.recordsBuffer.filter(({ id }) => id !== removeId);
  }

  public async loadMore(): Promise<void> {
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
  }

}
</script>

<style lang="scss">
.app-custom-select {
  @apply flex flex-col;

  &--open {
    .app-custom-select__control {
      @apply border-blue-accent;
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
