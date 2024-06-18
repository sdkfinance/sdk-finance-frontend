<template>
  <div
    class="app-chart-donut"
    :class="{ 'app-chart-donut--hidden': !isMounted }">
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
          :stroke-dashoffset="getOffset(filteredData, i)" />
      </svg>
    </div>
    <div class="app-chart-donut__data">
      <app-chart-data
        v-for="(chart, i) in transformedData"
        :key="`line_data_${i}`"
        :is-row="true"
        :color="chart.color"
        :data="chart" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { chartColors, getDynamicColor } from '../colors';
import AppChartData from './app-chart-summary-data.vue';
import type { ISummaryChartData } from './types/charts.types';

const ANIMATION_DELAY: number = 500;

export default defineComponent({
  name: 'AppChartDonutCustom',
  components: { AppChartData },
  props: {
    data: { type: Array, required: true },
  },
  data() {
    const circleLength: number = 2 * Math.PI * this.radius;
    const radius: number = 19;
    const margin: number = 4;
    const isMounted: boolean = true;
    const getColor: Function = getDynamicColor(chartColors);

    return {
      getColor,
      isMounted,
      margin,
      radius,
      circleLength,
    };
  },
  computed: {
    transformedData(): ISummaryChartData[] {
      return this.data.map((chart) => {
        chart.color = this.getColor();
        return chart;
      });
    },
    filteredData(): ISummaryChartData[] {
      return this.transformedData.filter(({ percent }) => percent !== 0);
    },
    totalGaps(): number {
      return this.margin * this.filteredData.length;
    },
    gapDiff(): number {
      return (100 - this.totalGaps) / 100;
    },
  },
  watch: {
    data: [{ immediate: true, handler: 'setColors' }],
  },
  methods: {
    getWidth(data: ISummaryChartData): string {
      const percent: number = (data.percent * this.gapDiff) / 100;
      const halfMargin: number = this.margin / 2;
      const partOfCircleLength: number = this.circleLength * percent;

      return `${partOfCircleLength + halfMargin} ${this.circleLength - partOfCircleLength - halfMargin}`;
    },
    getOffset(data: ISummaryChartData[], idx: number): string {
      if (idx === 0) {
        return '0';
      }

      const prevSumWidth = data.reduce((acc, { percent }, i) => {
        if (i < idx) {
          return acc + this.circleLength * ((percent * this.gapDiff) / 100);
        }

        return acc;
      }, 0);

      const offSetTune: number = 1.2;

      const offSet: number = this.margin * idx * offSetTune;

      return (this.circleLength - prevSumWidth - offSet).toString();
    },
    async setColors(): Promise<void> {
      this.getColor = getDynamicColor(chartColors);
      this.isMounted = false;
      await this.$nextTick();
      setTimeout(() => {
        this.isMounted = true;
      }, ANIMATION_DELAY);
    },
  },
});
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
