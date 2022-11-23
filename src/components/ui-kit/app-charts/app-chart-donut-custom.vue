<template>
  <div
    class="app-chart-donut"
    :class="{'app-chart-donut--hidden': !isMounted}">
    <div class="app-chart-donut__view">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 42 42">
        <circle
          v-for="(chart, i) in filteredData"
          :key="`line_donut_${i}`"
          cx="21"
          cy="21"
          :r="radius"
          fill="transparent"
          :stroke="chart.color"
          stroke-width="2"
          stroke-linecap="round"
          :stroke-dasharray="getWidth(chart)"
          :stroke-dashoffset="getOffset(filteredData, i)"/>
      </svg>
    </div>
    <div class="app-chart-donut__data">
      <app-chart-data
        v-for="(chart, i) in transformedData"
        :key="`line_data_${i}`"
        :is-row="true"
        :color="chart.color"
        :data="chart"/>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';

import AppChartData from '@/components/ui-kit/app-charts/app-chart-summary-data.vue';
import { ISummaryChartData } from '@/components/ui-kit/app-charts/types/charts.types';
import { chartColors, getDynamicColor } from '@/components/ui-kit/colors';

const ANIMATION_DELAY: number = 500;

@Component({
  components: { AppChartData },
})
export default class AppChartDonutCustom extends Vue {

  @Prop({ type: Array, required: true }) readonly data!: ISummaryChartData[];

  protected getColor: Function = getDynamicColor(chartColors);

  protected isMounted: boolean = true;

  protected margin: number = 4;

  protected radius: number = 19;

  protected circleLength: number = 2 * Math.PI * this.radius;

  protected get transformedData(): ISummaryChartData[] {
    return this.data.map((chart) => {
      chart.color = this.getColor();
      return chart;
    });
  }

  protected get filteredData(): ISummaryChartData[] {
    return this.transformedData.filter(({ percent }) => percent !== 0);
  }

  protected get totalGaps(): number {
    return this.margin * this.filteredData.length;
  }

  protected get gapDiff(): number {
    return (100 - this.totalGaps) / 100;
  }

  @Watch('data', { immediate: true })
  protected async setColors(): Promise<void> {
    this.getColor = getDynamicColor(chartColors);
    this.isMounted = false;
    await this.$nextTick();
    setTimeout(() => {
      this.isMounted = true;
    }, ANIMATION_DELAY);
  }

  protected getWidth(data: ISummaryChartData): string {
    const percent: number = (data.percent * this.gapDiff) / 100;
    const halfMargin: number = this.margin / 2;
    const partOfCircleLength: number = this.circleLength * percent;

    return `${partOfCircleLength + halfMargin} ${this.circleLength - partOfCircleLength - halfMargin}`;
  }

  protected getOffset(data: ISummaryChartData[], idx: number): string {
    if (idx === 0) {
      return '0';
    }

    const prevSumWidth = data.reduce((acc, { percent }, i) => {
      if (i < idx) {
        return acc + (this.circleLength * ((percent * this.gapDiff) / 100));
      }
      return acc;
    }, 0);

    const offSetTune: number = 1.2;

    const offSet: number = (this.margin * idx) * offSetTune;

    return (this.circleLength - prevSumWidth - offSet).toString();
  }

}
</script>

<style lang="scss">
.app-chart-donut {
  @apply flex justify-center items-center flex-col;

  &--hidden {
    .app-chart-donut__view {
      circle {
        stroke-dashoffset: 0 !important;
        stroke-dasharray: 0 0 !important;
      }
    }
  }

  &__view {
    @apply w-168 h-168;

    svg {
      transform: rotate(-90deg);
    }

    circle {
      transform-origin: 50% 50%;
      transition: 1s;
    }
  }

  &__data {
    @apply w-full mt-24;
  }
}
</style>
