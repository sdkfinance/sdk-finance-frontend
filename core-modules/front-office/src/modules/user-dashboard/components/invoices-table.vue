<template>
  <app-table
    :data="records"
    :span-method="getSeparatorSpan"
    is-border-none
    is-secondary
    is-medium-font
    empty-text=" "
    is-vertical-top
    row-class-name="cursor-pointer"
    :cell-class-name="getSeparatorColumnClass"
    :columns="tableColumns"
    @row-click="openDetailsGuard">
    <template #type="{ scope: { row } }">
      <span v-if="row.isSeparateColumn">
        {{ row.date }}
      </span>
      <app-table-info
        v-else
        :image="row.categoryImageLink"
        :title="row.title"
        :time="row.createdAt"
        :background-color="row.color"
        :category-name="row.data.description"
        :status="row.status" />
    </template>

    <template #amount="{ scope: { row } }">
      <app-table-amount
        :custom-class="amountClassList(row)"
        :amount="getAmountString(row)" />
    </template>
  </app-table>
</template>

<script lang="ts">
import type { IComputedInvoicesRecord, IInvoicesRecord } from '@sdk5/shared/requests';
import type { ITableColumn } from '@sdk5/shared/types';
import { AppTable, AppTableAmount, AppTableInfo } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

import { addSeparator, getSeparatorColumnClass, getSeparatorSpan } from '../utils/tableUtils';

const COMPONENTS = {
  AppTable,
  AppTableInfo,
  AppTableAmount,
} as const;

@Component({
  name: 'invoices-table',
  components: COMPONENTS,
})
export default class InvoicesTable extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ type: Array as PropType<IInvoicesRecord[]>, default: () => [{}] }) readonly data!: IInvoicesRecord[];

  $props!: {
    data?: IInvoicesRecord[];
  };

  protected tableColumns: ITableColumn[] = [
    {
      prop: 'type',
      label: 'table.label.description',
    },
    {
      prop: 'amount',
      label: 'table.label.amount',
      align: 'right',
      width: '100',
    },
  ];

  @Emit('open-details')
  protected openDetails(data: IInvoicesRecord) {
    return data;
  }

  protected getSeparatorColumnClass = getSeparatorColumnClass;

  protected getSeparatorSpan = getSeparatorSpan;

  protected openDetailsGuard(data: IInvoicesRecord): void {
    if ((data as any).isSeparateColumn) {
      return;
    }

    this.openDetails(data);
  }

  protected get records(): IComputedInvoicesRecord[] {
    const mappedData = this.data.map((item) => ({
      ...item,
      title: this.$t('pages.invoices.invoice'),
    }));

    return mappedData.reduce(addSeparator, []) as IComputedInvoicesRecord[];
  }

  protected getAmountString(row: IInvoicesRecord): string {
    const {
      totalPrice,
      status,
      currency: { symbol },
    } = row || {};

    if (status === 'paid') {
      return `-${symbol}${totalPrice}`;
    }

    return `${symbol}${totalPrice}`;
  }

  protected amountClassList(row: IInvoicesRecord): string {
    const { status } = row || {};

    const statusColors: { [key: string]: string } = {
      pending: 'text-orange-main',
      rejected: 'text-red-main',
      expired: 'text-red-main',
    };

    return statusColors[status] || '';
  }
}
</script>
