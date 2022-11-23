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

import AppButton from '@/components/ui-framework/app-button.vue';
import AppTable from '@/components/ui-framework/app-table.vue';
import AppBadge from '@/components/ui-kit/app-badge.vue';
import { ITableColumn } from '@/types/interfaces';

@Component({
  components: {
    AppBadge,
    AppTable,
    AppButton,
  },
})
export default class CurrencyExchangesTable extends Vue {

  @Prop({ default: () => [], type: Array }) readonly data!: [];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  readonly columns: ITableColumn[] = [
    {
      prop: 'type',
      label: 'table.label.type_of_the_internal_commission',
      sortable: true,
      width: '130px',
    },
    {
      prop: 'percent',
      label: 'table.label.percent_of_using_this_gate_last_month',
      type: 'percent',
      sortable: true,
    },
    {
      prop: 'earned',
      label: 'table.label.earned_last_month',
      sortable: true,
    },
    {
      prop: 'median_transactions',
      label: 'table.label.median_transactions_last_month',
      sortable: true,
    },
    {
      prop: 'median_earning',
      label: 'table.label.median_earning_last_month',
      sortable: true,
    },
    {
      prop: 'start_date',
      label: 'table.label.start_date',
      type: 'date',
      sortable: true,
    },
    {
      prop: 'end_date',
      label: 'table.label.end_date',
      type: 'date',
      sortable: true,
    },
    {
      prop: 'status',
      label: 'table.label.status',
      sortable: true,
    },
    {
      prop: 'action',
      label: '',
    },
  ]

}
</script>
