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
        :status="row.status"/>
    </template>

    <template #amount="{ scope: { row } }">
      <app-table-amount
        :custom-class="amountClassList(row)"
        :amount="getAmountString(row)"/>
    </template>
  </app-table>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';

import AppTable from '@/components/ui-framework/app-table.vue';
import AppTableAmount from '@/components/ui-kit/app-table/app-table-amount.vue';
import AppTableInfo from '@/components/ui-kit/app-table/app-table-info.vue';
import { addSeparator, getSeparatorColumnClass, getSeparatorSpan } from '@/modules/user-dashboard/utils/tableUtils';
import { IComputedInvoicesRecord, IInvoicesRecord } from '@/services/requests/invoices/Invoices.types';
import { IPlainObject, ITableColumn } from '@/types/interfaces';

@Component({
  components: {
    AppTable,
    AppTableInfo,
    AppTableAmount,
  },
  methods: {
    getSeparatorColumnClass,
    getSeparatorSpan,
  },
})
export default class InvoicesTable extends Vue {

  @Prop({ type: Array, default: () => ([{}]) }) readonly data!: IInvoicesRecord[];

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
  ]

  @Emit('open-details')
  protected openDetails<T>(data: T): T {
    return data;
  }

  protected openDetailsGuard(data: IPlainObject): void {
    if (data.isSeparateColumn) {
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
    const { totalPrice, status, issuer: { symbol } } = row || {};

    if (status === 'paid') {
      return `-${symbol}${totalPrice}`;
    }

    return `${symbol}${totalPrice}`;
  }

  protected amountClassList(row: IInvoicesRecord): string {
    const { status } = row || {};

    const statusColors: { [key: string]: string} = {
      pending: 'text-orange-main',
      rejected: 'text-red-main',
      expired: 'text-red-main',
    };

    return statusColors[status] || '';
  }

}
</script>
