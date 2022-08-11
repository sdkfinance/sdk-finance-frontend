<template>
  <app-table
    is-secondary
    is-striped
    is-border-none
    is-small-font
    :data="data"
    :is-loading="isLoading"
    :columns="columns">
    <template
      #action="{scope}">
      <div class="table-actions">
        <app-button
          size="small"
          :to="{name: `${$route.name}-provider-commission`, params: {
            contractId: scope.row.id,
            contractName: scope.row.name,
          }}">
          {{ $t('action.view_details') }}
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

@Component({
  components: {
    AppTable,
    AppButton,
  },
})
export default class ContractsTable extends Vue {

  @Prop({ default: '', type: Array }) private data!: [];

  @Prop({ default: false, type: Boolean }) private isLoading!: boolean;

  public columns: ITableColumn[] = [
    {
      prop: 'name',
      label: 'table.label.name',
      width: '400px',
    },
    {
      prop: 'description',
      label: 'table.label.description',
    },
    {
      prop: 'action',
      label: 'table.label.action',
      width: '130px',
    },
  ]

}
</script>
