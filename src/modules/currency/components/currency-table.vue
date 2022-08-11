<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    is-secondary
    is-striped
    is-border-none
    is-small-font
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
export default class CurrencyTable extends Vue {

  @Prop({ default: '', type: Array }) private data!: [];

  @Prop({ default: false, type: Boolean }) private isLoading!: boolean;

  public columns: ITableColumn[] = [
    {
      prop: 'name',
      label: 'table.label.name',
      width: '200px',
    },
    {
      prop: 'code',
      label: 'table.label.code',
      width: '100px',
    },
    {
      prop: 'digitalCode',
      label: 'table.label.digital_code',
      width: '100px',
    },
    {
      prop: 'symbol',
      label: 'table.label.symbol',
      width: '100px',
    },
    {
      prop: 'description',
      label: 'table.label.description',
    },
  ]

}
</script>
