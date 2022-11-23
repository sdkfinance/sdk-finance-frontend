<template>
  <app-table
    :data="data"
    is-border-none
    is-secondary
    is-medium-font
    is-vertical-top
    :columns="tableColumns">
    <template #categoryId="{ scope }">
      <app-table-info
        :image="scope.row.category.imageLink"
        :title="scope.row.category.name || scope.row.categoryId"
        :background-color="scope.row.color">
        <template #description>
          {{ scope.row.numberOfOperations }} {{ $tc('other.transactions', scope.row.numberOfOperations) }}
        </template>
      </app-table-info>
    </template>

    <template #percentage="{scope}">
      <app-progress-bar
        :bar-color="scope.row.color"
        :value="scope.row.percentage"/>
    </template>

    <template #sum="{ scope }">
      <app-table-amount :amount="`-${scope.row.currencySymbol}${scope.row.sum}`"/>
    </template>
  </app-table>
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';

import AppTable from '@/components/ui-framework/app-table.vue';
import AppProgressBar from '@/components/ui-kit/app-progress-bar.vue';
import AppTableAmount from '@/components/ui-kit/app-table/app-table-amount.vue';
import AppTableInfo from '@/components/ui-kit/app-table/app-table-info.vue';
import { IPlainObject, ITableColumn } from '@/types/interfaces';

@Component({
  components: {
    AppTable,
    AppTableInfo,
    AppTableAmount,
    AppProgressBar,
  },
})
export default class CategoryTable extends Vue {

  @Prop({ type: Array, default: () => ({}) }) readonly data!: IPlainObject[];

  protected tableColumns: ITableColumn[] = [
    {
      prop: 'categoryId',
      label: 'table.label.category',
    },
    {
      prop: 'percentage',
      label: 'table.label.part_of_all_the_spending',
      width: '260',
    },
    {
      prop: 'sum',
      label: 'table.label.amount',
      align: 'right',
      width: '200',
    },
  ]

}
</script>
