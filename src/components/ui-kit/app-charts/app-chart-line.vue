<template>
  <div class="app-chart">
    <app-chart-line-item
      v-for="(percent, i) in currentChart.data"
      :key="`line_chart_${i}`"
      :color="getColor(i)"
      :percent="percent">
      <slot
        name="label"
        v-bind="additionalInfo[i]"/>
    </app-chart-line-item>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';
import { ChartData, ChartDataset } from 'chart.js';
import AppChartLineItem from '@/components/ui-kit/app-charts/app-chart-line-item.vue';
import { IPlainObject } from '@/types/interfaces';

@Component({
  components: {
    AppChartLineItem,
  },
})
export default class AppChartLine extends Vue {

  @Prop({ type: Object, required: true }) readonly chartData!: ChartData;

  @Prop({ type: Array, required: true }) readonly additionalInfo!: IPlainObject[];

  protected get currentChart(): ChartDataset {
    return this.chartData.datasets[0] || {} as ChartDataset;
  }

  protected getColor(idx: number): string {
    return Array.isArray(this.currentChart.backgroundColor) ? this.currentChart.backgroundColor[idx] : '';
  }

}
</script>

<style lang="scss">
.app-chart {
  @apply flex items-start;
}
</style>
