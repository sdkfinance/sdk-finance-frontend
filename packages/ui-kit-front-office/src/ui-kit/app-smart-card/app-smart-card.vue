<template>
  <component
    :is="to ? 'router-link' : 'div'"
    class="app-smart-card"
    :to="to">
    <div class="app-smart-card__header">
      <div class="app-smart-card__title">
        {{ title }}
      </div>
      <img
        class="app-smart-card__icon"
        src="/images/icons/masterpass.svg"
        alt="" />
    </div>
    <div class="app-smart-card__subtitle">
      <div
        v-if="cardState !== null"
        class="app-smart-card__status">
        <app-badge :status="cardState" />
      </div>
      <span class="app-smart-card__card-number">
        {{ maskedCardNumber }}
      </span>
    </div>
    <slot />
  </component>
</template>

<script lang="ts">
import { getDisplayCardNumber } from '@sdk5/shared/utils';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { RawLocation } from 'vue-router';

import { AppBadge } from '../app-badge';
import { AppCardProgress } from '../app-card-progress';
import { AppProgressBar } from '../app-progress-bar';

export default defineComponent({
  name: 'AppSmartCard',
  components: { AppCardProgress, AppProgressBar, AppBadge },
  props: {
    title: { type: String, default: '' },
    cardNumber: { type: String, default: '' },
    to: { type: Object as PropType<RawLocation>, default: null },
    cardState: { type: String, default: null },
  },
  computed: {
    maskedCardNumber(): string {
      return getDisplayCardNumber(this.cardNumber);
    },
  },
});
</script>

<style lang="scss">
.app-smart-card {
  box-shadow: 0 4px 12px rgb(161 182 198 / 20%);

  @apply w-full
    md:w-324
    lg:w-268
    h-148
    transition
    duration-500
    ease-in-out
    cursor-pointer
    rounded-lg
    bg-white
    py-16
    px-20;

  &__header {
    @apply flex justify-between items-center;
  }

  &__title {
    @apply font-medium text-base text-gray-500;
  }

  &__subtitle {
    @apply flex items-center justify-between text-blue-500 text-sm font-medium mt-4 mb-20;
  }

  &__status .badge {
    @apply p-0;
  }
}
</style>
