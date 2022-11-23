<template>
  <app-table
    is-secondary
    is-striped
    is-border-none
    is-small-font
    :data="data"
    :is-loading="isLoading"
    :columns="columns">
    <template #status="{scope}">
      <app-badge
        is-borderless
        is-background-transparent
        :status="scope.row.status"/>
    </template>
    <template
      #action="{scope}">
      <div class="table-actions">
        <app-button
          size="mini"
          @click="openTxDetails(scope.row)">
          {{ $t('action.details') }}
        </app-button>
      </div>
    </template>
  </app-table>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppTable from '@/components/ui-framework/app-table.vue';
import AppBadge from '@/components/ui-kit/app-badge.vue';
import { ITransactionsRecord } from '@/services/requests/transactions/Transactions.types';
import { ITableColumn } from '@/types/interfaces';

@Component({
  components: {
    AppBadge,
    AppTable,
    AppButton,
  },
})
export default class TransactionsTable extends Vue {

  @Prop({ default: () => [], type: Array }) readonly data!: [];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  @Emit('open-tx-details')
  protected openTxDetails(record: ITransactionsRecord): ITransactionsRecord {
    return record;
  }

  public columns: ITableColumn[] = [
    {
      prop: 'name',
      label: 'table.label.name',
      sortable: true,
    },
    {
      prop: 'direction',
      label: 'table.label.direction',
      sortable: true,
    },
    {
      prop: 'amount',
      label: 'table.label.amount',
      sortable: true,
      type: 'displayAmount',
    },
    {
      prop: 'reason',
      label: 'table.label.reason',
      sortable: true,
    },
    {
      prop: 'type',
      label: 'table.label.type',
      sortable: true,
      width: '50px',
    },
    {
      prop: 'date',
      label: 'table.label.date',
      type: 'date',
      width: '85px',
      sortable: true,
    },
    {
      prop: 'source',
      label: 'table.label.source',
      sortable: true,
    },
    {
      prop: 'transactionId',
      label: 'table.label.transaction_id',
      sortable: true,
    },
    {
      prop: 'status',
      label: 'table.label.status',
      sortable: true,
      width: '100px',
    },
    {
      prop: 'action',
      label: '',
      width: '100px',
    },
  ]

}
</script>
