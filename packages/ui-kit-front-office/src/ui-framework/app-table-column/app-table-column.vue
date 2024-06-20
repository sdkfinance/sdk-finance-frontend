<template>
  <el-table-column
    :prop="column.prop"
    :label="tableColumnLabelProp"
    :min-width="column['min-width']"
    :fixed="tableColumnFixedProp"
    :class-name="tableColumnClassname"
    :sortable="column.sortable"
    :align="tableColumnAlignProp"
    :resizable="tableColumnResizableProp"
    :width="tableColumnWithProp">
    <template #default="scope">
      <slot v-bind="scope" />
    </template>
    <template #header="{ column: columnScoped }">
      <span class="app-table__header-cell">
        {{ columnScoped.label }}
        <template v-if="columnScoped.sortable">
          <i :class="['icon', sortingIcon]" />
        </template>
      </span>
    </template>
  </el-table-column>
</template>

<script lang="ts">
import type { ITableColumn } from '@sdk5/shared/types';
import { TableColumn } from 'element-ui';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { AppTableSortOrder } from './types';

export default defineComponent({
  name: 'AppTableColumn',
  components: {
    [TableColumn.name]: TableColumn,
  },
  props: {
    column: {
      type: Object as PropType<ITableColumn>,
      required: true,
    },
    currentSortOrder: {
      type: String as PropType<AppTableSortOrder>,
      default: null,
    },
  },
  computed: {
    tableColumnLabelProp(): string {
      return this.column.label ? `${this.$t(this.column.label)}` : '';
    },
    tableColumnAlignProp(): TableColumn['align'] {
      return this.column.align ?? 'left';
    },
    tableColumnResizableProp(): TableColumn['resizable'] {
      return this.column.resizable ?? false;
    },
    tableColumnWithProp(): string | undefined {
      return this.column.width;
    },
    tableColumnFixedProp(): TableColumn['fixed'] {
      if (typeof this.column.fixed === 'boolean') {
        return 'left';
      }

      if (this.column.prop === 'action') {
        return 'right';
      }

      return this.column.fixed ?? false;
    },
    tableColumnClassname(): TableColumn['className'] {
      let className = '';

      if (this.column.className) {
        className += ` ${this.column.className}`;
      }

      if ((this.column.actions && this.column.actions?.length > 0) || this.column.prop === 'action') {
        className += ' cell--action';
      }

      return className;
    },
    sortingIcon() {
      if (!this.currentSortOrder) {
        return 'icon-table-sort-desc';
      }

      return `icon-table-sort-${this.currentSortOrder === 'descending' ? 'desc' : 'asc'}`;
    },
  },
});
</script>
