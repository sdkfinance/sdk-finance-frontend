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
        :category-name="row.categoryName"
        :status="row.status"/>
    </template>

    <template #description="{ scope: { row } }">
      <span v-if="row.type">
        {{ row.description }}
      </span>
    </template>

    <template #amount="{ scope: { row } }">
      <app-table-amount
        v-if="row.type"
        :amount="row.amountString"/>
    </template>
  </app-table>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';
import AppTable from '@/components/ui-framework/app-table.vue';
import { IPlainObject, ITableColumn } from '@/types/interfaces';
import AppTableInfo from '@/components/ui-kit/app-table/app-table-info.vue';
import AppTableAmount from '@/components/ui-kit/app-table/app-table-amount.vue';
import {
  getSeparatorColumnClass,
  getSeparatorSpan,
  addSeparator,
} from '@/modules/user-dashboard/utils/tableUtils';

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
export default class TransactionsTable extends Vue {

  @Prop({ type: Array, default: () => ([{}]) }) readonly data!: IPlainObject[];

  @Emit('open-details')
  protected openDetails<T>(data: T): T {
    return data;
  }

  protected tableColumns: ITableColumn[] = [
    {
      prop: 'type',
      label: 'table.label.description',
    },
    {
      prop: 'description',
      label: 'table.label.payment_reason',
      hideOnMobile: true,
    },
    {
      prop: 'amount',
      label: 'table.label.amount',
      align: 'right',
      width: '100',
    },
  ]

  protected openDetailsGuard(data: IPlainObject): IPlainObject | void {
    if (data.isSeparateColumn) {
      return;
    }
    this.openDetails(data);
  }

  protected get records(): IPlainObject[] {
    return this.data.reduce(addSeparator, []);
  }

}
</script>
