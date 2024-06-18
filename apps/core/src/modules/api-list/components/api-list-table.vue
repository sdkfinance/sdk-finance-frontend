<template>
  <app-table
    :data="apiList"
    :columns="tableColumns"
    :is-loading="isLoading"
    class="api-list-table"
    is-secondary>
    <template #group_functionality="{ scope }">
      {{ scope.row.tag || scope.row.name }}
    </template>
    <template #description="{ scope }">
      <span
        v-if="scope.row.description"
        v-html="scope.row.description" />
      <span v-else>{{ emptyChar }}</span>
    </template>
  </app-table>
</template>

<script setup lang="ts">
import config from '@sdk5/shared/config';
import type { TApiRecordItem } from '@sdk5/shared/requests';
import type { ITableColumn } from '@sdk5/shared/types';
import { AppTable } from '@sdk5/ui-kit-entrance';

defineProps<{
  apiList: TApiRecordItem[];
  isLoading: boolean;
}>();
const { emptyChar } = config;
const tableColumns: ITableColumn[] = [
  {
    prop: 'group_functionality',
    label: 'table.label.group_functionality',
    width: '500px',
    noWrap: false,
    resizable: true,
    sortable: true,
  },
  {
    prop: 'number_of_APIs',
    label: 'table.label.endpoints',
    width: '110px',
    resizable: true,
    sortable: true,
  },
  {
    prop: 'description',
    label: 'table.label.description',
    noWrap: false,
    resizable: true,
    sortable: true,
  },
];
</script>

<style lang="scss">
.api-list-table {
  &.app-table.el-table {
    @apply flex flex-col;

    &,
    .el-table__body-wrapper {
      @apply h-full;
    }

    &,
    tr,
    thead,
    th.el-table__cell {
      @apply bg-gray-200;

      b {
        @apply font-bold;
      }
    }
  }
}
</style>
