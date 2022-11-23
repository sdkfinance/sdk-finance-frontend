<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    cell-class-name="v-align-top"
    :columns="columns">
    <template #fullName="{scope}">
      {{ scope.row.firstName }} {{ scope.row.lastName }}
    </template>
    <template
      #action="{scope}">
      <div class="table-actions">
        <app-button
          size="small"
          @click="openDetailsModal(scope.row)">
          {{ $t('action.view_details') }}
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
import { IContactRecord } from '@/services/requests/contact-book/Contacts.types';
import { ITableColumn } from '@/types/interfaces';

@Component({
  components: {
    AppTable,
    AppButton,
  },
})
export default class ContactsTable extends Vue {

  @Prop({ required: true, type: Array }) readonly data!: IContactRecord[];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  @Prop({ default: false, type: Boolean }) readonly isActionHidden!: boolean;

  readonly columns: ITableColumn[] = [
    {
      prop: 'nickname',
      label: 'table.label.nickname',
    },
    {
      prop: 'fullName',
      label: 'table.label.full_name',
      type: 'datetime',
    },
    {
      prop: 'phoneNumber',
      label: 'table.label.phone_number',
    },
    {
      prop: 'email',
      label: 'table.label.email',
    },
    {
      prop: 'action',
      label: 'table.label.action',
      isHide: this.isActionHidden,
      width: '130px',
    },
  ];

  @Emit('open-details-modal')
  protected openDetailsModal(record: IContactRecord): IContactRecord {
    return record;
  }

}
</script>
