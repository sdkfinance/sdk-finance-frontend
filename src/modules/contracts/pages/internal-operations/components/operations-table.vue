<template>
  <app-table
    is-secondary
    is-striped
    is-border-none
    is-small-font
    :data="data"
    :is-loading="isLoading"
    :columns="columns">
    <template #type="{scope}">
      <div class="flex items-center">
        <div class="w-8 h-8 rounded-full bg-green-main mr-4"/>
        {{ $t(`entity.transaction.type.${scope.row.processType}`) }}
      </div>
    </template>
  </app-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppTable from '@/components/ui-framework/app-table.vue';
import { ITableColumn } from '@/types/interfaces';

@Component({
  components: {
    AppTable,
  },
})
export default class OperationsTable extends Vue {

  @Prop({ default: () => [], type: Array }) private data!: [];

  @Prop({ default: false, type: Boolean }) private isLoading!: boolean;

  public columns: ITableColumn[] = [
    {
      prop: 'type',
      label: 'table.label.type_of_the_internal_operations',
      sortable: true,
    },
  ]

}
</script>
