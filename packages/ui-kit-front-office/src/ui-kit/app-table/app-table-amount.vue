<template>
  <p
    class="app-table-amount"
    :class="classList">
    {{ amount }}
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppTableAmount',
  props: {
    amount: { default: '', type: String },
    isBold: { default: false, type: Boolean },
    customClass: { default: 'text-gray-500', type: String },
  },
  computed: {
    isTopUp(): boolean {
      return this.amount.startsWith('+');
    },
    classList(): string[] {
      return [
        this.isTopUp ? 'app-table-amount--positive' : '',
        this.isBold ? 'app-table-amount--bold' : '',
        this.customClass ? this.customClass : '',
      ];
    },
  },
});
</script>

<style lang="scss">
.app-table-amount {
  @apply text-lg whitespace-nowrap font-semibold text-right;

  &--positive {
    @apply text-green-status;
  }

  &--bold {
    @apply text-20;
  }
}
</style>
