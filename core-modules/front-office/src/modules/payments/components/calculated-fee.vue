<template>
  <div class="calculated-fee">
    <div class="calculated-fee__icon">i</div>
    <span class="calculated-fee__text">
      {{ calculatedFeeText }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@sdk5/shared/i18n';
import { computed } from 'vue';

const props = defineProps<{
  amount: number;
  currencySymbol: string;
}>();

const { t } = useI18n();

const calculatedFeeText = computed(() => t('pages.user_dashboard.payments.fee_amount', { amount: `${props.currencySymbol}${props.amount}` }));
</script>

<style lang="scss">
.calculated-fee {
  @apply flex items-center gap-x-[0.5rem];

  &__icon {
    @apply w-18 h-18 rounded-full flex justify-center items-center;
    @apply leading-[normal] bg-blue-300 text-primary text-11 font-bold;
  }

  &__text {
    @apply text-md font-medium;

    color: #7288a3;
  }
}
</style>
