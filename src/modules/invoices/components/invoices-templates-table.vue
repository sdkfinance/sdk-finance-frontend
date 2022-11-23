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
          @click="resendInvoice(scope.row)">
          {{ $t('action.resend') }}
        </app-button>
        <app-button
          size="small"
          @click="editInvoice(scope.row)">
          {{ $t('action.edit') }}
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
import { IInvoiceTemplatesRecord } from '@/services/requests/invoice-templates/InvoicesTemplates.types';
import { ITableColumn } from '@/types/interfaces';

@Component({
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
      prop: 'templateName',
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
