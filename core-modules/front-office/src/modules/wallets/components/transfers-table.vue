<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    :is-border-none="true"
    :is-light-head="true"
    :is-large-font="true"
    :columns="columns">
    <template #amount="{ scope }">
      <amount-column :data="getAmountData(scope.row)" />
    </template>
  </app-table>
</template>

<script lang="ts">
import type { ITransactionsRecord, IWalletRecord } from '@sdk5/shared/requests';
import { Profile } from '@sdk5/shared/store';
import type { IPlainObject, ITableColumn } from '@sdk5/shared/types';
import { AppTable } from '@sdk5/ui-kit-front-office';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import { getTransactionData } from '../utils';
import AmountColumn from './columns/amount-column.vue';

@Component({
  name: 'transfers-table',
  components: {
    AppTable,
    AmountColumn,
  },
})
export default class TransfersTable extends Vue {
  @Prop({ default: '', type: Array }) readonly data!: [];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  @Prop({ type: Array, default: () => [] }) readonly coinsData!: IWalletRecord[];

  protected profileModule = getModule(Profile, this.$store);

  protected get profileContactData() {
    return this.profileModule.profileData.contact;
  }

  readonly columns: ITableColumn[] = [
    {
      prop: 'createdAt',
      label: 'table.label.date',
      width: '190px',
      type: 'datetime',
    },
    {
      prop: 'type',
      label: 'table.label.operation_type',
      localePrefix: 'entity.transaction.type',
    },
    {
      prop: 'amount',
      label: 'table.label.amount',
      align: 'right',
    },
  ];

  protected getAmountData(transaction: ITransactionsRecord): IPlainObject {
    return getTransactionData({ transaction, coinsData: this.coinsData, profileContactData: this.profileContactData });
  }
}
</script>
