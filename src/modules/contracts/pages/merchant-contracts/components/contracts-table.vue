<template>
  <app-table
    is-secondary
    is-striped
    is-border-none
    is-small-font
    :data="data"
    :is-loading="isLoading"
    :columns="columns">
    <template #status="{scope}">
      <app-badge
        is-borderless
        is-background-transparent
        :status="scope.row.status"/>
    </template>
    <template
      #action>
      <div class="table-actions">
        <app-button
          size="mini">
          {{ $t('action.details') }}
        </app-button>
      </div>
    </template>
  </app-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppTable from '@/components/ui-framework/app-table.vue';
import { ITableColumn } from '@/types/interfaces';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppBadge from '@/components/ui-kit/app-badge.vue';

@Component({
  components: {
    AppBadge,
    AppTable,
    AppButton,
  },
})
export default class ContractsTable extends Vue {

  @Prop({ default: () => [], type: Array }) private data!: [];

  @Prop({ default: false, type: Boolean }) private isLoading!: boolean;

  public columns: ITableColumn[] = [
    {
      prop: 'name',
      label: 'table.label.name',
      sortable: true,
    },
    {
      prop: 'income',
      label: 'table.label.income',
      sortable: true,
      width: '110px',
    },
    {
      prop: 'numberOfUsers',
      label: 'table.label.number_of_users',
      sortable: true,
      width: '150px',
    },
    {
      prop: 'date',
      label: 'table.label.start_date',
      type: 'date',
      sortable: true,
      width: '110px',
    },
    {
      prop: 'status',
      label: 'table.label.status',
      sortable: true,
      width: '90px',
    },
    {
      prop: 'action',
      label: '',
      width: '100px',
    },
  ]

}
</script>
