<template>
  <div>
    <page-subtitle> {{ $t('pages.user_dashboard.summary.balance_structure_in') }} {{ currentCurrency }} </page-subtitle>
    <div class="hidden sm:block mb-48">
      <app-chart-line
        :chart-data="chartData"
        :additional-info="summaryChartData">
        <template #label="scope">
          <app-chart-summary-data :data="scope" />
        </template>
      </app-chart-line>
    </div>

    <div class="block sm:hidden">
      <app-chart-donut :chart-data="chartData">
        <app-chart-summary-data
          v-for="(chart, i) in summaryChartData"
          :key="`data_${i}`"
          :data="chart"
          :is-row="true" />
      </app-chart-donut>
    </div>

    <summary-spending>
      <template #default="{ dateFilter, highestOutflowRecord }">
        <summary-cards
          :date-filter="dateFilter"
          :highest-outflow-record="highestOutflowRecord" />
      </template>
    </summary-spending>
  </div>
</template>

<script lang="ts">
import type { ISummaryChartData } from '@sdk5/ui-kit-front-office';
import { AppChartDonut, AppChartLine, AppChartSummaryData, chartColors, getDynamicColor } from '@sdk5/ui-kit-front-office';
import type { ChartData } from 'chart.js';
import { defineComponent } from 'vue';
import { getModule } from 'vuex-module-decorators';

import { UserCoins } from '../../../../../store/modules';
import PageSubtitle from '../../../components/page-subtitle.vue';
import SummaryCards from '../../../components/summary/summary-cards.vue';
import SummarySpending from '../../../components/summary/summary-spending.vue';

export default defineComponent({
  components: {
    PageSubtitle,
    SummarySpending,
    SummaryCards,
    AppChartDonut,
    AppChartLine,
    AppChartSummaryData,
  },
  data() {
    return {
      userCoinsModule: getModule(UserCoins, this.$store),
    };
  },
  computed: {
    currentCurrency(): string {
      if (!this.userCoinsModule.currentCurrency) {
        return '';
      }

      return this.userCoinsModule.coins.find((coin) => coin.currency.id === this.userCoinsModule.currentCurrency)?.currency.code ?? '';
    },
    summaryChartData(): ISummaryChartData[] {
      const getColor: Function = getDynamicColor(chartColors);

      return this.userCoinsModule?.coinDetails?.map((coinDetail) => ({
        currency: coinDetail.coinEntry.currency,
        percent: coinDetail.percentFromTotal,
        amount: coinDetail.roundedAmount,
        symbol: coinDetail.symbol,
        color: getColor(),
      }));
    },
    chartData(): ChartData {
      const getColor: Function = getDynamicColor(chartColors);

      return this.userCoinsModule?.coinDetails?.reduce(
        (acc: ChartData, coinDetail): ChartData => ({
          labels: [...(acc?.labels || []), coinDetail.coinEntry.currency],
          datasets: [
            {
              data: [...acc.datasets[0].data, coinDetail.percentFromTotal],
              backgroundColor: [...(Array.isArray(acc.datasets[0].backgroundColor) ? acc.datasets[0].backgroundColor : []), getColor()],
            },
          ],
        }),
        { labels: [], datasets: [{ data: [], backgroundColor: [] }] } as ChartData,
      );
    },
  },
});
</script>
