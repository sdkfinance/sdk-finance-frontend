<template>
  <div class="app-chart">
    <app-chart-line-item
      v-for="(percent, i) in currentChart.data"
      :key="`line_chart_${i}`"
      :color="getColor(i)"
      :percent="percent">
      <slot
        name="label"
        v-bind="additionalInfo[i]" />
    </app-chart-line-item>
  </div>
</template>

<script lang="ts">
import type { IPlainObject } from '@sdk5/shared/types';
import type { ChartData, ChartDataset } from 'chart.js';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import AppChartLineItem from './app-chart-line-item.vue';

export default defineComponent({
  name: 'AppChartLine',
  components: {
    AppChartLineItem,
  },
  props: {
    chartData: { type: Object as PropType<ChartData>, required: true },
    additionalInfo: { type: Array as PropType<IPlainObject[]>, required: true },
  },
  computed: {
    currentChart(): ChartDataset {
      return this.chartData.datasets[0] || ({} as ChartDataset);
    },
  },
  methods: {
    getColor(idx: number): string {
      return Array.isArray(this.currentChart.backgroundColor) ? this.currentChart.backgroundColor[idx] : '';
    },
  },
});
</script>

<style lang="scss">
.app-chart {
  @apply flex items-start;
}
</style>
