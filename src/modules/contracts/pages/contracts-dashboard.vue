<template>
  <dashboard-content-layout class="contracts-dashboard">
    <template #title>
      {{ $t('pages.contracts.dashboard.contracts') }}
    </template>
    <template #actions>
      <app-dropdown
        v-if="isHaveContracts"
        :options="contractOptions"
        option-label="label"
        label="action.create_contract"
        secondary
        title-classes="text-xl"
        min-width="146px"
        @click="onDropDownChange"/>
    </template>

    <template v-if="isHaveContracts">
      <div class="contracts-dashboard__total">
        <app-currency-dropdown with-total/>
      </div>
      <app-tabs
        v-model="currentTab"
        secondary
        query-param="type"
        :tabs="tabs"/>
      <div class="contracts-dashboard__filter">
        <div class="contracts-dashboard__filter-item">
          {{ $t('filter.contract_roles') }}
          <app-select
            v-model="contractRole"
            :is-dropdown="true"
            class="ml-8"
            option-value="value"
            option-label="label"
            :options="roleOptions"
            :is-dropdown-simple="true"/>
        </div>
        <div class="contracts-dashboard__filter-item">
          {{ $t('filter.period') }}
          <app-date-range-select
            v-model="period"
            class="ml-8"/>
        </div>
        <div>
          <app-switch
            v-model="isCompare"
            label="filter.compare"
            :is-label-after="true"
            :secondary="true"/>
        </div>
      </div>
      <div class="contracts-dashboard__charts">
        <contract-chart-box>
          <template #title>
            {{ $t('pages.contracts.dashboard.number_of_the_customers') }}
          </template>
          <template #value>
            1,456
          </template>
          <template #chart>
            <app-chart-donut :chart-data="chartData"/>
          </template>
          <template #data>
            <app-chart-data
              v-for="({color, value, label}, i) in contractsData"
              :key="`chart_1_${i}`"
              :color="color"
              :label="label"
              :value="value"/>
          </template>
        </contract-chart-box>
        <contract-chart-box>
          <template #title>
            {{ $t('pages.contracts.dashboard.commissions_earned') }}
          </template>
          <template #value>
            $45,125
          </template>
          <template #chart>
            <app-chart-donut :chart-data="chartData"/>
          </template>
          <template #data>
            <app-chart-data
              v-for="({color, value, label}, i) in contractsData"
              :key="`chart_2_${i}`"
              :color="color"
              :label="label"
              :value="`$${value}`"/>
          </template>
        </contract-chart-box>
        <contract-chart-box>
          <template #title>
            {{ $t('pages.contracts.dashboard.median_earning_per_client') }}
          </template>
          <template #chart>
            <app-chart-bar :chart-data="chartDataCompare"/>
          </template>
          <template #data>
            <app-chart-data
              v-for="({color, label}, i) in contractsData"
              :key="`chart_3_${i}`"
              :color="color"
              :label="label"/>
          </template>
        </contract-chart-box>
        <contract-chart-box>
          <template #title>
            {{ $t('pages.contracts.dashboard.median_of_transactions_per_client') }}
          </template>
          <template #chart>
            <app-chart-bar :chart-data="chartDataCompare"/>
          </template>
          <template #data>
            <app-chart-data
              v-for="({color, label}, i) in contractsData"
              :key="`chart_3_${i}`"
              :color="color"
              :label="label"/>
          </template>
        </contract-chart-box>
        <contract-chart-box>
          <template #title>
            {{ $t('pages.contracts.dashboard.percent_of_clients_using_this_last_month') }}
          </template>
          <template #chart>
            <app-chart-bar :chart-data="chartDataCompare"/>
          </template>
          <template #data>
            <app-chart-data
              v-for="({color, label}, i) in contractsData"
              :key="`chart_3_${i}`"
              :color="color"
              :label="label"/>
          </template>
        </contract-chart-box>
      </div>
    </template>
    <div
      v-else
      class="contracts-dashboard__create">
      <div class="contracts-dashboard__create-text">
        {{ $t('pages.contracts.dashboard.contracts_empty_msg') }}
      </div>
      <app-button>{{ $t('action.create_new_contract') }}</app-button>
    </div>
  </dashboard-content-layout>
</template>

<script lang="ts">
import { ChartData } from 'chart.js';
import { Component, Vue } from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppDropdown from '@/components/ui-framework/app-dropdown.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppSwitch from '@/components/ui-framework/app-switch.vue';
import AppChartBar from '@/components/ui-kit/app-charts/app-chart-bar.vue';
import AppChartData from '@/components/ui-kit/app-charts/app-chart-data.vue';
import AppChartDonut from '@/components/ui-kit/app-charts/app-chart-donut.vue';
import AppDateRangeSelect from '@/components/ui-kit/app-date-range-select.vue';
import AppStatsBadge from '@/components/ui-kit/app-stats-badge.vue';
import AppTabs, { ITab } from '@/components/ui-kit/app-tabs.vue';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import AppCurrencyDropdown from '@/modules/contracts/components/app-currency-dropdown.vue';
import ContractChartBox from '@/modules/contracts/components/contract-chart-box.vue';
import { IPlainObject } from '@/types/interfaces';
import { IOption } from '@/types/interfaces/Options.interface';

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
const chartDataCompare = {
  labels: ['Contract 1', 'Contract 2', 'Contract 3'],
  datasets: [{
    data: [750, 806, 30],
    backgroundColor: [
      '#F7931A',
      '#F44336',
      '#9B51E0',
    ],
  },
  ],
};

enum actionTypes {
  createContract,
  duplicateContract,
}

type TOptionCommand = {
  action: actionTypes;
}

@Component({
  components: {
    AppTabs,
    DashboardContentLayout,
    AppButton,
    AppChartBar,
    AppChartData,
    AppChartDonut,
    ContractChartBox,
    AppSwitch,
    AppDateRangeSelect,
    AppCurrencyDropdown,
    AppStatsBadge,
    AppSelect,
    AppDropdown,
  },
})
export default class ContractsDashboard extends Vue {

  protected isHaveContracts: boolean = true;

  protected tabs: ITab[] = [
    {
      value: 'individual',
      translation: 'Individuals',
    },
    {
      value: 'merchants',
      translation: 'Merchants',
    },
  ]

  protected contractOptions: IPlainObject[] = [
    {
      label: 'action.create_new_contract',
      classes: 'text-blue-600',
      command: { action: actionTypes.createContract },
    },
    {
      label: 'action.duplicate_from_existing',
      classes: 'text-blue-600',
      command: { action: actionTypes.duplicateContract },
    },
  ]

  protected roleOptions: IOption[] = [
    {
      label: 'all',
      value: 'all',
    },
    {
      label: 'sample',
      value: 'sample',
    },
  ]

  protected contractRole: string = 'all';

  protected period = '';

  protected isCompare: boolean = false;

  protected chartData: ChartData = chartData;

  protected chartDataCompare: ChartData = chartDataCompare;

  protected currentTab: string = '';

  protected get contractsData(): IPlainObject[] {
    const [{ backgroundColor, data }] = this.chartData.datasets || [];
    return this.chartData?.labels?.map((label, i): IPlainObject => ({
      color: Array.isArray(backgroundColor) ? backgroundColor[i] : '',
      value: Array.isArray(data) ? data[i] : '',
      label,
    })) || [];
  }

  protected onDropDownChange(event: TOptionCommand): void {
    if (event.action === actionTypes.createContract) {
      this.$router.push({ name: 'create-contract' });
    } else if (event.action === actionTypes.duplicateContract) {
      this.$router.push({ name: 'create-contract' });
    }
  }

}
</script>

<style lang="scss">
  .contracts-dashboard {
    &__total {
      @apply mb-40;
    }

    &__stats {
      @apply grid grid-cols-1 md:grid-cols-3 gap-24 mb-48;
    }

    &__filter {
      @apply flex items-center mb-32 text-gray-500 leading-none;

      &-item {
        @apply flex items-center mr-16;
      }
    }

    &__charts {
      @apply grid grid-cols-1 md:grid-cols-2 gap-32;
    }

    &__create {
      @apply flex flex-grow flex-col justify-center items-center mb-100;

      &-text {
        @apply text-lg text-gray-500 text-center mb-32;
      }
    }
  }
</style>
