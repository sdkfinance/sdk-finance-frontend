<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    is-secondary
    is-striped
    is-border-none
    :columns="columns">
    <template #id="{ scope }">
      <app-wrap-value :value="scope.row.id"/>
    </template>
    <template #status="{ scope }">
      <app-badge
        is-borderless
        is-background-transparent
        :label="`entity.identification_status.${getStatus(scope.row)}`"
        :status="getStatus(scope.row)"/>
    </template>

    <template #action="{ scope }">
      <app-button
        size="mini"
        :to="{name: 'user-profile-kyc', params: { id: scope.row.id, organizationId: getOrganizationId(scope.row) }}">
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
import AppWrapValue from '@/components/ui-kit/table-columns/app-wrap-value.vue';
import config from '@/config';
import {
  IUserRecord,
} from '@/services/requests/users/Users.types';
import { ITableColumn } from '@/types/interfaces';

@Component({
  components: {
    AppWrapValue,
    AppBadge,
    AppTable,
    AppButton,
  },
})
export default class KycTable extends Vue {

  @Prop({ required: true, type: Array }) readonly data!: IUserRecord[];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  readonly emptyChar: string = config.emptyChar;

  readonly columns: ITableColumn[] = [
    {
      prop: 'id',
      label: 'table.label.id',
      width: '80px',
      withTooltip: true,
    },
    {
      prop: 'name',
      label: 'table.label.owner_s_name',
      width: '160px',
    },
    {
      prop: 'createdAt',
      label: 'table.label.registration_date',
      type: 'date',
      sortable: true,
    },
    {
      prop: 'status',
      label: 'table.label.status',
      width: '280px',
    },
    {
      prop: 'action',
      label: '',
      width: '110px',
    },
  ];

  protected getStatus(data: IUserRecord): string {
    return data?.members?.[0]?.organization?.identificationStatus || '';
  }

  protected getOrganizationId(record: IUserRecord) {
    return record?.members?.[0]?.organization?.id;
  }

}
</script>
