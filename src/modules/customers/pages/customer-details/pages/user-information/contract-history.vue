<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    :columns="columns"
    is-secondary
    is-striped
    is-border-none>
    <template #status="{ scope }">
      <app-badge
        is-borderless
        is-background-transparent
        :status="scope.row.status"/>
    </template>

    <template #action>
      <app-button
        secondary
        size="small">
        {{ $t('action.block_account') }}
      </app-button>
    </template>
  </app-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppTable from '@/components/ui-framework/app-table.vue';
import AppBadge from '@/components/ui-kit/app-badge.vue';
import { IPlainObject, ITableColumn } from '@/types/interfaces';

@Component({
  components: { AppBadge, AppButton, AppTable },
})
export default class ContractHistory extends Vue {

  @Prop({ type: Boolean, default: false }) readonly isLoading!: boolean;

  protected columns: ITableColumn[] = [
    {
      prop: 'contract',
      label: 'table.label.contract',
      sortable: true,
      width: '300',
    },
    {
      prop: 'endDate',
      label: 'table.label.endDate',
      sortable: true,
    },
    {
      prop: 'startDate',
      label: 'table.label.startDate',
      type: 'displayAmount',
      sortable: true,
    },
    {
      prop: 'duration',
      label: 'table.label.duration',
      sortable: true,
    },
    {
      prop: 'status',
      label: 'table.label.status',
      sortable: true,
    },
  ]

  protected data: IPlainObject[] = [
    {
      contract: 'Contract 1', endDate: '21.06.2021', startDate: '22.06.2021', duration: '12 m', status: 'active',
    },
  ]

}
</script>
