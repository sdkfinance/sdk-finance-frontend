<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    is-secondary
    is-striped
    is-border-none
    is-small-font
    :columns="columns">
    <template #type="{scope}">
      <app-rows-column :rows="2">
        <template #label-1>
          {{ $t('table.label.transaction_type') }}:
        </template>
        <template #value-1>
          {{ getTransactionValue(scope.row.supportedTransactions, 'transactionType') }}
        </template>
        <template #label-2>
          {{ $t('table.label.payment_way') }}:
        </template>
        <template #value-2>
          {{ getTransactionValue(scope.row.supportedTransactions, 'paymentWay') }}
        </template>
      </app-rows-column>
    </template>
    <template #action="{scope}">
      <app-button
        size="small"
        @click="openDetails(scope.row)">
        {{ $t('action.view_details') }}
      </app-button>
    </template>
  </app-table>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppTable from '@/components/ui-framework/app-table.vue';
import AppRowsColumn from '@/components/ui-kit/table-columns/app-rows-column.vue';
import { IPlainObject, ITableColumn } from '@/types/interfaces';

@Component({
  components: {
    AppRowsColumn,
    AppTable,
    AppButton,
    AppInput,
  },
})
export default class ProvidersTable extends Vue {

  @Prop({ default: '', type: Array }) private data!: [];

  @Prop({ default: false, type: Boolean }) private isLoading!: boolean;

  public columns: ITableColumn[] = [
    {
      prop: 'name',
      label: 'table.label.provider_name',
    },
    {
      prop: 'type',
      label: 'table.label.supported_transaction_types',
    },
    {
      prop: 'action',
      label: '',
      width: '140',
    },
  ];

  @Emit('openDetails')
  openDetails(value: IPlainObject): IPlainObject {
    return value;
  }

  public getTransactionValue(data: [], key: string): string {
    const result = new Set(data.map((item: IPlainObject) => item[key]));
    return [...result].join(', ');
  }

}
</script>
