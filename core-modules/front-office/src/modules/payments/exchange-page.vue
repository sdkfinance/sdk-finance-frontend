<template>
  <app-step-controller
    :total-steps="1"
    back-name="user-exchange-operations"
    is-close-visible>
    <template #default>
      <app-form-wrapper class="exchange-form-container">
        <template #title>
          {{ $t(pageTitle) }}
        </template>
        <app-form
          ref="appForm"
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
              @change="onAccountChange($event, 'from')" />
          </app-form-item>

          <app-form-item prop="to">
            <account-select
              v-model="form.to"
              :coins="coinList"
              label="form.label.to_account"
              @change="onAccountChange($event, 'to')" />
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
              @blur="calculateCommission" />
          </app-form-item>

          <operation-commission :rows="2">
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
            {{ $t(handleButtonTitle) }}
          </app-button>

          <app-modal
            ref="successExchangeModal"
            is-centred
            is-full-width>
            <template #default="{ onSubmit }">
              <app-info-modal
                :title="successExchangeModalTitle"
                subtitle="pages.user_dashboard.modal.exchange.success_exchange_subtitle"
                confirm-text="action.done"
                :is-cancel-visible="false"
                :type="infoModalTypes.success"
                @confirm="onSubmit" />
            </template>
          </app-modal>
        </app-form>
      </app-form-wrapper>
    </template>
  </app-step-controller>
</template>

<script lang="ts">
import config from '@sdk5/shared/config';
import { useI18n } from '@sdk5/shared/i18n';
import type { ICoin, ITransactionsRecord } from '@sdk5/shared/requests';
import { errorNotification } from '@sdk5/shared/utils';
import { NumberRangeValidationRule, OnChangeRequiredValidationRule } from '@sdk5/shared/validation';
import {
  AppButton,
  AppForm,
  AppFormItem,
  AppFormWrapper,
  AppInfoModal,
  AppInput,
  AppModal,
  AppStepController,
  InfoModalTypes,
} from '@sdk5/ui-kit-front-office';
import { debounce } from 'lodash';
import type { Ref } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';
import { useRouter } from 'vue-router/composables';
import { getModule } from 'vuex-module-decorators';

import type { IExchangeCalculateResponse, IExchangePayload } from '../../requests';
import { ExchangeRequests } from '../../requests';
import { UserCoins } from '../../store/modules';
import AccountSelect from '../user-dashboard/components/account-select.vue';
import OperationCommission from '../user-dashboard/components/operation-commission.vue';

export default defineComponent({
  name: 'ExchangePage',
  components: {
    AppButton,
    AppStepController,
    AppForm,
    AppInput,
    AppFormItem,
    AppFormWrapper,
    AppInfoModal,
    OperationCommission,
    AppModal,
    AccountSelect,
  },
  props: {
    isSellOperation: { type: Boolean, default: false },
  },
  setup(props) {
    const { t } = useI18n();
    const router = useRouter();

    const appForm = ref(null) as unknown as Ref<InstanceType<typeof AppForm>>;
    const successExchangeModal = ref(null) as unknown as Ref<InstanceType<typeof AppModal>>;
    const isCommissionCalculated = ref(false);
    const isLoading = ref(false);
    const exchangeData = ref({} as ITransactionsRecord);
    const commission = ref({} as IExchangeCalculateResponse);
    const form = ref({
      from: null,
      to: null,
      amount: null,
    }) as Ref<{
      from: ICoin | null;
      to: ICoin | null;
      amount: number | null;
    }>;

    const maxExchangeAmount = computed(() => form.value?.from?.amount || Number.MAX_SAFE_INTEGER);
    const rules = computed(() => {
      return {
        to: OnChangeRequiredValidationRule(),
        from: OnChangeRequiredValidationRule(),
        amount: NumberRangeValidationRule(
          'validation.invalid_integer_value',
          'validation.is_required',
          0,
          maxExchangeAmount.value,
          5,
          'validation.min_amount',
          'validation.max_amount',
          'change',
          true,
        ),
      };
    });
    const pageTitle = computed(() => (props.isSellOperation ? 'pages.currency_exchange.sell_currency' : 'pages.currency_exchange.buy_currency'));
    const handleButtonTitle = computed(() => (props.isSellOperation ? 'action.sell' : 'action.buy'));
    const amountLabel = computed(() => (props.isSellOperation ? 'form.label.sell_amount' : 'form.label.buy_amount'));
    const successExchangeModalTitle = computed(() => {
      if (exchangeData.value) {
        const { sourceCurrency, destinationCurrency, internalSourceAmount, internalDestinationAmount, targetClientCoin } = exchangeData.value;

        return t('pages.user_dashboard.modal.exchange.success_exchange_title', {
          from_currency_symbol: sourceCurrency?.symbol,
          from_amount: internalSourceAmount,
          to_currency_symbol: destinationCurrency?.symbol,
          receive_amount: internalDestinationAmount,
          account_name: targetClientCoin?.name,
        }).toString();
      }

      return t('pages.user_dashboard.modal.success_exchange_default').toString();
    });
    const exchangeRateValue = computed(() =>
      isCommissionCalculated.value
        ? `1 ${form.value.from?.currency.code} = ${commission.value?.exchangeRate?.rate}
${commission.value?.exchangeRate?.outCurrency.code}`
        : config.emptyChar,
    );
    const commissionAmountLabel = computed(() =>
      props.isSellOperation ? t('pages.currency_exchange.amount_to_receive').toString() : t('pages.currency_exchange.amount_to_pay').toString(),
    );
    const commissionAmount = computed(() => {
      const amount = props.isSellOperation
        ? `${commission.value.topUpAmount} ${commission.value.exchangeRate?.outCurrency?.code}`
        : `${commission.value.withdrawAmount} ${commission.value.exchangeRate?.inCurrency?.code}`;

      return isCommissionCalculated.value ? amount : config.emptyChar;
    });

    const calculateCommission = async (): Promise<void> => {
      if (isCommissionCalculated.value) {
        return;
      }

      const isValid: boolean = await appForm.value?.validate();

      if (!isValid) {
        return;
      }

      const payload: IExchangePayload = {
        inCoinSerial: form.value.from!.serial,
        outCoinSerial: form.value.to!.serial,
        amount: form.value.amount!,
        exchangeType: props.isSellOperation ? 'sell' : 'buy',
      };

      isLoading.value = true;
      const { response, error } = await ExchangeRequests.exchangeCalculate(payload);
      isLoading.value = false;

      if (error) {
        errorNotification(error);
        return;
      }

      commission.value = response || ({} as IExchangeCalculateResponse);
      isCommissionCalculated.value = true;
    };

    const getAmount = (data: ICoin) => {
      return data?.currency ? `${data.currency.symbol}${data.availableAmount}` : '';
    };

    const onAccountChange = (value: ICoin, direction: 'to' | 'from') => {
      const { serial } = value;

      isCommissionCalculated.value = false;

      if (direction === 'to') {
        if (form.value?.from?.serial === serial) {
          form.value.from = null;
        }
      } else if (form.value?.to?.serial === serial) {
        form.value.to = null;
      }
    };

    const handleForm = async () => {
      const isValid: boolean = await appForm.value?.validate();

      if (!isValid || !isCommissionCalculated.value) {
        return;
      }

      const payload: IExchangePayload = {
        inCoinSerial: form.value.from!.serial,
        outCoinSerial: form.value.to!.serial,
        amount: form.value.amount!,
        exchangeType: props.isSellOperation ? 'sell' : 'buy',
      };

      isLoading.value = true;
      const { response, error } = await ExchangeRequests.exchanges(payload);
      isLoading.value = false;

      if (error) {
        errorNotification(error);
        return;
      }

      if (response?.process) {
        exchangeData.value = response?.process;
        form.value.from = null;
        form.value.to = null;
        form.value.amount = null;
        isCommissionCalculated.value = false;
        await successExchangeModal.value.open();
        router.push({ name: 'user-exchange-operations' });
      }
    };

    watch(form, () => {
      isCommissionCalculated.value = false;
    });

    return {
      infoModalTypes: InfoModalTypes,
      emptyChar: config.emptyChar,
      isLoading,
      isCommissionCalculated,
      exchangeData,
      commission,
      form,
      rules,
      maxExchangeAmount,
      appForm,
      successExchangeModal,
      calculateCommission,
      debouncedCommissionCalculation: debounce(calculateCommission, 900),
      pageTitle,
      handleButtonTitle,
      amountLabel,
      successExchangeModalTitle,
      exchangeRateValue,
      commissionAmountLabel,
      commissionAmount,
      getAmount,
      onAccountChange,
      handleForm,
    };
  },
  data() {
    return {
      userCoinsModule: getModule(UserCoins, this.$store),
    };
  },
  computed: {
    coinList(): ICoin[] {
      return this.userCoinsModule.mappedCoins;
    },
  },
  created(): void {
    this.userCoinsModule.fetchCoins();
  },
});
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
