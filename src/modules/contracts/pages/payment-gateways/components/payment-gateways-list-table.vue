<template>
  <div>
    <app-table
      :data="data"
      :is-loading="isLoading"
      :columns="columns"
      is-secondary
      is-striped
      is-border-none>
      <template #earned_last_month="{ scope }">
        {{ getDisplayAmount(scope.row.earned_last_month) }}
      </template>

      <template #median_earning="{ scope }">
        {{ getDisplayAmount(scope.row.median_earning) }}
      </template>

      <template #endDate="{ scope }">
        <span class="capitalize">{{ scope.row.endDate }}</span>
      </template>

      <template #status="{ scope }">
        <app-badge
          is-borderless
          is-background-transparent
          :status="scope.row.status"/>
      </template>

      <template #action="{ scope }">
        <app-button
          size="mini"
          @click="navigateToDetails(scope.row)">
          {{ $t('action.details') }}
        </app-button>
      </template>
    </app-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppTable from '@/components/ui-framework/app-table.vue';
import AppBadge from '@/components/ui-kit/app-badge.vue';
import { IPlainObject, ITableColumn } from '@/types/interfaces';
import { getDisplayAmount } from '@/utils';

@Component({
  components: {
    AppBadge,
    AppTable,
    AppButton,
  },
})
export default class PaymentGatewaysListTable extends Vue {

  @Prop({ type: Array, default: () => ([]) }) readonly data!: [];

  @Prop({ type: Boolean, default: false }) readonly isLoading!: boolean;

  protected columns: ITableColumn[] = [
    {
      prop: 'name',
      label: 'table.label.payment_gateways',
      sortable: true,
    },
    {
      prop: 'percent',
      label: 'table.label.percent_of_last_month',
      type: 'percent',
      sortable: true,
    },
    {
      prop: 'earned_last_month',
      label: 'table.label.earned_last_month',
      sortable: true,
    },
    {
      prop: 'median_transaction',
      label: 'table.label.median_transaction',
      sortable: true,
      type: 'displayAmount',
    },
    {
      prop: 'median_earning',
      label: 'table.label.median_earning',
      sortable: true,
    },
    {
      prop: 'endDate',
      label: 'table.label.endDate',
      sortable: true,
    },
    {
      prop: 'startDate',
      label: 'table.label.startDate',
      sortable: true,
      type: 'date',
    },
    {
      prop: 'status',
      label: 'table.label.status',
      sortable: true,
    },
    { prop: 'action', label: '', width: '110' },
  ]

  protected getDisplayAmount(value: number | string): ReturnType<typeof getDisplayAmount> {
    return getDisplayAmount(value, 'prefixedAmount', '$');
  }

  protected navigateToDetails(row: IPlainObject) {
    // eslint-disable-next-line no-console
    console.log(row);
  }

}
</script>
