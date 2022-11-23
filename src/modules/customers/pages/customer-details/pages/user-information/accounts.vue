<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    :columns="columns"
    is-secondary
    is-striped
    is-border-none>
    <template #status="{ scope }">
      <app-badge
        is-borderless
        is-background-transparent
        :status="scope.row.status"/>
    </template>

    <template #action>
      <app-button
        secondary
        size="small">
        {{ $t('action.block_account') }}
      </app-button>
    </template>
  </app-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppTable from '@/components/ui-framework/app-table.vue';
import AppBadge from '@/components/ui-kit/app-badge.vue';
import { IPlainObject, ITableColumn } from '@/types/interfaces';

@Component({
  components: { AppBadge, AppButton, AppTable },
})
export default class Accounts extends Vue {

  @Prop({ type: Boolean, default: false }) readonly isLoading!: boolean;

  protected columns: ITableColumn[] = [
    {
      prop: 'name',
      label: 'table.label.name',
      sortable: true,
    },
    {
      prop: 'currency',
      label: 'table.label.currency',
      sortable: true,
    },
    {
      prop: 'amount',
      label: 'table.label.amount',
      type: 'displayAmount',
      sortable: true,
    },
    {
      prop: 'accountNumber',
      label: 'table.label.account_number',
      sortable: true,
    },
    {
      prop: 'status',
      label: 'table.label.status',
      sortable: true,
    },
    { prop: 'action', label: '', width: '135' },
  ]

  protected data: IPlainObject[] = [
    {
      name: 'Main account', currency: 'USD', amount: '2300', accountNumber: 'AT400123121441', status: 'active',
    },
    {
      name: 'Euro account', currency: 'EUR', amount: '5540', accountNumber: 'AT400123121441', status: 'active',
    },
    {
      name: 'Bitcount account', currency: 'BTC', amount: '0435', accountNumber: 'AT400123121441', status: 'active',
    },
  ]

}
</script>
