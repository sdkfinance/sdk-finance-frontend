<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    is-secondary
    is-striped
    is-border-none
    is-small-font
    :columns="columns">
    <template #currency="{scope}">
      <div v-if="getProp(scope.row, 'flow.processType') === 'withdraw_exchange_transaction'">
        {{ getProp(scope.row, 'issuer.currency') }} - {{ getProp(scope.row, 'destinationIssuer.currency') }}
      </div>
      <div v-else>
        {{ getProp(scope.row, 'issuer.currency') }}
      </div>
    </template>
    <template
      #action="{scope}">
      <div class="table-actions">
        <app-button
          size="small"
          :to="{name: `${$route.name}-system-details-view`, params: {
            contractId: $route.params.contractId,
            contractName: $route.params.contractTitle,
            profileName: $t(`entity.transaction.type.${scope.row.flow.processType}`),
            profileId: scope.row.id
          }}">
          {{ $t('action.view_details') }}
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
import { getProp } from '@/utils';

@Component({
  components: {
    AppTable,
    AppButton,
  },
})
export default class SystemCommissionTable extends Vue {

  @Prop({ default: '', type: Array }) readonly data!: [];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  protected getProp = getProp;

  readonly columns: ITableColumn[] = [
    {
      prop: 'flow.processType',
      label: 'table.label.operation',
      localePrefix: 'entity.transaction.type',
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
  ];

}
</script>
