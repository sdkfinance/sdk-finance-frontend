<template>
  <app-table
    class="gold-rates-table"
    :data="mappedTableData"
    :columns="GOLD_RATES_TABLE_COLUMNS"
    table-size="large"
    is-secondary>
    <template #pair="{ scope }">
      <pair-cell :rate-record="scope.row" />
    </template>
    <template #buy="{ scope }">
      <rate-cell :amount="scope.row.buyRate" />
    </template>
    <template #sell="{ scope }">
      <rate-cell :amount="scope.row.sellRate" />
    </template>
  </app-table>
</template>

<script setup lang="ts">
import { AppTable } from '@sdk5/ui-kit-front-office';
import { computed } from 'vue';

import { GOLD_RATES_TABLE_COLUMNS } from '../constants/table-columns';
import type { TGoldRatesTableData } from '../types/gold-rates-table.types';
import PairCell from './gold-rates-table-pair-cell.vue';
import RateCell from './gold-rates-table-rate-cell.vue';

const props = defineProps<{
  tableData: TGoldRatesTableData[];
}>();

const mappedTableData = computed(() =>
  props.tableData.map((item) => {
    return {
      ...item,
      pair: `${item.inCurrency.code}/${item.outCurrency.code}`,
    };
  }),
);
</script>

<style lang="scss">
.gold-rates-table.app-table--front-office.el-table {
  .el-table__header th.el-table__cell .cell::after {
    opacity: 0;
  }
}
</style>
