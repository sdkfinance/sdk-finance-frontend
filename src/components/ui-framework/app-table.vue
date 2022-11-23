<template>
  <el-table
    ref="table"
    v-loading="isLoading"
    v-resize:throttle="onResize"
    :class="tableClasses"
    :data="data"
    :cell-class-name="cellClassName"
    :row-class-name="rowClassName"
    :span-method="spanMethod"
    :empty-text="emptyText || $t('table.empty_text')"
    v-on="$listeners">
    <el-table-column
      v-for="(column, i) in columnList"
      :key="'column_' + i"
      :prop="column.prop"
      :label="$t(column.label)"
      :min-width="column.minWidth"
      :fixed="column.fixed"
      :class-name="column.className"
      :sortable="column.sortable"
      :align="column.align"
      :width="column.width">
      <template slot-scope="scope">
        <slot
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
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { Table, TableColumn } from 'element-ui';
import {
  Component, Prop, Ref, Vue,
} from 'vue-property-decorator';

import AppTooltip from '@/components/ui-framework/app-tooltip.vue';
import config from '@/config';
import { IPlainObject, ITableColumn } from '@/types/interfaces';
import {
  checkMobile, getDefaultDate, getDisplayAmount,
  getProp,
} from '@/utils';
import { TDateType } from '@/utils/getDefaultDate';

@Component({
  components: {
    AppTooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
})
export default class AppTable extends Vue {

  @Ref('table') readonly table!: Table;

  @Prop({ default: () => ([]), type: Array }) readonly data!: [];

  @Prop({ default: () => ([]), type: Array }) readonly columns!: ITableColumn[];

  @Prop({ default: '', type: String }) readonly emptyText!: string;

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  @Prop({ default: '', type: [Function, String] }) readonly cellClassName!: string | object;

  @Prop({ default: '', type: [Function, String] }) readonly rowClassName!: string | object;

  @Prop({ default: () => [1, 1], type: Function }) readonly spanMethod!: Function;

  @Prop({ default: false, type: Boolean }) readonly isBorderNone!: boolean;

  @Prop({ default: false, type: Boolean }) readonly isLightHead!: boolean;

  @Prop({ default: false, type: Boolean }) readonly isLargeFont!: boolean;

  @Prop({ default: false, type: Boolean }) readonly isMediumFont!: boolean;

  @Prop({ default: false, type: Boolean }) readonly isSmallFont!: boolean;

  @Prop({ default: false, type: Boolean }) readonly isSecondary!: boolean;

  @Prop({ default: false, type: Boolean }) readonly isVerticalTop!: boolean;

  @Prop({ default: false, type: Boolean }) readonly isStriped!: boolean;

  readonly emptyChar: string = config.emptyChar;

  protected isMobile: boolean = false;

  protected get tableClasses() {
    return [
      'app-table',
      { 'is-large-font': this.isLargeFont },
      { 'is-border-none': this.isBorderNone },
      { 'is-light-head': this.isLightHead },
      { 'is-medium-font': this.isMediumFont },
      { 'is-small-font': this.isSmallFont },
      { 'is-secondary': this.isSecondary },
      { 'is-vertical-top': this.isVerticalTop },
      { 'is-striped': this.isStriped },
    ];
  }

  protected get columnList(): Array<ITableColumn> {
    return this.columns.filter((column) => !column.isHide && (!(this.isMobile && column.hideOnMobile)));
  }

  protected onResize(): void {
    this.isMobile = checkMobile();
  }

  protected getTranslateText(data: IPlainObject, column: ITableColumn): unknown {
    if (column.localePrefix) {
      return this.$t(`${column.localePrefix}.${this.getColumnValue(data, column.prop, column.type)}`);
    }
    return this.getColumnValue(data, column.prop, column.type);
  }

  protected getColumnValue(
    obj: IPlainObject,
    key: string,
    type: string = 'string',
    emptyValue: string = this.emptyChar,
  ): unknown {
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

  }

  protected created(): void {
    this.onResize();
  }

  public doLayout(): void {
    this.table.doLayout();
  }

}
</script>

<style lang="scss">
.el-table .sort-caret.ascending,
.el-table .sort-caret.descending {
  border: none;
  position: relative;
}

.el-table .sort-caret.ascending {
  position: absolute;
  top: 6px;
  content: "";
  right: 0;
  width: 10px;
  height: 6px;
  background-image: url("~@/assets/icons/ascending.svg");
}

.el-table .descending .sort-caret.descending,
.el-table .ascending .sort-caret.ascending {
  filter: brightness(0.5) sepia(9) hue-rotate(-171deg) saturate(20);
}

.el-table .sort-caret.descending {
  position: absolute;
  top: 20px;
  content: "";
  right: 0;
  width: 10px;
  height: 6px;
  background-image: url("~@/assets/icons/descending.svg");
}

.el-table .cell {
  word-break: normal;
}

.app-table {
  width: 100%;

  .caret-wrapper {
    .sort-caret {
      .ascending {
        border: none;
        top: 100px;
      }
    }
  }

  th.el-table__cell {
    vertical-align: top;
  }

  th.is-leaf,
  th,
  td {
    color: #000;
    font-size: 12px;
    border-bottom: 2px solid $border-color;
    padding: 18px 0;
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

  &.is-secondary {
    th {
      font-size: 14px;
      color: $blue-500;
      font-weight: 400;
      padding-bottom: 16px;

      @media screen and (max-width: 599px) {
        font-size: 12px;
      }
    }

    tr {
      &:hover td {
        background-color: $grey-200;
      }

      td:first-of-type {
        padding-left: 2px;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
      }

      td:last-of-type {
        padding-right: 2px;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }
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

  &.is-striped .el-table__row:nth-child(odd) {
    @apply bg-gray-350;
  }

  .v-align-top {
    vertical-align: top;
  }

  .table-actions {
    .btn {
      display: block;
      min-width: 100%;
      margin-left: 0;
      margin-bottom: 8px;

      & + .btn {
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
