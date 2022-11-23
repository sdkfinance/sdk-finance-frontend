<template>
  <div class="form__list">
    <p v-if="method === withdrawalMethods.cash_desk">
      <strong>
        {{
          $t('pages.wallets.messages.cash_desk_success', {
            amount: data.amount,
            currency: data.currency,
            serial: data.serial,
            requestIdentifier: data.requestIdentifier,
          })
        }}
      </strong>
    </p>
    <p v-else-if="method === withdrawalMethods.provider">
      <strong>
        {{
          $t('pages.wallets.messages.provider_success', {
            amount: data.amount,
            currency: data.currency,
            serial: data.serial,
            providerName: data.providerName,
          })
        }}
      </strong>
    </p>
    <p v-else-if="method === withdrawalMethods.bank">
      <strong>
        {{
          $t('pages.wallets.messages.bank_success', {
            amount: data.amount,
            currency: data.currency,
            serial: data.serial,
            requestIdentifier: data.requestIdentifier,
          })
        }}
      </strong>
    </p>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';

import { IWithdrawalSuccessData } from '@/modules/wallets/types/Withdrawal.types';

import { withdrawalMethods } from './withdrawalMethods';

@Component
export default class WithdrawalSuccess extends Vue {

  @Prop({ type: Object, default: () => ({}) }) readonly data!: IWithdrawalSuccessData;

  @Prop({ type: String, required: true }) readonly method!: keyof typeof withdrawalMethods;

  readonly withdrawalMethods = withdrawalMethods;

}
</script>
