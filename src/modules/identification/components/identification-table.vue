<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    cell-class-name="v-align-top"
    :columns="columns">
    <template #user="{ scope: { row } }">
      <div><b>{{ $t('table.label.name') }}:</b> {{ row.name || emptyChar }}</div>
      <div><b>{{ $t('table.label.role') }}:</b> {{ row.members[0].organization.type || emptyChar }}</div>
    </template>

    <template #contacts="{ scope: { row } }">
      <div><b>{{ $t('table.label.email') }}:</b> {{ row.contact.email || emptyChar }}</div>
      <div><b>{{ $t('table.label.phone_number') }}:</b> {{ row.contact.phoneNumber || emptyChar }}</div>
    </template>

    <template #status="{ scope: { row } }">
      <span v-if="row.active">{{ $t('table.label.active') }}</span>
      <span v-else>{{ $t('table.label.inactive') }}</span>
    </template>

    <template #identification="{ scope: { row: { members } } }">
      <div>{{ members[0].organization.identificationStatus || emptyChar }}</div>
    </template>

    <template #action="{ scope: { row } }">
      <div class="table-actions">
        <app-button
          v-if="row.members[0].organization.identificationStatus !== 'approved'"
          size="small"
          @click="approve(row.id)">
          {{ $t('action.approve') }}
        </app-button>
        <app-button
          v-if="row.members[0].organization.identificationStatus !== 'declined'"
          size="small"
          @click="decline(row.id)">
          {{ $t('action.decline') }}
        </app-button>
      </div>
    </template>
  </app-table>
</template>

<script lang="ts">
import {
  Component, Prop, Emit, Vue,
} from 'vue-property-decorator';
import AppTable from '@/components/ui-framework/app-table.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { ITableColumn } from '@/types/interfaces';
import { IUserRecord } from '@/services/requests/users/Users.types';
import config from '@/config';

@Component({
  components: {
    AppTable,
    AppButton,
  },
})
export default class IdentificationTable extends Vue {

  @Prop({ required: true, type: Array }) readonly data!: IUserRecord[];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  readonly emptyChar: string = config.emptyChar;

  readonly columns: ITableColumn[] = [
    {
      prop: 'user',
      label: 'table.label.user',
    },
    {
      prop: 'contacts',
      label: 'table.label.contacts',
    },
    {
      prop: 'status',
      label: 'table.label.status',
      width: '120px',
    },
    {
      prop: 'identification',
      label: 'table.label.identification',
      width: '120px',
    },
    {
      prop: 'action',
      label: 'table.label.action',
      width: '120px',
    },
  ];

  @Emit('decline')
  protected decline(id: string): string {
    return id;
  }

  @Emit('approve')
  protected approve(id: string): string {
    return id;
  }

}
</script>
