<template>
  <div class="app-chart-donut">
    <div class="app-chart-donut__view">
      <canvas
        ref="canvas"
        :width="size"
        :height="size"/>
    </div>
    <div class="app-chart-donut__data">
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Chart, ChartData, registerables, ChartOptions,
} from 'chart.js';
import {
  Vue, Component, Ref, Prop, Watch,
} from 'vue-property-decorator';
import { IPlainObject } from '@/types/interfaces';

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

@Component
export default class AppChartDonut extends Vue {

  @Ref('canvas') readonly canvas!: HTMLCanvasElement;

  @Prop({ type: Object, default: () => ({}) }) readonly chartData!: ChartData

  @Prop({ type: Object, default: () => ({}) }) readonly options!: ChartOptions

  @Prop({ type: Number, default: 168 }) readonly size!: number

  protected chartInstance: Chart | null = null;

  protected get defaultStyle(): IPlainObject {
    const lineWidth: number = 28;
    return {
      borderRadius: 50,
      aspectRatio: 1,
      cutout: `${100 - ((lineWidth * 100) / this.size)}%`,
      borderWidth: 5,
    };
  }

  protected get customChartData(): ChartData {
    return {
      labels: this.chartData?.labels || [],
      datasets: this.chartData?.datasets?.map((data) => ({ ...data, ...this.defaultStyle })) || [],
    };
  }

  protected created(): void {
    Chart.register(...registerables);
  }

  protected mounted(): void {
    this.renderChart();
  }

  protected destroyed(): void {
    this.chartInstance = null;
  }

  @Watch('customChartData', { immediate: true, deep: true })
  protected async updateChart(value: ChartData): Promise<void> {
    await this.$nextTick();

    if (this.chartInstance) {
      this.chartInstance.data = value;
      this.chartInstance.update();
    }
  }

  protected async renderChart(): Promise<void> {
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
    });
  }

}
</script>

<style lang="scss">
.app-chart-donut {
  @apply flex justify-center items-center flex-col;

  &__data {
    @apply w-full mt-24;
  }
}
</style>
