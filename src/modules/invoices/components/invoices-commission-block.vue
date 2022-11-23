<template>
  <div
    class="form__list">
    <p>
      <strong>
        {{ $t('pages.invoices.payer_contact') }}:
      </strong>
      {{ commission.payerContact }}
    </p>
    <p>
      <strong>
        {{ $t('pages.invoices.commission') }}:
      </strong>
      {{ commission.commissionAmountPush }} {{ commission.currency }}
    </p>
    <p>
      <strong>
        {{ $t('pages.invoices.amount_without_commission') }}:
      </strong>
      {{ commission.senderAmountPush }} {{ commission.currency }}
    </p>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';

import { IInvoicesCommissionBlock } from '@/services/requests/invoices/Invoices.types';

@Component
export default class InvoicesCommissionBlock extends Vue {

  @Prop({ type: Object, required: true }) readonly commission!: IInvoicesCommissionBlock | null;

}
</script>
