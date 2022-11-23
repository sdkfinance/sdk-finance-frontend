<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    is-secondary
    is-striped
    is-border-none
    :columns="columns">
    <template
      #user="{scope}">
      <div><b>{{ $t('table.label.user_id') }}:</b> {{ scope.row.userId || emptyChar }}</div>
      <div><b>{{ $t('table.label.host_ip') }}:</b> {{ scope.row.requestInfo.host || emptyChar }}</div>
    </template>
    <template
      #ids="{scope}">
      <div><b>{{ $t('table.label.action_id') }}:</b> {{ scope.row.actionId || emptyChar }}</div>
      <div><b>{{ $t('table.label.session_id') }}:</b> {{ scope.row.sessionId || emptyChar }}</div>
    </template>
    <template
      #action="{scope}">
      <div class="table-actions">
        <app-button
          size="small"
          @click="openModal(scope.row.actionId)">
          {{ $t('action.details') }}
        </app-button>
      </div>
    </template>
  </app-table>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppTable from '@/components/ui-framework/app-table.vue';
import config from '@/config';
import {
  IActionsOfUsersRecord,
} from '@/services/requests/actions-of-users/ActionsOfUsers.types';
import { ITableColumn } from '@/types/interfaces';

@Component({
  components: {
    AppTable,
    AppButton,
  },
})
export default class ActionsOfUsersTable extends Vue {

  @Prop({ required: true, type: Array }) readonly data!: IActionsOfUsersRecord[];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  readonly emptyChar: string = config.emptyChar;

  readonly columns: ITableColumn[] = [
    {
      prop: 'performedAt',
      label: 'table.label.performed_date',
      type: 'datetime',
      width: '160px',
    },
    {
      prop: 'user',
      label: 'table.label.user',
    },
    {
      prop: 'comment',
      label: 'table.label.comment',
    },
    {
      prop: 'ids',
      label: 'table.label.ids',
    },
    {
      prop: 'requestInfo.userAgent',
      label: 'table.label.user_agent',
    },
    {
      prop: 'action',
      label: '',
      width: '110px',
    },
  ];

  @Emit('open-modal')
  protected openModal(actionId: string): string {
    return actionId;
  }

}
</script>
