<template>
  <div class="gold-rates-table-rate-cell">
    <span class="gold-rates-table-rate-cell__amount">
      {{ amount }}
    </span>
    <span
      v-if="tendency"
      class="gold-rates-table-rate-cell__tendency-mark"
      :class="[`gold-rates-table-rate-cell__tendency-mark--${tendency}`]"></span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  amount: number;
  tendency?: 'up' | 'down';
}>();
</script>

<style lang="scss">
.gold-rates-table-rate-cell {
  @apply flex items-center gap-x-[0.25rem];

  &__tendency-mark {
    @apply rotate-0 w-0 h-0 border-solid border-t-[0] border-b-[4px] border-x-[4px] border-t-transparent border-x-transparent;

    &--up {
      @apply border-b-green-main;
    }

    &--down {
      @apply border-b-red-main rotate-180;
    }
  }
}
</style>
