<template>
  <app-form-wrapper>
    <template #title>
      {{ $t('pages.user_dashboard.modal.exchange.modal_title') }}
    </template>
    <app-form
      ref="form"
      :loading="isLoading"
      :model="form"
      :rules="rules"
      class="coin-exchange-form"
      @submit.native.prevent="handleForm">
      <app-form-item prop="inCoinSerial">
        <div class="exchange-coin-wrapper">
          <div class="coin-exchange-form__label">
            {{ $t('form.label.from_account') }}
          </div>
          <div class="exchange-coin-container">
            <div
              v-for="coin in coinList"
              :key="coin.serial"
              :class="getClassList('from', coin)"
              @click="onCoinChoose('from', coin)">
              <img
                class="exchange-coin__image"
                :src="coin.image"
                :alt="coin.name" />
              <span class="exchange-coin__value">{{ coin.currency.symbol + coin.amount.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </app-form-item>

      <app-form-item prop="outCoinSerial">
        <div class="exchange-coin-wrapper">
          <div class="coin-exchange-form__label">
            {{ $t('form.label.to_account') }}
          </div>
          <div class="exchange-coin-container">
            <div
              v-for="coin in coinList"
              :key="coin.serial"
              :class="getClassList('to', coin)"
              @click="onCoinChoose('to', coin)">
              <img
                class="exchange-coin__image"
                :src="coin.image"
                :alt="coin.name" />
              <span class="exchange-coin__value">{{ coin.currency.symbol + coin.amount.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </app-form-item>

      <app-form-item
        prop="amount"
        class="amount-form-item">
        <app-input
          v-model.trim="form.amount"
          name="amount"
          autocomplete="off"
          label="form.label.you_pay"
          placeholder="placeholder.input.input_amount" />
      </app-form-item>

      <div
        v-if="isCommissionCalculated"
        class="exchange-commission">
        <div class="exchange-commission__info">
          {{
            $t('pages.user_dashboard.modal.exchange.commission_details', {
              to_currency_symbol: commission.exchangeRate.outCurrency.symbol,
              receive_amount: commission.topUpAmount,
              from_currency: commission.exchangeRate.inCurrency.code,
              to_currency: commission.exchangeRate.outCurrency.code,
              rate: commission.exchangeRate.rate,
            })
          }}
        </div>
        <div class="exchange-commission__fee">
          <div class="exchange-commission__fee-icon">i</div>
          {{ $t('other.no_fee') }}
        </div>
      </div>

      <app-button
        class="submit-button"
        native-type="submit">
        {{ $t('action.exchange') }}
      </app-button>
    </app-form>
  </app-form-wrapper>
</template>

<script lang="ts">
import type { ICoin, ITransactionsRecord } from '@sdk5/shared/requests';
import { errorNotification } from '@sdk5/shared/utils';
import { SimpleNumberRangeValidationRule, SimpleRequiredValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppForm, AppFormItem, AppFormWrapper, AppInput, AppSelect } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator';

import type { IExchangeCalculateResponse, IExchangePayload } from '../../../requests';
import { ExchangeRequests } from '../../../requests';

type IPlainObject = Record<string, any>;
const COMPONENTS = {
  AppFormWrapper,
  AppForm,
  AppInput,
  AppFormItem,
  AppSelect,
  AppButton,
} as const;

@Component({
  name: 'exchange-form-modal',
  components: COMPONENTS,
})
export default class ExchangeFormModal extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ type: Array as PropType<ICoin[]>, required: true }) readonly coinList!: ICoin[];

  $props!: {
    coinList: ICoin[];
  };

  @Ref('form') readonly appForm!: AppForm;

  @Emit('submit')
  protected onSubmit(data: ITransactionsRecord): ITransactionsRecord {
    return data;
  }

  protected isLoading: boolean = false;

  protected isCommissionCalculated: boolean = false;

  protected commission: IExchangeCalculateResponse = {} as IExchangeCalculateResponse;

  protected form: IExchangePayload = {
    inCoinSerial: '',
    outCoinSerial: '',
    amount: 0,
  };

  protected rules: Record<keyof Pick<IExchangePayload, 'inCoinSerial' | 'outCoinSerial' | 'amount'>, unknown> = {
    outCoinSerial: SimpleRequiredValidationRule(),
    inCoinSerial: SimpleRequiredValidationRule(),
    amount: SimpleNumberRangeValidationRule(),
  };

  protected onCoinChoose(direction: 'from' | 'to', coin: ICoin): void {
    this.isCommissionCalculated = false;

    if (direction === 'from') {
      if (this.form.inCoinSerial === coin.serial) {
        this.form.inCoinSerial = '';
        return;
      }

      this.form.inCoinSerial = coin.serial;
      this.form.outCoinSerial = '';
      return;
    }

    this.form.outCoinSerial = coin.serial;
  }

  protected getClassList(direction: 'from' | 'to', coin: ICoin): [string, IPlainObject] {
    const isOutCoinChosen = direction === 'to' && this.form.outCoinSerial === coin.serial;
    const isInCoinChosen = direction === 'from' && this.form.inCoinSerial === coin.serial;
    const isOutCoinDisabled = this.form.inCoinSerial === coin.serial && !isInCoinChosen;

    return [
      'exchange-coin',
      {
        'exchange-coin--active': isOutCoinChosen || isInCoinChosen,
        'exchange-coin--disabled': isOutCoinDisabled,
      },
    ];
  }

  protected async calculateCommission(): Promise<void> {
    this.isLoading = true;
    const { response, error } = await ExchangeRequests.exchangeCalculate(this.form);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.commission = response || ({} as IExchangeCalculateResponse);
    this.isCommissionCalculated = true;
  }

  protected async handleForm(): Promise<void> {
    const isValid: boolean = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    if (!this.isCommissionCalculated) {
      await this.calculateCommission();
      return;
    }

    this.isLoading = true;
    const { response, error } = await ExchangeRequests.exchanges(this.form);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    if (response?.process) {
      this.onSubmit(response.process);
    }
  }
}
</script>

<style lang="scss">
.exchange-coin-container {
  width: 512px;

  @apply flex flex-wrap -mt-16 justify-between;
}

.coin-exchange-form {
  &__label {
    @apply font-semibold;
  }
}

.exchange-coin {
  width: 160px;
  min-width: 160px;
  border-radius: 8px;

  @apply flex px-20 py-16 shadow-md mt-16 overflow-hidden cursor-pointer transition-all ease-linear font-semibold
    border;

  &:hover {
    @apply shadow-md-bottom;
  }

  &--active {
    @apply border border-blue-accent shadow-none;

    &:hover {
      @apply shadow-none;
    }
  }

  &--disabled {
    @apply cursor-not-allowed opacity-20;
  }

  &__image {
    @apply mr-8;
  }
}

.exchange-commission {
  &__info {
    @apply text-sm text-gray-400 mb-28 sm:mb-32;
  }

  &__fee {
    @apply text-base text-gray-400 flex items-center font-semibold flex align-baseline;
  }

  &__fee-icon {
    font-size: 10px;
    background: #1b55e91a;

    @apply rounded-round mr-8 font-bold text-center text-blue-accent w-18 h-18;
  }
}

.amount-form-item {
  @apply mb-8;
}

.submit-button {
  @apply mt-40 sm:mt-48;
}
</style>
