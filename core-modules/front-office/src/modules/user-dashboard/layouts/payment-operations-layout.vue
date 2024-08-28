<template>
  <div
    class="payment-operations max-w-520"
    :class="rootClasses">
    <div class="payment-operations__title">
      <slot name="title" />
    </div>
    <div
      v-if="$slots.subtitle"
      class="payment-operations__subtitle">
      <slot name="subtitle" />
    </div>
    <div class="payment-operations__list">
      <slot name="list" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    rootClasses?: string;
  }>(),
  {
    rootClasses: 'max-w-520',
  },
);
</script>

<style lang="scss">
.payment-operations {
  @apply ml-auto mr-auto;

  &__title {
    @apply font-semibold text-gray-500 text-center mb-64 text-2xl;
  }

  &__subtitle {
    @apply font-medium text-gray-500 mb-32 text-xl;
  }

  &__list {
    @apply flex flex-col;
  }
}
</style>
