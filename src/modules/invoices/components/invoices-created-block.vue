<template>
  <div
    class="form__list">
    <p>
      <strong>
        {{ $t('pages.invoices.invoice_name') }}:
      </strong>
      {{ invoice.name }}
    </p>
    <p>
      <strong>
        {{ $t('pages.invoices.recipient') }}:
      </strong>
      {{ invoice.payerContact }}
    </p>
    <p>
      <strong>
        {{ $t('pages.invoices.amount') }}:
      </strong>
      {{ invoice.totalPrice }} / {{ invoice.issuer.currency }}
    </p>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';

import { IInvoicesRecord } from '@/services/requests/invoices/Invoices.types';

@Component
export default class InvoicesCreatedBlock extends Vue {

  @Prop({ type: Object, required: true }) readonly invoice!: IInvoicesRecord | null;

}
</script>
