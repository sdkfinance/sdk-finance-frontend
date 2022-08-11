<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    :columns="columns">
    <template
      #action="{ scope: { row } }">
      <div class="table-actions">
        <app-button
          size="small"
          @click="openModal(row)">
          {{ $t('action.view_details') }}
        </app-button>
      </div>
    </template>
  </app-table>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Prop,
  Vue,
} from 'vue-property-decorator';
import AppTable from '@/components/ui-framework/app-table.vue';
import { ITableColumn } from '@/types/interfaces';
import AppButton from '@/components/ui-framework/app-button.vue';
import { IWithdrawalRecord } from '@/services/requests/bank-withdrawals/Withdrawal.interface';

@Component({
  components: {
    AppTable,
    AppButton,
  },
})
export default class BankWithdrawalRequestsTable extends Vue {

  @Prop({ default: '', type: Array }) private data!: [];

  @Prop({ default: false, type: Boolean }) private isLoading!: boolean;

  public columns: ITableColumn[] = [
    {
      prop: 'fullName',
      label: 'table.label.name',
    },
    {
      prop: 'requestIdentifier',
      label: 'table.label.id',
    },
    {
      prop: 'cashAmount',
      label: 'table.label.amount',
      width: '120px',
    },
    {
      prop: 'status',
      label: 'table.label.status',
      width: '120px',
    },
    {
      prop: 'createdAt',
      label: 'table.label.created_at',
      width: '200px',
      type: 'datetime',
    },
    {
      prop: 'action',
      label: 'table.label.action',
      width: '120px',
    },
  ]

  @Emit('open-modal')
  protected openModal(record: IWithdrawalRecord): IWithdrawalRecord {
    return record;
  }

}
</script>
