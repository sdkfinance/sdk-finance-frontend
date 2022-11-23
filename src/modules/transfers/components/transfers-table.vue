<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    is-secondary
    is-striped
    is-border-none
    :columns="columns">
    <template
      #amount="{scope}">
      {{ getAmountValue(scope.row, 'transfer') }}
    </template>
    <template
      #commission="{scope}">
      {{ getAmountValue(scope.row, 'commission') }}
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
import config from '@/config';
import {
  ITransfersRecord,
  ITransfersTransaction,
} from '@/services/requests/transfers/Transfers.types';
import { ITableColumn } from '@/types/interfaces';

@Component({
  components: {
    AppTable,
    AppButton,
  },
})
export default class TransfersTable extends Vue {

  @Prop({ required: true, type: Array }) readonly data!: ITransfersRecord[];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  readonly emptyChar: string = config.emptyChar;

  readonly columns: ITableColumn[] = [
    {
      prop: 'createdAt',
      label: 'table.label.created_at',
      type: 'datetime',
    },
    {
      prop: 'amount',
      label: 'table.label.amount',
    },
    {
      prop: 'commission',
      label: 'table.label.commission',
    },
    {
      prop: 'status',
      label: 'table.label.status',
    },
    {
      prop: 'action',
      label: '',
      width: '110px',
    },
  ];

  @Emit('open-modal')
  protected openModal(record: ITransfersRecord): ITransfersRecord {
    return record;
  }

  protected getAmountValue(data: ITransfersRecord, type: string): string {
    const { transactions } = data;
    const transaction = transactions.find((item: ITransfersTransaction) => item.type === type);
    if (!transaction) return this.emptyChar;
    return `${transaction.amount} ${transaction?.issuer?.currency}`;
  }

}
</script>
