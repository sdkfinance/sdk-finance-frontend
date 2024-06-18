<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    cell-class-name="v-align-top"
    :columns="columns">
    <template #direction="{ scope, getColumnValue }">
      <div>
        <strong> {{ $t('table.label.service') }}: </strong>

        {{ scope.row.name }}
      </div>
      <div>
        <strong> {{ $t('table.label.product_code') }}: </strong>

        {{ getColumnValue(scope.row, 'data.productCode') }}
      </div>
      <div>
        <strong> {{ $t('table.label.quantity_of_goods') }}: </strong>

        {{ getColumnValue(scope.row, 'data.count') }}
      </div>
      <div>
        <strong> {{ $t('table.label.receiver') }}: </strong>

        {{ getColumnValue(scope.row, 'payer.name') }}
      </div>
      <div>
        <strong> {{ $t('table.label.expired_at') }}: </strong>

        {{ getColumnValue(scope.row, 'expiresAt', 'date') }}
      </div>
    </template>
    <template #totalPrice="{ scope }">
      {{ getAmountWithCurrency(scope.row) }}
    </template>
    <template #action="{ scope }">
      <div class="table-actions">
        <app-button
          size="small"
          @click="openInvoiceDetailsModal(scope.row)">
          {{ $t('action.view_details') }}
        </app-button>
      </div>
    </template>
  </app-table>
</template>

<script lang="ts">
import config from '@sdk5/shared/config';
import type { IInvoicesRecord } from '@sdk5/shared/requests';
import type { ITableColumn } from '@sdk5/shared/types';
import { AppButton, AppTable } from '@sdk5/ui-kit-front-office';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

const COMPONENTS = {
  AppTable,
  AppButton,
} as const;

@Component({
  name: 'invoices-table',
  components: COMPONENTS,
})
export default class InvoicesTable extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ required: true, type: Array }) readonly data!: IInvoicesRecord[];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  $props!: {
    data: IInvoicesRecord[];
    isLoading?: boolean;
  };

  protected getAmount(row: IInvoicesRecord): number | string {
    return row.totalPrice ?? this.emptyChar;
  }

  protected getAmountWithCurrency(row: IInvoicesRecord): string {
    const amount = this.getAmount(row);
    const currency = row.currency?.code || '';

    if (amount === this.emptyChar) {
      return this.emptyChar;
    }

    return `${amount} ${currency}`;
  }

  readonly emptyChar: string = config.emptyChar;

  readonly columns: ITableColumn[] = [
    {
      prop: 'identifier',
      label: 'table.label.id',
      width: '150px',
    },
    {
      prop: 'createdAt',
      label: 'table.label.date',
      type: 'datetime',
    },
    {
      prop: 'direction',
      label: 'table.label.direction',
    },
    {
      prop: 'totalPrice',
      label: 'table.label.amount',
    },
    {
      prop: 'status',
      label: 'table.label.status',
      className: 'table-status',
    },
    {
      prop: 'action',
      label: 'table.label.action',
      width: '120px',
    },
  ];

  @Emit('open-invoice-details-modal')
  protected openInvoiceDetailsModal(record: IInvoicesRecord): IInvoicesRecord {
    return record;
  }
}
</script>
