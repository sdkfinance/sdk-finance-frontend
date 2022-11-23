<template>
  <div>
    <page-subtitle>
      {{ $t('pages.user_dashboard.summary.balance_structure_in') }} {{ currentCurrency }}
    </page-subtitle>
    <div class="hidden sm:block mb-48">
      <app-chart-line
        :chart-data="chartData"
        :additional-info="summaryChartData">
        <template #label="scope">
          <app-chart-summary-data :data="scope"/>
        </template>
      </app-chart-line>
    </div>

    <div class="block sm:hidden">
      <app-chart-donut
        :chart-data="chartData">
        <app-chart-summary-data
          v-for="(chart, i) in summaryChartData"
          :key="`data_${i}`"
          :data="chart"
          :is-row="true"/>
      </app-chart-donut>
    </div>

    <summary-spending>
      <template #default="{ dateFilter, highestOutflowRecord }">
        <summary-cards
          :date-filter="dateFilter"
          :highest-outflow-record="highestOutflowRecord"/>
      </template>
    </summary-spending>
  </div>
</template>

<script lang="ts">
import { ChartData } from 'chart.js';
import {
  Component, Vue,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import AppChartDonut from '@/components/ui-kit/app-charts/app-chart-donut.vue';
import AppChartLine from '@/components/ui-kit/app-charts/app-chart-line.vue';
import AppChartSummaryData from '@/components/ui-kit/app-charts/app-chart-summary-data.vue';
import { ISummaryChartData } from '@/components/ui-kit/app-charts/types/charts.types';
import { chartColors, getDynamicColor } from '@/components/ui-kit/colors';
import PageSubtitle from '@/modules/user-dashboard/components/page-subtitle.vue';
import SummaryCards from '@/modules/user-dashboard/components/summary/summary-cards.vue';
import SummarySpending from '@/modules/user-dashboard/components/summary/summary-spending.vue';
import { UserCoins } from '@/store/modules';

@Component({
  components: {
    PageSubtitle,
    SummarySpending,
    SummaryCards,
    AppChartDonut,
    AppChartLine,
    AppChartSummaryData,
  },
})
export default class SummaryPage extends Vue {

  protected userCoinsModule = getModule(UserCoins, this.$store);

  protected get currentCurrency(): string {
    return this.userCoinsModule.currentCurrency;
  }

  protected get summaryChartData(): ISummaryChartData[] {

    const getColor: Function = getDynamicColor(chartColors);

    return this.userCoinsModule?.coinDetails?.map((coinDetail) => ({
      currency: coinDetail.coinEntry.currency,
      percent: coinDetail.percentFromTotal,
      amount: coinDetail.roundedAmount,
      symbol: coinDetail.symbol,
      color: getColor(),
    }));
  }

  protected get chartData(): ChartData {

    const getColor: Function = getDynamicColor(chartColors);

    return this.userCoinsModule?.coinDetails?.reduce((acc: ChartData, coinDetail): ChartData => ({
      labels: [...(acc?.labels || []), coinDetail.coinEntry.currency],
      datasets: [{
        data: [...acc.datasets[0].data, coinDetail.percentFromTotal],
        backgroundColor: [...(Array.isArray(acc.datasets[0].backgroundColor) ? acc.datasets[0].backgroundColor : []), getColor()],
      }],
    }), { labels: [], datasets: [{ data: [], backgroundColor: [] }] } as ChartData);
  }

}
</script>
