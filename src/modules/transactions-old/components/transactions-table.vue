<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    is-secondary
    is-striped
    is-border-none
    :columns="columns">
    <template
      #type="{scope}">
      {{ $t(`entity.transaction.type.${scope.row.type}`) }}
    </template>
    <template
      #amount="{scope}">
      <div v-if="scope.row.transactions.length && scope.row.type !== 'exchange_transaction'">
        {{ scope.row.transactions[0].amount }} {{ getProp(scope.row.transactions[0], 'issuer.currency') }}
      </div>
      <template v-else-if="scope.row.children && scope.row.children.length && scope.row.type === 'exchange_transaction'">
        <div>{{ scope.row.children[0].outgoingAmount }} {{ getProp(scope.row.children[0], 'coin.issuer.currency') }},</div>
        <div>{{ scope.row.children[1].incomingAmount }} {{ getProp(scope.row.children[1], 'coin.issuer.currency') }}</div>
      </template>
      <div v-else>
        {{ getAmountValue(scope.row) }}
      </div>
    </template>
    <template
      #direction="{scope}">
      <span v-if="scope.row.type !== 'exchange_transaction'">{{ emptyChar }}</span>
      <template v-else>
        <div>{{ $t('table.label.from') }}: {{ scope.row.children[0].coin.serial }}</div>
        <div>{{ $t('table.label.to') }}: {{ scope.row.children[1].coin.serial }}</div>
      </template>
    </template>
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
          size="small"
          @click="openModal(scope.row)">
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
import config from '@/config';
import { ITransactionsRecord } from '@/services/requests/transactions/Transactions.types';
import { ITableColumn } from '@/types/interfaces';
import { getProp } from '@/utils';

@Component({
  components: {
    AppBadge,
    AppTable,
    AppButton,
  },
})
export default class TransactionsTable extends Vue {

  @Prop({ required: true, type: Array }) readonly data!: ITransactionsRecord[];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  readonly emptyChar: string = config.emptyChar;

  readonly columns: ITableColumn[] = [
    {
      prop: 'type',
      label: 'table.label.transaction_type',
      width: '105px',
    },
    {
      prop: 'amount',
      label: 'table.label.amount',
      width: '105px',
    },
    {
      prop: 'commission',
      label: 'table.label.commission',
      width: '110px',
    },
    {
      prop: 'createdAt',
      label: 'table.label.created_at',
      type: 'datetime',
    },
    {
      prop: 'direction',
      label: 'table.label.direction',
      width: '100px',
    },
    {
      prop: 'id',
      label: 'table.label.transactions_id',
      width: '130px',
    },
    {
      prop: 'status',
      label: 'table.label.status',
      className: 'table-status',
      width: '100px',
    },
    {
      prop: 'action',
      label: '',
      width: '110px',
    },
  ];

  protected getProp = getProp;

  @Emit('open-modal')
  protected openModal(record: ITransactionsRecord): ITransactionsRecord {
    return record;
  }

  protected getAmountValue(row: ITransactionsRecord): string | number {
    return row.invoiceAmount ?? row.amount ?? this.emptyChar;
  }

}
</script>
