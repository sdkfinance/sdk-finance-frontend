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
        :status="row.status" />
    </template>

    <template #description="{ scope: { row } }">
      <span v-if="row.type">
        {{ row.description }}
      </span>
    </template>

    <template #amount="{ scope: { row } }">
      <app-table-amount
        v-if="row.type"
        :amount="row.totalAmountString"
        :transaction-record="row" />
    </template>
  </app-table>
</template>

<script setup lang="ts">
import type { ITransactionRecordComputed } from '@sdk5/shared/requests';
import type { ITableColumn } from '@sdk5/shared/types';
import { AppTable, AppTableAmount, AppTableInfo } from '@sdk5/ui-kit-front-office';
import { computed } from 'vue';

import type { TSeparateTableItems } from '../utils/tableUtils';
import { addSeparator, getSeparatorColumnClass, getSeparatorSpan } from '../utils/tableUtils';

const props = withDefaults(
  defineProps<{
    data?: ITransactionRecordComputed[];
  }>(),
  {
    data: () => [],
  },
);
const emit = defineEmits<{
  (event: 'open-details', payload: ITransactionRecordComputed): void;
}>();

const tableColumns: ITableColumn[] = [
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
    width: '160',
  },
];

const records = computed(() => props.data.reduce(addSeparator, [] as TSeparateTableItems<ITransactionRecordComputed>));

const openDetails = (data: ITransactionRecordComputed) => emit('open-details', data);
const openDetailsGuard = (data: unknown) => {
  if ((data as any).isSeparateColumn) {
    return;
  }

  openDetails(data as ITransactionRecordComputed);
};
</script>
