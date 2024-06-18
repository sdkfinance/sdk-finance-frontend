<template>
  <div class="base-table">
    <div class="base-table__top">
      <div class="base-table__filters">
        <slot name="filters" />
      </div>
      <div class="base-table__actions">
        <slot name="actions" />
      </div>
    </div>
    <app-table
      is-secondary
      :data="tableData"
      :table-size="APP_TABLE_SIZE.big"
      :columns="tableColumns"
      :table-max-height="tableMaxHeight">
      <template
        v-for="column in tableColumns"
        #[column.prop]="{ scope }">
        <slot
          :name="column.prop"
          v-bind="scope" />
      </template>
    </app-table>
  </div>
</template>

<script lang="ts">
import type { ITableColumn } from '@sdk5/shared/types';
import { APP_TABLE_SIZE, AppTable } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

const COMPONENTS = {
  AppTable,
} as const;

@Component({
  name: 'base-table-with-filters',
  components: COMPONENTS,
})
export default class BaseTableWithFilters extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ type: Array as PropType<any[]>, required: true }) readonly tableData!: any[];

  @Prop({ type: Array as PropType<ITableColumn[]>, required: true }) readonly tableColumns!: ITableColumn[];

  @Prop({ type: [String, Number], default: 280 }) readonly tableMaxHeight!: string | number;

  $props!: {
    tableData: any[];
    tableColumns: ITableColumn[];
    tableMaxHeight?: string | number;
  };

  protected readonly APP_TABLE_SIZE = APP_TABLE_SIZE;
}
</script>

<style lang="scss">
.base-table {
  &__top {
    @apply flex items-end justify-between mb-[1.5rem];
  }

  &__filters,
  &__actions {
    @apply flex items-end gap-x-[0.5rem];
  }
}
</style>
