<template>
  <div
    class="app-chart-summary-data"
    :class="{'app-chart-summary-data--row': isRow}">
    <div class="app-chart-summary-data__currency">
      <div
        v-if="isRow"
        class="app-chart-summary-data__color"
        :style="{backgroundColor: data.color}"/>
      <img
        v-else
        :src="`/images/currencies/${data.currency.toLowerCase()}.svg`"
        alt="">
      {{ data.currency }}
      {{ data.percent }}%
    </div>
    <div class="app-chart-summary-data__amount">
      {{ data.symbol }}{{ data.amount }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { ISummaryChartData } from '@/components/ui-kit/app-charts/types/charts.types';

@Component
export default class AppChartSummaryData extends Vue {

  @Prop({ type: Object, required: true }) readonly data!: ISummaryChartData;

  @Prop({ type: Boolean, default: false }) readonly isRow!: boolean;

}
</script>

<style lang="scss">
.app-chart-summary-data {
  @apply flex flex-col;

  &--row {
    @apply flex-row justify-between items-center mb-16;

    .app-chart-summary-data__currency {
      @apply mb-0;
    }
  }

  &__currency {
    @apply flex items-center text-blue-500 text-sm mb-8 whitespace-nowrap;

    img {
      @apply mr-4 w-12 h-12 object-cover object-center rounded-full;
    }
  }

  &__color {
    @apply mr-4 w-12 h-12 rounded-full;
  }

  &__amount {
    @apply text-blue-700 text-base font-semibold;
  }
}

</style>
