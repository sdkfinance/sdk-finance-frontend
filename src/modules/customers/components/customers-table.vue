<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    :columns="columns"
    is-secondary
    is-striped
    is-border-none>
    <template #available_amount="{ scope }">
      {{ formattedAmountValue(scope.row.available_amount) }}
    </template>

    <template #last_login="{ scope }">
      {{ formatTimeMethod(scope.row.last_login) }}
    </template>

    <template #last_transaction="{ scope }">
      {{ formatTimeMethod(scope.row.last_transaction) }}
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
        @click="goToDetails(scope.row.id)">
        {{ $t('action.details') }}
      </app-button>
    </template>
  </app-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppTable from '@/components/ui-framework/app-table.vue';
import AppBadge from '@/components/ui-kit/app-badge.vue';
import { ITableColumn } from '@/types/interfaces';
import { formatDate } from '@/utils';
import { prefixedMoneyAmount } from '@/utils/moneyAmountFormat';

@Component({
  components: {
    AppBadge,
    AppButton,
    AppTable,
  },
})
export default class CustomersTable extends Vue {

  @Prop({ type: Array, default: () => ([]) }) readonly data!: [];

  @Prop({ type: Boolean, default: false }) readonly isLoading!: boolean;

  @Prop({ type: Boolean, default: false }) readonly isMerchant!: boolean;

  protected columns: ITableColumn[] = [
    {
      prop: 'id',
      label: 'table.label.id',
      sortable: true,
    },
    {
      prop: 'owner_name',
      label: 'table.label.owner_name',
      sortable: true,
      width: '150',
    },
    {
      prop: 'available_amount',
      label: 'table.label.available_amount',
      sortable: true,
      width: '170',
    },
    {
      prop: 'cohort',
      label: 'table.label.cohort',
      sortable: true,
      width: '100',
    },
    {
      prop: 'contract',
      label: 'table.label.contract',
      sortable: true,
      width: '120',
    },
    // {
    //   prop: 'last_login',
    //   label: 'table.label.last_login',
    //   sortable: true,
    //   width: '120',
    // },
    // {
    //   prop: 'last_transaction',
    //   label: 'table.label.last_transaction',
    //   sortable: true,
    //   width: '160',
    // },
    {
      prop: 'status',
      label: 'table.label.status',
      sortable: true,
      width: '90',
    },
    { prop: 'action', label: '', width: '90' },
  ]

  protected formattedAmountValue(value: number): string {
    return prefixedMoneyAmount(value, '$');
  }

  protected formatTimeMethod(value: string): string {
    return formatDate(value, false, true);
  }

  protected goToDetails(id: string): void {
    const name = this.isMerchant ? 'customer-merchants-details' : 'customer-individual-details';
    this.$router.push({ name, params: { id } });
  }

}
</script>
