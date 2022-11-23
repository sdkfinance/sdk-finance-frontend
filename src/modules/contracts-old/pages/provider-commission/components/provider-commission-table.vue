<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    is-secondary
    is-striped
    is-border-none
    is-small-font
    :columns="columns">
    <template
      #action="{scope}">
      <div class="table-actions">
        <app-button
          size="small"
          :to="{name: `${$route.name}-gate-details-view`, params: {
            contractId: $route.params.contractId,
            contractName: $route.params.contractName,
            profileName: scope.row.provider,
            profileId: scope.row.id
          }}">
          {{ $t('action.view_settings') }}
        </app-button>
      </div>
    </template>
  </app-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppTable from '@/components/ui-framework/app-table.vue';
import { ITableColumn } from '@/types/interfaces';

@Component({
  components: {
    AppTable,
    AppButton,
  },
})
export default class ProviderCommissionTable extends Vue {

  @Prop({ default: '', type: Array }) private data!: [];

  @Prop({ default: false, type: Boolean }) private isLoading!: boolean;

  public columns: ITableColumn[] = [
    {
      prop: 'provider',
      label: 'table.label.provider',
      width: '180px',
    },
    {
      prop: 'currency',
      label: 'table.label.currency',
    },
    {
      prop: 'action',
      label: 'table.label.action',
      width: '160px',
    },
  ]

}
</script>
