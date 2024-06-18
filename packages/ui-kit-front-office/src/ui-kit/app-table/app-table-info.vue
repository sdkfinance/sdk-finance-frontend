<template>
  <div
    class="app-table-info"
    :class="{ 'app-table-info--summary': isSummary }">
    <div class="app-table-info__card">
      <app-operation-image
        :image="image || iconPlaceholder"
        :background-color="backgroundColor"
        :has-error="hasError" />

      <div class="app-table-info__details">
        <p class="app-table-info__details-title">
          <slot name="title">
            {{ title }}
          </slot>
        </p>

        <div class="app-table-info__details-info">
          <slot name="description">
            <span
              class="app-table-info__details-info-status"
              :class="[{ 'app-table-info__details-info-status--error': hasError }, hasError ? 'inline' : 'hidden md:inline']">
              {{ $t(`entity.transaction.status.${status}`) }}
            </span>
            <span class="hidden md:inline"> · {{ formatTimeMethod(time) }} · </span>
            <span :class="{ 'hidden md:inline': hasError }">{{ categoryName }}</span>
          </slot>
        </div>
      </div>
    </div>

    <slot name="mobile-info" />
  </div>
</template>

<script lang="ts">
import type { TBadgeStatus } from '@sdk5/shared/constants';
import { formatTime } from '@sdk5/shared/utils';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import iconPlaceholder from '../../assets/icons/empty-category.svg';
import { AppOperationImage } from '../app-operation-image';

export default defineComponent({
  name: 'AppTableInfo',
  components: {
    AppOperationImage,
  },
  props: {
    title: { default: '', type: String },
    status: { type: String as PropType<TBadgeStatus>, default: 'default' },
    time: { default: '', type: [String, Date] },
    categoryName: { default: '', type: String },
    image: { default: '', type: String },
    alt: { default: '', type: String },
    hasError: { default: false, type: Boolean },
    isSummary: { default: false, type: Boolean },
    hasShadow: { default: true, type: Boolean },
    backgroundColor: { type: String, default: '#0D2C50' },
  },
  data() {
    return {
      iconPlaceholder,
    };
  },
  methods: {
    formatTimeMethod(value: string): string {
      return formatTime(value);
    },
  },
});
</script>

<style lang="scss">
.app-table-info {
  @apply flex flex-col;

  &--summary {
    @apply shadow-card md:shadow-none p-20 md:p-0 rounded-lg;
  }

  &__card {
    @apply flex;

    .app-table-info__details {
      @apply flex flex-col justify-between leading-none py-2;

      &-title {
        @apply text-gray-500 font-medium md:mb-2 text-base md:text-lg;
      }

      &-info {
        @apply text-blue-500 font-medium leading-none text-sm md:text-base;

        &-status {
          @apply first-letter:uppercase;

          &--error {
            @apply text-red-main;
          }
        }
      }
    }
  }
}
</style>
