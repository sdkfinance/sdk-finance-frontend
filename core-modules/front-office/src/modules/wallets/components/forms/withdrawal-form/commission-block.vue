<template>
  <div class="form__list">
    <p>
      <strong>{{ $t('pages.wallets.commission_amount') }}: </strong>
      {{ commission.commissionAmount }} {{ commission.currency }}
    </p>
    <p>
      <strong>{{ $t('pages.wallets.the_amount_in_view_of_commission') }}: </strong>
      {{ commission.amountToSend }} {{ commission.currency }}
    </p>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { Component, Prop, Vue } from 'vue-property-decorator';

import type { IWithdrawalCommissionBlock } from '../../../types/Withdrawal.types';

@Component({
  name: 'commission-block',
})
export default class CommissionBlock extends Vue {
  @Prop({ type: Object, required: true }) readonly commission!: IWithdrawalCommissionBlock | null;
}
</script>
