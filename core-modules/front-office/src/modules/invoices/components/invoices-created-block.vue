<template>
  <div class="form__list">
    <p>
      <strong> {{ $t('pages.invoices.invoice_name') }}: </strong>
      {{ invoice.name }}
    </p>
    <p>
      <strong> {{ $t('pages.invoices.recipient') }}: </strong>
      {{ invoice.payerContact }}
    </p>
    <p>
      <strong> {{ $t('pages.invoices.amount') }}: </strong>
      {{ invoice.totalPrice }} / {{ invoice.currency.code }}
    </p>
  </div>
</template>

<script lang="ts">
import type { IInvoicesRecord } from '@sdk5/shared/requests';
import type { PropType } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'invoices-created-block',
})
export default class InvoicesCreatedBlock extends Vue {
  @Prop({ type: Object as PropType<IInvoicesRecord>, required: true }) readonly invoice!: IInvoicesRecord;

  $props!: {
    invoice: IInvoicesRecord;
  };
}
</script>
