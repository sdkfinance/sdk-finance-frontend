<template>
  <div>
    <app-buttons-mobile>
      <template #mobile-visible>
        <app-button
          :to="{name: 'user-make-payment-operations', params}"
          icon="icon-make-payment">
          {{ $t('action.make_payment') }}
        </app-button>
        <app-button
          :to="{name: 'user-top-up-operations', params}"
          icon="icon-wallet-topup">
          {{ $t('action.top_up') }}
        </app-button>
      </template>
      <app-button
        :disabled="coinList.length < 2"
        icon="icon-exchange-alt"
        :to="{name: 'user-exchange-operations', params}">
        {{ $t('action.exchange') }}
      </app-button>
    </app-buttons-mobile>

    <app-modal
      ref="makePayment"
      is-full-width
      body-max-width="532px">
      <template #default="{ onSubmit }">
        <make-payment @submit="onSubmit"/>
      </template>
    </app-modal>

    <app-modal
      ref="exchangeCurrencyModal"
      is-full-width>
      <template #default="{onSubmit}">
        <exchange-form-modal
          :coin-list="coinList"
          @submit="onSubmit"/>
      </template>
    </app-modal>

    <app-modal
      ref="successExchangeModal"
      is-centred
      is-full-width>
      <template #default="{onSubmit}">
        <app-info-modal
          :title="successExchangeModalTitle"
          subtitle="pages.user_dashboard.modal.exchange.success_exchange_subtitle"
          confirm-text="action.done"
          :is-cancel-visible="false"
          :type="infoModalTypes.success"
          @confirm="onSubmit"/>
      </template>
    </app-modal>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Ref, Prop, Emit,
} from 'vue-property-decorator';

import { LocaleMessage } from 'vue-i18n';
import AppModal from '@/components/ui-kit/modals/app-modal.vue';
import AppButtonsMobile from '@/components/ui-kit/app-buttons-mobile.vue';
import AppInfoModal, { InfoModalTypes } from '@/components/ui-kit/modals/app-info-modal.vue';
import ExchangeFormModal from '@/modules/user-dashboard/components/exchange-form-modal.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { IExchangeSuccess } from '@/services/requests/exchange/Exchange.types';
import { ICoin } from '@/services/requests/organizations/Coin.types';
import MakePayment from '@/modules/user-dashboard/components/make-payment/index.vue';
import { IPlainObject } from '@/types/interfaces';

@Component({
  components: {
    AppButtonsMobile,
    AppButton,
    AppModal,
    AppInfoModal,
    ExchangeFormModal,
    MakePayment,
  },
})
export default class FrequentlyUsedActivities extends Vue {

  @Ref('exchangeCurrencyModal') readonly exchangeCurrencyModal!: AppModal;

  @Ref('successExchangeModal') readonly successExchangeModal!: AppModal;

  @Ref('makePayment') readonly makePayment!: AppModal;

  @Prop({ type: Array, default: () => [] }) readonly coinList!: ICoin[];

  @Emit('updateData')
  updateData<T>(payload?: T): T | undefined {
    return payload;
  }

  protected exchangeData: IExchangeSuccess = {} as IExchangeSuccess;

  protected infoModalTypes = InfoModalTypes;

  protected async onMakePayment(): Promise<void> {
    const isConfirm = await this.makePayment.open();

    if (isConfirm) {
      // console.log('isConfirm');
    }
  }

  protected get params(): IPlainObject {
    return { backName: this.$route.name, ...(this.$route.params || {}) };
  }

  protected get successExchangeModalTitle(): LocaleMessage {
    if (this.exchangeData) {
      const [from, to] = this.exchangeData?.children;

      return this.$t('pages.user_dashboard.modal.exchange.success_exchange_title', {
        from_currency_symbol: from.coin.issuer?.symbol,
        from_amount: from.outgoingAmount,
        to_currency_symbol: to.coin?.issuer?.symbol,
        receive_amount: to.incomingAmount,
        account_name: to.coin?.name,
      });
    }

    return this.$t('pages.user_dashboard.modal.success_exchange_default');
  }

}
</script>
