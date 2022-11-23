<template>
  <div class="flex">
    <app-chart-donut :chart-data="chartData"/>

    <div class="ml-30">
      <app-chart-data
        v-for="({color, value, label}, i) in contractsData"
        :key="`chart_1_${i}`"
        :color="color"
        :label="label"
        :value="value"/>
    </div>
  </div>
</template>

<script lang="ts">

import { ChartData } from 'chart.js';
import { Component, Vue } from 'vue-property-decorator';

import AppChartData from '@/components/ui-kit/app-charts/app-chart-data.vue';
import AppChartDonut from '@/components/ui-kit/app-charts/app-chart-donut.vue';
import { IPlainObject } from '@/types/interfaces';

const chartData = {
  labels: ['Contract 1', 'Contract 2', 'Contract 3'],
  datasets: [{
    data: [750, 806, 300],
    backgroundColor: [
      '#F7931A',
      '#F44336',
      '#9B51E0',
    ],
  }],
};

@Component({
  components: { AppChartData, AppChartDonut },
})
export default class PaymentGatewaysDashboard extends Vue {

  protected chartData: ChartData = chartData;

  protected get contractsData(): IPlainObject[] {
    const [{ backgroundColor, data }] = this.chartData.datasets || [];
    return this.chartData?.labels?.map((label, i): IPlainObject => ({
      color: Array.isArray(backgroundColor) ? backgroundColor[i] : '',
      value: Array.isArray(data) ? data[i] : '',
      label,
    })) || [];
  }

}
</script>
