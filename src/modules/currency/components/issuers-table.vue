<template>
  <app-table
    :data="data"
    is-secondary
    is-striped
    is-border-none
    is-small-font
    :is-loading="isLoading"
    :columns="columns">
    <template #active="{scope}">
      <app-badge
        :status="scope.row.active? 'active': 'inactive'"
        is-borderless
        is-background-transparent/>
    </template>
  </app-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppTable from '@/components/ui-framework/app-table.vue';
import { ITableColumn } from '@/types/interfaces';
import AppBadge from '@/components/ui-kit/app-badge.vue';

@Component({
  components: {
    AppBadge,
    AppTable,
  },
})
export default class IssuersTable extends Vue {

  @Prop({ default: '', type: Array }) private data!: [];

  @Prop({ default: false, type: Boolean }) private isLoading!: boolean;

  public columns: ITableColumn[] = [
    {
      prop: 'name',
      label: 'table.label.name',
    },
    {
      prop: 'currency.name',
      label: 'table.label.currency_name',
    },
    {
      prop: 'sn',
      label: 'table.label.sn_prefix',
    },
    {
      prop: 'active',
      label: 'table.label.status',
    },
    {
      prop: 'id',
      label: 'table.label.id',
      width: '270px',
    },
  ]

}
</script>
