<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    cell-class-name="v-align-top"
    :columns="columns">
    <template #action="{ scope }">
      <div class="table-actions">
        <app-button
          size="small"
          full-width
          @click="resendInvoice(scope.row)">
          {{ $t('action.resend') }}
        </app-button>
        <app-button
          size="small"
          full-width
          @click="editInvoice(scope.row)">
          {{ $t('action.edit') }}
        </app-button>
      </div>
    </template>
  </app-table>
</template>

<script lang="ts">
import type { ITableColumn } from '@sdk5/shared/types';
import { AppButton, AppTable } from '@sdk5/ui-kit-front-office';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

import type { IInvoiceTemplatesRecord } from '../../../requests';

@Component({
  name: 'invoices-templates-table',
  components: {
    AppTable,
    AppButton,
  },
})
export default class InvoicesTemplatesTable extends Vue {
  @Prop({ required: true, type: Array }) readonly data!: IInvoiceTemplatesRecord[];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  readonly columns: ITableColumn[] = [
    {
      prop: 'name',
      label: 'table.label.template_name',
    },
    {
      prop: 'amount',
      label: 'table.label.amount',
    },
    {
      prop: 'recipientCoin',
      label: 'table.label.recipient_wallet',
    },
    {
      prop: 'payerContact',
      label: 'table.label.payer_contact',
    },
    {
      prop: 'action',
      label: 'table.label.action',
      width: '120px',
    },
  ];

  @Emit('edit')
  protected editInvoice(record: IInvoiceTemplatesRecord): IInvoiceTemplatesRecord {
    return record;
  }

  @Emit('resend')
  protected resendInvoice(record: IInvoiceTemplatesRecord): IInvoiceTemplatesRecord {
    return record;
  }
}
</script>
