<template>
  <div class="app-chart-bar">
    <canvas
      ref="canvas"
      :width="canvasWidth"
      :height="height"/>
  </div>
</template>

<script lang="ts">
import {
  Chart, ChartData, ChartOptions,
  registerables,
} from 'chart.js';
import {
  Component, Prop, Ref, Vue, Watch,
} from 'vue-property-decorator';

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

@Component
export default class AppChartBar extends Vue {

  @Ref('canvas') readonly canvas!: HTMLCanvasElement;

  @Prop({ type: Object, default: () => ({}) }) readonly chartData!: ChartData

  @Prop({ type: Object, default: () => ({}) }) readonly options!: ChartOptions

  @Prop({ type: Number, default: 178 }) readonly height!: number

  protected chartInstance: Chart | null = null;

  protected get canvasWidth(): number {
    const defaultWidth = 178;
    const barWidth = 16;
    const barGap = 4;
    const elementWidth = barWidth + barGap;

    return this.customChartData?.datasets?.reduce((acc, { data }) => acc + data.length * elementWidth, 0) || defaultWidth;
  }

  protected get customChartData(): ChartData {
    return {
      labels: this.chartData?.labels || [],
      datasets: this.chartData?.datasets?.map((data) => ({ ...data, ...DEFAULT_STYLE })) || [],
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
      this.chartInstance.resize(this.canvasWidth, this.height);
    }
  }

  protected async renderChart(): Promise<void> {
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
    });
  }

}
</script>
