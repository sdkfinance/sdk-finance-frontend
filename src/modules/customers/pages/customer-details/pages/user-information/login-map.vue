<template>
  <div class="login-map">
    <div class="login-map__header">
      <img
        class="login-map__image"
        :src="require('@/assets/images/world-map.svg')"
        alt="">

      <div class="flex-shrink-0">
        <app-chart-data
          v-for="({color, value, label}, i) in contractsData"
          :key="`chart_1_${i}`"
          :color="color"
          :label="label"
          :value="value"/>
      </div>
    </div>

    <app-table
      :data="data"
      :is-loading="isLoading"
      :columns="columns"
      is-secondary
      is-striped
      is-border-none>
      <template #session="{ scope }">
        <app-badge
          is-borderless
          is-background-transparent
          :status="scope.row.status"/>
      </template>

      <template #action>
        <app-button size="small">
          {{ $t('action.details') }}
        </app-button>
      </template>
    </app-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ChartData } from 'chart.js';
import { IPlainObject, ITableColumn } from '@/types/interfaces';

import AppTable from '@/components/ui-framework/app-table.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppBadge from '@/components/ui-kit/app-badge.vue';
import AppChartData from '@/components/ui-kit/app-charts/app-chart-data.vue';

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
  components: {
    AppChartData, AppBadge, AppButton, AppTable,
  },
})
export default class LoginMap extends Vue {

  @Prop({ type: Boolean, default: false }) readonly isLoading!: boolean;

  protected columns: ITableColumn[] = [
    {
      prop: 'location',
      label: 'table.label.location',
      sortable: true,
      width: '250',
    },
    {
      prop: 'lastSession',
      label: 'table.label.last_session',
      sortable: true,
    },
    {
      prop: 'lastSessionTime',
      label: 'table.label.last_session_time',
      sortable: true,
    },
    {
      prop: 'operations',
      label: 'table.label.operations',
      sortable: true,
    },
    {
      prop: 'device',
      label: 'table.label.device',
      sortable: true,
    },
    {
      prop: 'session',
      label: 'table.label.session',
      sortable: true,
    },
    { prop: 'action', label: '', width: '90' },
  ]

  protected data: IPlainObject[] = [
    {
      location: 'Vilnius, Lithuania',
      lastSession: '22.06.2021',
      lastSessionTime: '50 min',
      operations: '7',
      device: 'Desktop',
      session: 'active',
    },
    {
      location: 'Vilnius, Lithuania',
      lastSession: '20.06.2021',
      lastSessionTime: '4 hours',
      operations: '51',
      device: 'Desktop',
      session: 'active',
    },
  ]

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

<style lang="scss">
.login-map {
  &__header {
    @apply flex flex-wrap md:flex-nowrap justify-between;
  }

  &__image {
    @apply mr-0 md:mr-135 mb-20 md:mb-0;
  }
}
</style>
