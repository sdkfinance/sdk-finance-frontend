<template>
  <div
    class="app-chart-data">
    <div
      class="app-chart-data__color"
      :style="{backgroundColor: color}"/>
    <div class="app-chart-data__label">
      {{ $t(label) }}
    </div>
    <div class="app-chart-data__value">
      {{ value }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class AppChartData extends Vue {

  @Prop({ type: String, default: '#acabaf' }) readonly color!: string;

  @Prop({ type: String, default: '' }) readonly label!: string;

  @Prop({ type: [String, Number], default: '' }) readonly value!: string | number;

}
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
