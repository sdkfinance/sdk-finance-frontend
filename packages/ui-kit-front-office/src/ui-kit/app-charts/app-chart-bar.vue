<template>
  <div class="app-chart-bar">
    <canvas
      ref="canvas"
      :width="canvasWidth"
      :height="height" />
  </div>
</template>

<script lang="ts">
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
const DEFAULT_STYLE = {
  borderWidth: 0,
  borderRadius: 2,
  minBarLength: 2,
};

export default defineComponent({
  name: 'AppChartBar',
  props: {
    chartData: { type: Object as PropType<ChartData>, default: () => ({}) },
    options: { type: Object as PropType<ChartOptions>, default: () => ({}) },
    height: { type: Number, default: 178 },
  },
  data() {
    return {
      chartInstance: null as Chart | null,
    };
  },
  computed: {
    canvasWidth(): number {
      const defaultWidth = 178;
      const barWidth = 16;
      const barGap = 4;
      const elementWidth = barWidth + barGap;

      return this.customChartData?.datasets?.reduce((acc, { data }) => acc + data.length * elementWidth, 0) || defaultWidth;
    },
    customChartData(): ChartData {
      return {
        labels: this.chartData?.labels || [],
        datasets: this.chartData?.datasets?.map((data) => ({ ...data, ...DEFAULT_STYLE })) || [],
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
        type: 'bar',
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
        this.chartInstance.resize(this.canvasWidth, this.height);
      }
    },
  },
});
</script>
