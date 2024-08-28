<template>
  <el-table
    ref="table"
    v-loading="isLoading"
    v-resize:throttle="onResize"
    :class="tableClasses"
    :data="tempTableData"
    :cell-class-name="cellClassName"
    :row-class-name="rowClassName"
    :span-method="spanMethod"
    :max-height="tableMaxHeightCurrent"
    :empty-text="emptyText || $t('table.empty_text') + ''"
    fit
    border
    v-on="$listeners"
    @selection-change="selectionChangeHandler"
    @sort-change="sortChangeHandler">
    <app-table-column
      v-for="(column, index) in visibleColumns"
      :key="'column_' + index"
      :column="column"
      :column-index="index"
      :current-sort-order="currentSortOrder"
      :table-secondary="isSecondary">
      <template #default="scope">
        <template v-if="column.prop === 'action' && !!column.actions && column.actions.length > 0">
          <app-table-actions-container
            ref="tableActionsContainers"
            :row-scope="scope"
            :table-actions="column.actions"
            :actions-always-visible="column.actionsAlwaysVisible"
            :max-visible-actions="maxVisibleActions" />
        </template>
        <slot
          v-else
          :name="column.prop"
          v-bind="{ scope, getColumnValue, column }">
          <app-tooltip :disabled="!column.withTooltip">
            <template #content>
              {{ getTranslateText(scope.row, column) }}
            </template>
            <span>{{ getTranslateText(scope.row, column) }}</span>
          </app-tooltip>
        </slot>
      </template>
    </app-table-column>
  </el-table>
</template>

<script setup lang="ts">
import config from '@sdk5/shared/config';
import { useI18n } from '@sdk5/shared/i18n';
import type { IPlainObject, ITableColumn } from '@sdk5/shared/types';
import type { TDateType } from '@sdk5/shared/utils';
import { checkMobile, getDefaultDate, getDisplayAmount, getProp } from '@sdk5/shared/utils';
import { useCloned, useEventListener, useMutationObserver } from '@vueuse/core';
import classNames from 'classnames';
import { Table as ElTable } from 'element-ui';
import type { DefaultSortOptions } from 'element-ui/types/table';
import { cloneDeep } from 'lodash';
import type { Ref } from 'vue';
import { computed, nextTick, onMounted, ref, shallowRef, watch } from 'vue';

import type { AppTableSortOrder } from '../app-table-column';
import { AppTableColumn } from '../app-table-column';
import { AppTooltip } from '../app-tooltip';
import AppTableActionsContainer from './app-table-actions-container.vue';
import { APP_TABLE_SIZE, DEFAULT_ROW_HEIGHT, MAX_ROWS_COUNT, TABLE_CELL_PADDING, TABLE_SCROLLBAR_HEIGHT, TABLE_SIZE } from './constants';
import type { TAppTableSize } from './types';

type TableDefaultSortOptions = Pick<DefaultSortOptions, 'prop'> & { order: AppTableSortOrder };

const props = withDefaults(
  defineProps<{
    data?: any[];
    columns?: ITableColumn[];
    emptyText?: string;
    isLoading?: boolean;
    cellClassName?: ((...args: any[]) => string) | string;
    rowClassName?: ((...args: any[]) => string) | string;
    spanMethod?: (...args: any[]) => [number, number];
    isBorderNone?: boolean;
    isLightHead?: boolean;
    isLargeFont?: boolean;
    isMediumFont?: boolean;
    isSmallFont?: boolean;
    isSecondary?: boolean;
    isVerticalTop?: boolean;
    isStriped?: boolean;
    virtualScrollEnabled?: boolean;
    tableMaxHeight?: string | number;
    tableSize?: TAppTableSize;
    maxVisibleActions?: number;
  }>(),
  {
    data: () => [],
    columns: () => [],
    emptyText: '',
    isLoading: false,
    cellClassName: '',
    rowClassName: '',
    spanMethod: () => [1, 1] as [number, number],
    isBorderNone: false,
    isLightHead: false,
    isLargeFont: false,
    isMediumFont: false,
    isSmallFont: false,
    isSecondary: false,
    isVerticalTop: false,
    isStriped: false,
    virtualScrollEnabled: false,
    tableSize: APP_TABLE_SIZE.medium,
    tableMaxHeight: undefined,
    maxVisibleActions: undefined,
  },
);
const emit = defineEmits<{
  (event: 'selection-change', payload: any[]): void;
}>();

const { t } = useI18n();

const { cloned: columnsCopy } = useCloned(() => props.columns, { clone: cloneDeep, immediate: true, deep: true });

const tableActionsContainers = shallowRef([]) as unknown as Ref<InstanceType<typeof AppTableActionsContainer>[]>;
const table = ref(null) as unknown as Ref<
  InstanceType<typeof ElTable> & {
    layout: {
      gutterWidth: number;
    };
  }
>;
const tableBodyWrapper = shallowRef(null) as Ref<HTMLElement | null>;
const colWidths = ref<(string | null)[]>([]);
const colNames = ref<(string | null)[]>([]);
const tempTableData = ref<any[]>([]);
const virtualStart = ref(0);
const isMobile = ref(false);
const currentSortOrder = ref<AppTableSortOrder>(null);
const headerHeight = ref(0);

const virtualEnd = computed(() => virtualStart.value + MAX_ROWS_COUNT + 5);

const tableClasses = computed(() =>
  classNames('app-table', 'app-table--front-office', `app-table--${props.tableSize}`, [
    { 'is-large-font': props.isLargeFont },
    { 'is-border-none': props.isBorderNone },
    { 'is-light-head': props.isLightHead },
    { 'is-medium-font': props.isMediumFont },
    { 'is-small-font': props.isSmallFont },
    { 'is-secondary': props.isSecondary },
    { 'is-vertical-top': props.isVerticalTop },
    { 'is-striped': props.isSecondary ? true : props.isStriped },
    { 'is-virtual-scroll': props.virtualScrollEnabled },
  ]),
);

const visibleColumns = computed<ITableColumn[]>(() =>
  columnsCopy.value.filter((column) => !column.isHide && !(isMobile.value && column.hideOnMobile)),
);

const rowHeight = computed(() => {
  if (!props.tableSize) {
    return DEFAULT_ROW_HEIGHT;
  }

  return TABLE_SIZE[props.tableSize];
});

const tableMaxHeightCurrent = computed(() =>
  props.virtualScrollEnabled ? `${rowHeight.value * MAX_ROWS_COUNT + TABLE_SCROLLBAR_HEIGHT + headerHeight.value}` : props.tableMaxHeight,
);

const doLayout = () => {
  table.value?.doLayout();
};

const setWidth = () => {
  if (!table.value) {
    return;
  }

  const tableCells = table.value.$el.querySelectorAll('.el-table__cell');

  if (tableCells.length === 0) {
    return;
  }

  Array.from(colWidths.value.entries()).forEach(([index, width]) => {
    tableCells.forEach((cell) => {
      if (cell.classList.contains(`${colNames.value[index]}`)) {
        (cell as HTMLElement).style.width = `${width}px`;
        (cell as HTMLElement).style.maxWidth = `${width}px`;
      }
    });
  });
};

const handleResize = () => {
  if (!table.value) {
    return;
  }

  const tableHeaderElement = table.value.$el.querySelector('.el-table__header-wrapper');

  if (tableHeaderElement) {
    headerHeight.value = tableHeaderElement.clientHeight;
  }

  colNames.value = [];
  colWidths.value = [];
  const cols = table.value.$el.querySelectorAll('.el-table__body colgroup col');
  cols.forEach((col) => {
    colNames.value.push(col.getAttribute('name'));
    colWidths.value.push(col.getAttribute('width'));
  });
};

const onResize = () => {
  isMobile.value = checkMobile();
  handleResize();
};

const getColumnValue = (obj: IPlainObject, key: string, type: string = 'string', emptyValue: string = config.emptyChar): unknown => {
  const value = getProp(obj, key, emptyValue);

  if (['date', 'time', 'datetime'].includes(type)) {
    return getDefaultDate(value, type as TDateType);
  }

  if (type === 'displayAmount') {
    return getDisplayAmount(value, type);
  }

  if (type === 'percent') {
    return `${value}%`;
  }

  return value;
};

const setRows = (tableData: any[]) => {
  if (!table.value) {
    return;
  }

  const tableRows = Array.from(table.value.$el.querySelectorAll('.el-table__body-wrapper .el-table__row'));
  const fixedTableRows = Array.from(table.value.$el.querySelectorAll('.el-table__fixed .el-table__row'));
  const fixedRightTableRows = Array.from(table.value.$el.querySelectorAll('.el-table__fixed-right .el-table__row'));

  Array.from(tableData.entries()).forEach(([index]) => {
    const tableRowByIndex = tableRows.at(index) as HTMLElement | undefined;
    const tableFixedRowByIndex = fixedTableRows.at(index) as HTMLElement | undefined;
    const tableRightFixedRowByIndex = fixedRightTableRows.at(index) as HTMLElement | undefined;

    [tableRowByIndex, tableFixedRowByIndex, tableRightFixedRowByIndex].forEach((rowElement) => {
      if (rowElement) {
        rowElement.style.top = `${(index + virtualStart.value) * rowHeight.value}px`;
        rowElement.style.height = `${rowHeight.value}px`;
      }
    });
  });
};

const sortChangeHandler = (data: { column: any } & TableDefaultSortOptions) => {
  const { order } = data;
  currentSortOrder.value = order;
};

const setTBodyHeight = (tableDataLength: number) => {
  if (!table.value) {
    return;
  }

  table.value.$el.querySelectorAll('tbody').forEach((tbodyElement) => {
    tbodyElement.style.height = `${rowHeight.value * (tableDataLength || MAX_ROWS_COUNT)}px`;
  });
};

const virtualScrollTableScrollHandler = (event: Event) => {
  const eventTarget = event.target as HTMLElement;

  const start = Math.floor(eventTarget.scrollTop / rowHeight.value);

  if (start === virtualStart.value) {
    return;
  }

  virtualStart.value = start;

  tempTableData.value = props.data.slice(virtualStart.value, virtualEnd.value);
};

const setActionsContainerWidth = async () => {
  if (tableActionsContainers.value.length === 0) {
    return;
  }

  const maxContainerWidth = Math.max(...tableActionsContainers.value.map((container) => container?.$el.clientWidth));

  if (Number.isNaN(maxContainerWidth)) {
    return;
  }

  const calcWidth = maxContainerWidth + TABLE_CELL_PADDING * 2;

  columnsCopy.value = columnsCopy.value.map((column) => {
    if (column.prop === 'action') {
      return {
        ...column,
        width: `${calcWidth}px`,
      };
    }

    return column;
  });
};

const selectionChangeHandler = (selection: any[]) => {
  emit('selection-change', selection);
};

const getTranslateText = (data: IPlainObject, column: ITableColumn) => {
  if (column.localePrefix) {
    return t(`${column.localePrefix}.${getColumnValue(data, column.prop, column.type)}`);
  }

  return getColumnValue(data, column.prop, column.type);
};

watch(colWidths, () => {
  if (props.virtualScrollEnabled) {
    setWidth();
  }
});
watch(
  () => props.data,
  (tableData) => {
    if (!props.virtualScrollEnabled) {
      tempTableData.value = tableData;
      return;
    }

    setTBodyHeight(tableData.length);
    tempTableData.value = tableData.slice(virtualStart.value, virtualEnd.value);
  },
  { immediate: true },
);
watch(
  tempTableData,
  (tableData) => {
    if (!props.virtualScrollEnabled) {
      return;
    }

    setRows(tableData);
  },
  { immediate: true },
);

onMounted(() => {
  if (!table.value) {
    return;
  }

  table.value.layout.gutterWidth = TABLE_SCROLLBAR_HEIGHT;

  doLayout();

  nextTick(() => {
    onResize();
  });

  tableBodyWrapper.value = table.value.$refs.bodyWrapper as HTMLElement;

  if (!tableBodyWrapper.value) {
    return;
  }

  if (props.virtualScrollEnabled) {
    useEventListener(tableBodyWrapper.value, 'scroll', virtualScrollTableScrollHandler);
  }

  useMutationObserver(
    tableBodyWrapper.value,
    () => {
      setActionsContainerWidth();

      if (props.virtualScrollEnabled) {
        handleResize();
        setTBodyHeight(props.data.length);
        setRows(tempTableData.value);
      }
    },
    {
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['width'],
    },
  );
});

defineExpose({
  doLayout,
});
</script>

<style lang="scss">
.app-table--front-office {
  @apply w-full;

  &.el-table {
    &:not(.is-secondary) {
      .el-table__header thead .el-table__cell .cell {
        @apply flex items-center;
      }
    }

    &--border {
      @apply border-none after:hidden;

      .el-table__cell {
        @apply border-r-0;
      }
    }

    .cell {
      @apply break-normal;
    }

    .el-table__body {
      &-wrapper {
        @apply overflow-y-auto;

        tbody {
          @apply relative;
        }
      }
    }
  }

  .caret-wrapper {
    .sort-caret {
      .ascending {
        border: none;
        top: 100px;
      }
    }
  }

  th.is-leaf,
  th,
  td {
    color: #000;
    font-size: 12px;
    border-bottom: 2px solid $border-color;
    padding: 18px 0;
  }

  &.is-virtual-scroll {
    .el-table__body-wrapper,
    .el-table__fixed-body-wrapper {
      .el-table__body {
        .el-table__row {
          @apply absolute #{!important};
        }
      }
    }
  }

  &.is-border-none {
    th.is-leaf,
    th,
    td {
      border-bottom: none;
    }
  }

  &.is-large-font {
    th.is-leaf,
    th,
    td {
      font-size: 16px;
    }
  }

  &.is-light-head {
    th.is-leaf,
    th {
      color: #999;
      font-weight: 500;
    }
  }

  &.is-medium-font {
    th {
      font-size: 16px;
    }

    td {
      font-weight: normal;
      font-size: 14px;
    }
  }

  &.is-small-font {
    th {
      font-size: 12px !important;
    }

    td {
      font-weight: normal;
      font-size: 12px;
    }
  }

  &.app-table--medium {
    &.is-secondary {
      .el-table__body {
        tr.el-table__row {
          td.el-table__cell {
            @apply h-[2.25rem];
          }
        }
      }
    }
  }

  &.app-table--large {
    &.app-table.is-secondary {
      .el-table__body {
        tr.el-table__row {
          td.el-table__cell {
            @apply h-[3.125rem];
          }
        }
      }
    }
  }

  &.app-table--big {
    &.is-secondary {
      .el-table__body {
        tr.el-table__row {
          td.el-table__cell {
            @apply h-[3.75rem];
          }
        }
      }
    }
  }

  &.is-secondary {
    &.el-table .sort-caret.ascending {
      position: absolute;
      top: 6px;
      content: '';
      right: 0;
      width: 10px;
      height: 6px;
      background-image: url('../../assets/icons/ascending.svg');
    }

    &.el-table .descending .sort-caret.descending,
    &.el-table .ascending .sort-caret.ascending {
      filter: brightness(0.5) sepia(9) hue-rotate(-171deg) saturate(20);
    }

    &.el-table .sort-caret.descending {
      position: absolute;
      top: 20px;
      content: '';
      right: 0;
      width: 10px;
      height: 6px;
      background-image: url('../../assets/icons/descending.svg');
    }

    .el-table__column-resize-proxy {
      @apply border-dashed border-blue-400 flex flex-col items-center;
      @apply after:relative after:-left-[1px] after:bg-no-repeat after:w-[0.875rem] after:h-[1.5rem] after:bg-gray-100;

      &::after {
        background-image: url('../../assets/icons/resize-proxy-icon.svg');
        background-size: 14px 20px;
      }
    }

    .el-table__body-wrapper {
      &::-webkit-scrollbar {
        @apply w-[6px] h-[6px];
      }

      &::-webkit-scrollbar-thumb {
        @apply bg-blue-600 hover:bg-opacity-75 transition-colors rounded-20;
      }
    }

    .el-table__body-wrapper.is-scrolling-left ~ .el-table__fixed,
    .el-table__body-wrapper.is-scrolling-right ~ .el-table__fixed-right,
    .el-table__body-wrapper.is-scrolling-none ~ .el-table__fixed,
    .el-table__body-wrapper.is-scrolling-none ~ .el-table__fixed-right {
      @apply shadow-none #{!important};
      @apply before:hidden;
    }

    .el-table__fixed {
      @apply before:right-0 before:left-[unset];

      &,
      &-right {
        @apply before:top-0 before:w-[4px] before:h-full before:opacity-[0.8] shadow-none;

        &::before {
          background: linear-gradient(90deg, #e3eeff 0%, rgb(227 238 255 / 0%) 100%);
        }
      }

      &-right {
        @apply min-w-[80px] #{!important};
        @apply before:left-0 before:-scale-x-100 before:scale-y-100 bg-white;
      }
    }

    .el-table__header,
    .el-table__body {
      tr.el-table__row {
        @apply relative;
      }
    }

    .el-table__header th.el-table__cell,
    .el-table__body tr.el-table__row td.el-table__cell .cell {
      @apply text-sm font-normal text-gray-500 p-0;
    }

    .el-table__header th.el-table__cell,
    .el-table__body tr.el-table__row td.el-table__cell {
      &.cell--selection {
        @apply pl-[0.75rem] pr-0;

        &,
        .cell {
          @apply flex items-center;
        }

        .cell {
          @apply p-0 after:hidden;
        }
      }
    }

    .el-table__header {
      th.el-table__cell {
        @apply font-medium text-sm leading-[1.125rem] text-blue-600 pb-[1.06rem] border-b-0 align-middle;

        &.is-sortable {
          &.descending,
          &.ascending {
            @apply text-gray-500;
          }

          &.descending,
          &.ascending,
          &:hover {
            .cell .app-table__header-cell .icon {
              @apply opacity-100;
            }
          }

          .cell .app-table__header-cell {
            @apply flex items-center gap-x-[0.375rem];

            .icon {
              @apply w-[0.875rem] h-[0.875rem] opacity-0 transition-all;

              &::before {
                @apply text-[0.875rem] leading-[1];
              }
            }
          }
        }

        &:has(+ .cell--action),
        &:nth-last-of-type(2),
        &:last-of-type {
          .cell {
            @apply after:hidden;
          }
        }

        &:first-of-type {
          .cell {
            @apply after:left-[unset] after:right-[0.125rem];
          }
        }

        .cell {
          @apply relative whitespace-nowrap min-h-[1.25rem];
          @apply after:absolute after:right-[0.125rem] after:top-1/2 after:-translate-y-1/2 after:w-[0.0625rem] after:h-0 after:bg-blue-400;

          .caret-wrapper {
            @apply hidden;
          }
        }

        @media screen and (max-width: 599px) {
          @apply text-[0.75rem];
        }
      }
    }

    .el-table__body {
      tr.el-table__row {
        td.el-table__cell {
          @apply py-[0.25rem] px-[0.75rem] border-b-0 overflow-hidden;
          @apply first-of-type:rounded-tl-[0.5rem] first-of-type:rounded-bl-[0.5rem];
          @apply last-of-type:rounded-tr-[0.5rem] last-of-type:rounded-br-[0.5rem];

          &:not(.cell--action) {
            &.cell--no-wrap {
              .cell {
                &,
                & span {
                  @apply overflow-hidden whitespace-nowrap text-ellipsis;
                }

                & > span.app-tooltip {
                  @apply block;
                }
              }
            }
          }

          &.cell--action {
            .cell {
              @apply flex justify-end;
            }
          }

          .badge {
            @apply p-0;
          }
        }
      }
    }

    &.el-table .el-table__body tr.hover-row > td.el-table__cell,
    &.el-table .el-table__body tr.hover-row.current-row > td.el-table__cell,
    &.el-table .el-table__body tr.hover-row.selection-row > td.el-table__cell,
    &.el-table .el-table__body tr.hover-row.el-table__row--striped > td.el-table__cell,
    &.el-table .el-table__body tr.hover-row.el-table__row--striped.current-row > td.el-table__cell,
    &.el-table .el-table__body tr.hover-row.el-table__row--striped.selection-row > td.el-table__cell {
      @apply bg-[#FFF9E5];
    }

    &.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
      @apply bg-[#FFF9E5];
    }

    td.is-separate {
      font-size: 14px;
      color: $blue-500;
      background-color: #fff !important;

      @media screen and (max-width: 599px) {
        font-size: 12px;
      }
    }

    &::before {
      height: 0;
    }
  }

  &.is-vertical-top td {
    vertical-align: top;
  }

  &.is-striped .el-table__row:nth-child(even) {
    .el-table__cell {
      @apply bg-[#F9FCFE];
    }
  }

  .v-align-top {
    vertical-align: top;
  }

  .table-actions {
    @apply flex flex-col gap-y-8;

    .app-button {
      display: block;
      min-width: 100%;
      margin-left: 0;

      & + .app-button {
        margin-left: 0;
      }
    }
  }

  .el-table__body {
    .table-status {
      color: #9aa6b8;
      font-weight: 500;
      text-transform: capitalize;
    }
  }
}
</style>
