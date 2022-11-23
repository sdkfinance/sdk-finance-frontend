<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    :columns="columns"
    is-secondary
    is-striped
    is-border-none>
    <template #action>
      <app-button
        secondary
        size="small">
        {{ $t('pages.customer.action.spectate_mode') }}
      </app-button>

      <app-button size="small">
        {{ $t('pages.customer.action.end_session') }}
      </app-button>
    </template>
  </app-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppTable from '@/components/ui-framework/app-table.vue';
import { IPlainObject, ITableColumn } from '@/types/interfaces';

@Component({
  components: { AppButton, AppTable },
})
export default class ActiveSessions extends Vue {

  @Prop({ type: Boolean, default: false }) readonly isLoading!: boolean;

  protected columns: ITableColumn[] = [
    {
      prop: 'startTime',
      label: 'table.label.start_time',
      sortable: true,
    },
    {
      prop: 'location',
      label: 'table.label.location',
      sortable: true,
    },
    {
      prop: 'device',
      label: 'table.label.device',
      sortable: true,
    },
    { prop: 'action', label: '', width: '280' },
  ]

  protected data: IPlainObject[] = [
    { startTime: '08.28.2021 - 15:21', location: 'Lithuania, Vilnius', device: 'PC' },
    { startTime: '08.28.2021 - 15:21', location: 'Lithuania, Vilnius', device: 'PC' },
    { startTime: '08.28.2021 - 15:21', location: 'Lithuania, Vilnius', device: 'PC' },
  ]

}
</script>
