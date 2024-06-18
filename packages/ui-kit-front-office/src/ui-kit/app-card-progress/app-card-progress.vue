<template>
  <div class="app-card-progress">
    <div class="app-card-progress-row">
      <!--      <div class="app-card-progress-amount">-->
      <!--        {{ currencySymbol }}{{ spendAmount }}-->
      <!--      </div>-->
      <div class="app-card-progress-amount">{{ currencySymbol }}{{ availableAmount }}</div>
    </div>
    <app-progress-bar
      class="app-card-progress-bar"
      bar-color="#1B55E9"
      :value="spendPercent"
      :is-show-percents="false" />
    <div class="app-card-progress-row">
      <!--      <div class="app-card-progress-label">-->
      <!--        {{ $t('other.spent') }}-->
      <!--      </div>-->
      <div class="app-card-progress-label">
        {{ $t('other.left') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { AppProgressBar } from '../app-progress-bar';

export default defineComponent({
  name: 'AppCardProgress',
  components: {
    AppProgressBar,
  },
  props: {
    amount: { type: Number, default: 0 },
    availableAmount: { type: Number, default: 0 },
    currencySymbol: { type: String, default: '' },
  },
  computed: {
    spendAmount(): number {
      return this.amount - this.availableAmount;
    },
    spendPercent(): number {
      return 100;
    },
  },
});
</script>

<style lang="scss">
.app-card-progress {
  &-row {
    @apply flex items-center justify-end;
  }

  &-bar {
    @apply h-auto mt-4 mb-4;
  }

  &-amount {
    @apply font-medium text-base text-gray-500;
  }

  &-label {
    @apply text-blue-500 text-base font-medium;
  }
}
</style>
