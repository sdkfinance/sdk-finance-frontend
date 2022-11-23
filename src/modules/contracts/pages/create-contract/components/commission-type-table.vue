<template>
  <app-table
    is-secondary
    is-striped
    is-border-none
    is-small-font
    :data="data"
    :is-loading="isLoading"
    :columns="columns"/>
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
export default class CommissionTypeTable extends Vue {

  @Prop({ default: () => [], type: Array }) private data!: [];

  @Prop({ default: false, type: Boolean }) private isLoading!: boolean;

  public columns: ITableColumn[] = [
    {
      prop: 'type',
      label: 'table.label.commission_type',
      width: '230',
    },
    {
      prop: 'commission',
      label: 'table.label.commission',
    },
  ]

}
</script>
