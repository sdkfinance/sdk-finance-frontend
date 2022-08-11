<template>
  <app-step-controller
    :total-steps="1"
    back-name="user-exchange-operations"
    is-close-visible>
    <template #default>
      <app-form-wrapper class="exchange-form-container">
        <template #title>
          {{ pageTitle }}
        </template>
        <app-form
          ref="form"
          :loading="isLoading"
          :model="form"
          :rules="rules"
          :validate-on-rule-change="false"
          @submit.native.prevent="handleForm">
          <app-form-item prop="from">
            <account-select
              v-model="form.from"
              :coins="coinList"
              label="form.label.from_account"
              @change="onAccountChange($event, 'from')"/>
          </app-form-item>

          <app-form-item prop="to">
            <account-select
              v-model="form.to"
              :coins="coinList"
              label="form.label.to_account"
              @change="onAccountChange($event, 'to')"/>
          </app-form-item>

          <app-form-item
            prop="amount"
            class="amount-form-item">
            <app-input
              v-model.trim="form.amount"
              name="amount"
              autocomplete="off"
              :max="maxExchangeAmount"
              :min="0"
              :label="amountLabel"
              placeholder="placeholder.input.input_amount"
              @input="debouncedCommissionCalculation"
              @blur="calculateCommission"/>
          </app-form-item>

          <operation-commission
            :rows="2">
            <template #label-1>
              {{ $t('pages.currency_exchange.exchange_rate') }}
            </template>
            <template #value-1>
              {{ exchangeRateValue }}
            </template>
            <template #label-2>
              {{ commissionAmountLabel }}
            </template>
            <template #value-2>
              {{ commissionAmount }}
            </template>
          </operation-commission>

          <app-button
            class="submit-button"
            native-type="submit">
            {{ handleButtonTitle }}
          </app-button>

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
        </app-form>
      </app-form-wrapper>
    </template>
  </app-step-controller>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Ref, Watch,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { LocaleMessage } from 'vue-i18n';
import { debounce } from 'lodash';
import {
  NumberRangeValidationRule,
  OnChangeRequiredValidationRule,
} from '@/rules/validation';
import AppStepController from '@/components/ui-kit/app-step-controller.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import { errorNotification } from '@/utils';
import AppFormWrapper from '@/components/ui-kit/modals/app-form-wrapper.vue';
import AppSelectCustomOption from '@/components/ui-framework/app-select/app-select-custom-option.vue';
import AppInfoModal, { InfoModalTypes } from '@/components/ui-kit/modals/app-info-modal.vue';
import AppModal from '@/components/ui-kit/modals/app-modal.vue';
import { IPlainObject } from '@/types/interfaces';
import { ICoin } from '@/services/requests/organizations/Coin.types';
import { UserCoins } from '@/store/modules';
import { ExchangeRequests } from '@/services/requests/exchange/ExchangeRequests';
import OperationCommission from '@/modules/user-dashboard/components/operation-commission.vue';
import {
  IExchangeCalculateResponse,
  IExchangePayload,
  IExchangeSuccess,
} from '@/services/requests/exchange/Exchange.types';
import AccountSelect from '@/modules/user-dashboard/components/account-select.vue';
import config from '@/config';

@Component({
  components: {
    AppButton,
    AppStepController,
    AppForm,
    AppInput,
    AppFormItem,
    AppSelect,
    AppFormWrapper,
    AppSelectCustomOption,
    AppInfoModal,
    OperationCommission,
    AppModal,
    AccountSelect,
  },
})
export default class ExchangePage extends Vue {

  @Ref('form') readonly appForm!: AppForm;

  @Ref('successExchangeModal') readonly successExchangeModal!: AppModal;

  @Prop({ type: Boolean, default: false }) readonly isSellOperation!: boolean;

  @Watch('form', { deep: true })
  onFormChanged(): void {
    this.isCommissionCalculated = false;
  }

  protected exchangeData: IExchangeSuccess = {} as IExchangeSuccess;

  protected userCoinsModule = getModule(UserCoins, this.$store);

  protected isLoading: boolean = false;

  protected infoModalTypes = InfoModalTypes;

  protected isCommissionCalculated: boolean = false;

  protected commission: IPlainObject = {};

  protected form: IPlainObject = {
    from: '',
    to: '',
    amount: '',
  }

  readonly emptyChar: string = config.emptyChar;

  protected get coinList(): ICoin[] {
    return this.userCoinsModule.mappedCoins;
  }

  protected get rules(): IPlainObject {
    return {
      to: OnChangeRequiredValidationRule(),
      from: OnChangeRequiredValidationRule(),
      amount: NumberRangeValidationRule('validation.invalid_integer_value',
        'validation.is_required',
        0,
        this.maxExchangeAmount,
        5,
        'validation.min_amount',
        'validation.max_amount',
        'change',
        true),
    };
  }

  protected created(): void {
    this.userCoinsModule.fetchCoins();
  }

  protected get pageTitle(): string {
    const title = this.isSellOperation
      ? 'pages.currency_exchange.sell_currency'
      : 'pages.currency_exchange.buy_currency';

    return this.$t(title) as string;
  }

  protected get handleButtonTitle(): string {
    const title = this.isSellOperation
      ? 'action.sell'
      : 'action.buy';

    return this.$t(title) as string;
  }

  protected get amountLabel(): string {
    return this.isSellOperation
      ? 'form.label.sell_amount'
      : 'form.label.buy_amount';
  }

  protected get maxExchangeAmount(): number {
    return this.form?.from?.amount || Number.MAX_SAFE_INTEGER;
  }

  protected debouncedCommissionCalculation = debounce(this.calculateCommission, 900)

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

  protected get exchangeRateValue(): string {
    return this.isCommissionCalculated
      ? `1 ${this.form.from.issuer.currency} = ${this.commission?.exchangeRate?.rate}
${this.commission?.exchangeRate?.outIssuer.currency}`
      : this.emptyChar;
  }

  protected get commissionAmountLabel(): any {
    return this.isSellOperation
      ? this.$t('pages.currency_exchange.amount_to_receive')
      : this.$t('pages.currency_exchange.amount_to_pay');
  }

  protected get commissionAmount(): string {
    const amount = this.isSellOperation
      ? `${this.commission.topUpAmount} ${this.commission.exchangeRate?.outIssuer?.currency}`
      : `${this.commission.withdrawAmount} ${this.commission.exchangeRate?.inIssuer?.currency}`;

    return this.isCommissionCalculated
      ? amount
      : this.emptyChar;
  }

  protected onAccountChange(value: IPlainObject, direction: 'to' | 'from'): void {
    const { serial } = value;

    this.isCommissionCalculated = false;

    if (direction === 'to') {
      if (this.form?.from?.serial === serial) {
        this.form.from = '';
      }
    } else if (this.form?.to?.serial === serial) {
      this.form.to = '';
    }
  }

  protected getAmount(data: ICoin): string {
    return data?.issuer ? `${data.issuer.symbol}${data.availableAmount}` : '';
  }

  protected async calculateCommission(): Promise<void> {
    if (this.isCommissionCalculated) return;

    const isValid: boolean = await this.appForm?.validate();

    if (!isValid) return;

    const payload: IExchangePayload = {
      inCoinSerial: this.form.from.serial,
      outCoinSerial: this.form.to.serial,
      amount: this.form.amount,
      exchangeType: this.isSellOperation ? 'sell' : 'buy',
    };

    this.isLoading = true;
    const { response, error } = await ExchangeRequests.exchangeCalculate(payload);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.commission = response || {} as IExchangeCalculateResponse;
    this.isCommissionCalculated = true;
  }

  protected async handleForm(): Promise<void> {
    const isValid: boolean = await this.appForm?.validate();

    if (!isValid || !this.isCommissionCalculated) return;

    const payload: IExchangePayload = {
      inCoinSerial: this.form.from.serial,
      outCoinSerial: this.form.to.serial,
      amount: this.form.amount,
      exchangeType: this.isSellOperation ? 'sell' : 'buy',
    };

    this.isLoading = true;
    const { response, error } = await ExchangeRequests.exchanges(payload);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    if (response?.process) {
      this.exchangeData = response?.process;
      this.form.from = '';
      this.form.to = '';
      this.form.amount = '';
      this.isCommissionCalculated = false;
      await this.successExchangeModal.open();
      await this.$router.push({ name: 'user-exchange-operations' });
    }
  }

}
</script>

<style lang="scss">
.exchange-form-container {
  @apply flex flex-wrap -mt-5 justify-between justify-center mx-auto max-w-510;

  .el-form-item {
    @apply mb-32;
  }
}

.exchange-header {
  &__headline {
    @apply text-2xl flex justify-center font-semibold;
  }
}

.submit-button {
  @apply mt-40 sm:mt-36;
}
</style>
