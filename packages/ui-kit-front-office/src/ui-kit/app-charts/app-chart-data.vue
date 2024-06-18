<template>
  <div class="app-chart-data">
    <div
      class="app-chart-data__color"
      :style="{ backgroundColor: color }" />
    <div class="app-chart-data__label">
      {{ $t(label) }}
    </div>
    <div class="app-chart-data__value">
      {{ value }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppChartData',
  props: {
    color: { type: String, default: '#acabaf' },
    label: { type: String, default: '' },
    value: { type: [String, Number], default: '' },
  },
});
</script>

<style lang="scss">
.app-chart-data {
  @apply flex items-center;

  &__color {
    @apply mr-8 w-8 h-8 rounded-full;
  }

  &__label {
    @apply text-base text-gray-500 mr-8;
  }

  &--value {
    @apply text-base text-gray-500 font-medium;
  }
}
</style>
