<template>
  <div class="app-chart-donut">
    <div class="app-chart-donut__view">
      <canvas
        ref="canvas"
        :width="size"
        :height="size" />
    </div>
    <div class="app-chart-donut__data">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import type { IPlainObject } from '@sdk5/shared/types';
import type { ChartData, ChartOptions } from 'chart.js';
import { Chart, registerables } from 'chart.js';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

const DEFAULT_OPTIONS: ChartOptions = {
  responsive: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      display: false,
      beginAtZero: true,
      grid: {
        display: false,
      },
      ticks: {
        display: false,
      },
    },
    y: {
      display: false,
      beginAtZero: true,
      ticks: {
        display: false,
      },
      grid: {
        display: false,
      },
    },
  },
};

export default defineComponent({
  name: 'AppChartDonut',
  props: {
    chartData: { type: Object as PropType<ChartData>, default: () => ({}) },
    options: { type: Object as PropType<ChartOptions>, default: () => ({}) },
    size: { type: Number, default: 168 },
  },
  data() {
    return {
      chartInstance: null as Chart | null,
    };
  },
  computed: {
    defaultStyle(): IPlainObject {
      const lineWidth: number = 28;
      return {
        borderRadius: 50,
        aspectRatio: 1,
        cutout: `${100 - (lineWidth * 100) / this.size}%`,
        borderWidth: 5,
      };
    },
    customChartData(): ChartData {
      return {
        labels: this.chartData?.labels || [],
        datasets: this.chartData?.datasets?.map((data) => ({ ...data, ...this.defaultStyle })) || [],
      };
    },
    canvas: {
      cache: false,
      get() {
        return this.$refs.canvas as HTMLCanvasElement;
      },
      set() {},
    },
  },
  watch: {
    customChartData: [{ immediate: true, deep: true, handler: 'updateChart' }],
  },
  created(): void {
    Chart.register(...registerables);
  },
  mounted(): void {
    this.renderChart();
  },
  destroyed(): void {
    this.chartInstance = null;
  },
  methods: {
    async renderChart(): Promise<void> {
      await this.$nextTick();

      const ctx = this.canvas.getContext('2d');

      if (!ctx) {
        return;
      }

      this.chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: this.customChartData,
        options: {
          ...DEFAULT_OPTIONS,
          ...this.options,
        },
      }) as any;
    },
    async updateChart(value: ChartData): Promise<void> {
      await this.$nextTick();

      if (this.chartInstance) {
        this.chartInstance.data = value;
        this.chartInstance.update();
      }
    },
  },
});
</script>

<style lang="scss">
.app-chart-donut {
  @apply flex justify-center items-center flex-col;

  &__data {
    @apply w-full mt-24;
  }
}
</style>
