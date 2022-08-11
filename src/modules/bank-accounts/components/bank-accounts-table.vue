<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    cell-class-name="v-align-top"
    :columns="columns">
    <template
      #action="{scope}">
      <div class="table-actions">
        <app-button
          size="small"
          @click="openModal(scope.row)">
          {{ $t('action.view_details') }}
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
import { IBankAccountRecord } from '@/services/requests/bank-accounts/BankAccounts.types';

@Component({
  components: {
    AppTable,
    AppButton,
  },
})
export default class BankAccountsTable extends Vue {

  @Prop({ required: true, type: Array }) readonly data!: IBankAccountRecord[];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  readonly columns: ITableColumn[] = [
    {
      prop: 'details.fullName',
      label: 'table.label.full_name',
    },
    {
      prop: 'details.iban',
      label: 'table.label.iban',
    },
    {
      prop: 'details.name',
      label: 'table.label.bank_name',
    },
    {
      prop: 'createdAt',
      label: 'table.label.created_at',
      type: 'datetime',
    },
    {
      prop: 'status',
      label: 'table.label.status',
    },
    {
      prop: 'action',
      label: 'table.label.action',
      width: '120px',
    },
  ];

  @Emit('open-modal')
  protected openModal<T>(record: T): T {
    return record;
  }

}
</script>
