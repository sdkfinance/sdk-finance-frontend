<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    is-secondary
    is-striped
    is-border-none
    :columns="columns">
    <template
      #name="{scope}">
      <div>{{ scope.row.name || '---' }}</div>
    </template>
    <template
      #email="{scope}">
      <span v-if="scope.row.contact.emailVerified">{{ scope.row.contact.email }}</span>
      <span v-else>{{ $t('table.unverified') }}</span>
    </template>
    <template
      #phoneNumber="{scope}">
      <span v-if="scope.row.contact.phoneVerified">{{ scope.row.contact.phoneNumber }}</span>
      <span v-else>{{ $t('table.unverified') }}</span>
    </template>
    <template
      #banExpiryDate="{scope, getColumnValue, column}">
      <span v-if="scope.row.banned">{{ getColumnValue(scope.row, column.prop, column.type) }}</span>
      <span v-else>{{ emptyChar }}</span>
    </template>
    <template #status="{ scope }">
      <app-badge
        is-borderless
        is-background-transparent
        :status="scope.row.active ? 'active' : 'inactive'"/>
    </template>

    <template #action="{ scope }">
      <app-button
        size="mini"
        :to="{name: 'users-profile', params: { id: scope.row.id, organizationId: getOrganizationId(scope.row), }}">
        {{ $t('action.details') }}
      </app-button>
    </template>
  </app-table>
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppTable from '@/components/ui-framework/app-table.vue';
import AppBadge from '@/components/ui-kit/app-badge.vue';
import config from '@/config';
import {
  IUserRecord,
} from '@/services/requests/users/Users.types';
import { ITableColumn } from '@/types/interfaces';

@Component({
  components: {
    AppBadge,
    AppTable,
    AppButton,
  },
})
export default class UserTable extends Vue {

  @Prop({ required: true, type: Array }) readonly data!: IUserRecord[];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  readonly emptyChar: string = config.emptyChar;

  readonly columns: ITableColumn[] = [
    {
      prop: 'name',
      label: 'table.label.owner_name',
      width: '150px',
      sortable: true,
    },
    {
      prop: 'email',
      label: 'table.label.email',
    },
    {
      prop: 'phoneNumber',
      label: 'table.label.phone_number',
      width: '150px',
    },
    // {
    //   prop: 'banExpiryDate',
    //   label: 'table.label.ban_expiry_day',
    //   type: 'datetime',
    //   width: '140px',
    // },
    {
      prop: 'createdAt',
      label: 'table.label.created_at',
      type: 'datetime',
      width: '140px',
    },
    {
      prop: 'status',
      label: 'table.label.status',
      width: '100px',
    },
    {
      prop: 'action',
      label: '',
      width: '110px',
    },
  ];

  protected getOrganizationId(record: IUserRecord) {
    return record?.members[0]?.organization?.id || null;
  }

}
</script>
