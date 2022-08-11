<template>
  <div>
    <modal
      :visible="visible"
      :title="$t('pages.wallets.modal.currency_exchange')"
      width="390px"
      @change="closeModal">
      <currency-exchange-form
        :coins-list="coinsList"
        :is-loading="isLoadingData"
        @submit="onSubmit"/>
    </modal>
    <modal
      v-model="isCompletedModalVisible"
      :title="$t('pages.wallets.modal.exchange_completed')"
      width="390px"
      @change="closeModal">
      <div
        v-if="exchangeData.status"
        class="form__list">
        <p>
          <strong>{{ $t('pages.wallets.sold') }}:</strong>
          {{ exchangeDataProcess['withdraw_exchange_transaction'].outgoingAmount }}
          {{ exchangeDataProcess['withdraw_exchange_transaction'].coin.issuer.currency }}
          {{ $t('pages.wallets.in') }}
          {{ exchangeDataProcess['withdraw_exchange_transaction'].coin.name }}
          ({{ exchangeDataProcess['withdraw_exchange_transaction'].coin.issuer.currency }})
          {{ exchangeDataProcess['withdraw_exchange_transaction'].coin.serial }}
        </p>
        <p>
          <strong>{{ $t('pages.wallets.bought') }}:</strong>
          {{ exchangeDataProcess['topup_exchange_transaction'].incomingAmount }}
          {{ exchangeDataProcess['topup_exchange_transaction'].coin.issuer.currency }}
          {{ $t('pages.wallets.from') }}
          {{ exchangeDataProcess['topup_exchange_transaction'].coin.name }}
          ({{ exchangeDataProcess['topup_exchange_transaction'].coin.issuer.currency }})
          {{ exchangeDataProcess['topup_exchange_transaction'].coin.serial }}
        </p>
      </div>
    </modal>
  </div>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Model, Vue,
} from 'vue-property-decorator';
import Modal from '@/components/modal.vue';
import CurrencyExchangeForm from '@/modules/wallets/components/forms/currency-exchange-form.vue';
import { IExchangeSuccess } from '@/services/requests/exchange/Exchange.types';
import { IPlainObject } from '@/types/interfaces';

@Component({
  components: {
    Modal,
    CurrencyExchangeForm,
  },
})
export default class CurrencyExchangeBlock extends Vue {

  @Model('change', { type: Boolean }) readonly visible!: boolean

  @Prop({ type: Array, default: () => ([]) }) readonly coinsList!: string[];

  @Prop({ type: Boolean, default: false }) readonly isLoadingData!: boolean;

  protected exchangeData: IExchangeSuccess= {} as IExchangeSuccess;

  protected isCompletedModalVisible: boolean = false

  protected get exchangeDataProcess(): IPlainObject {
    return this.exchangeData?.children?.reduce((acc, item) => ({ ...acc, [item.type]: item }), {});
  }

  @Emit('change')
  protected closeModal(): boolean {
    this.isCompletedModalVisible = false;
    return false;
  }

  @Emit('on-exchange')
  protected onExchange(): boolean {
    return true;
  }

  protected onSubmit(data: IExchangeSuccess): void {
    this.exchangeData = data;
    this.isCompletedModalVisible = true;
    this.onExchange();
  }

}
</script>
