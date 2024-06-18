<template>
  <div class="bank-details-list">
    <template v-for="[key, displayValue] of detailsMap.entries()">
      <div
        :key="key"
        class="bank-details-list__item">
        <div class="bank-details-list__item-title">
          {{ $t(key) }}
        </div>
        <div class="bank-details-list__item-value">
          {{ displayValue }}
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  detailsMap: Map<string, string>;
}>();
</script>

<style lang="scss">
.bank-details-list {
  @apply grid grid-flow-row gap-y-[8px] overflow-hidden;

  &__item {
    @apply grid gap-x-[0.5rem] items-center;

    grid-template-columns: 40% 1fr;

    &-title,
    &-value {
      @apply font-medium text-sm;
    }

    &-title {
      @apply text-blue-600;
    }

    &-value {
      @apply overflow-hidden whitespace-nowrap text-ellipsis text-gray-500;
    }
  }
}
</style>
