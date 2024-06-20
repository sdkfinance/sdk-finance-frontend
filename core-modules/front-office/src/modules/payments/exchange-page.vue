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
          ref="appFormRef"
          :loading="isLoaderVisible"
          :model="form"
          :rules="rules"
          :validate-on-rule-change="false"
          @submit.native.prevent="handleForm">
          <app-form-item prop="from">
            <account-select
              v-model="form.from"
              :coins="fromCoinsList"
              label="form.label.from_account"
              @change="onAccountChange($event, 'from')" />
          </app-form-item>

          <app-form-item prop="to">
            <account-select
              v-model="form.to"
              :coins="toCoinsList"
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
              size="large"
              :max="maxExchangeAmount"
              :min="0"
              :label="amountLabel"
              placeholder="placeholder.input.input_amount"
              @input="debouncedCommissionCalculation" />
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
            native-type="submit"
            full-width>
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
                :type="InfoModalTypes.success"
                @confirm="onSubmit" />
            </template>
          </app-modal>
        </app-form>
      </app-form-wrapper>
    </template>
  </app-step-controller>
</template>

<script setup lang="ts">
import { useGetWalletsApi } from '@sdk5/shared';
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
import { useDebounceFn, useToggle } from '@vueuse/core';
import type { Ref } from 'vue';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router/composables';

import type { IExchangeCalculateResponse, IExchangePayload } from '../../requests';
import { ExchangeRequests } from '../../requests';
import AccountSelect from '../user-dashboard/components/account-select.vue';
import OperationCommission from '../user-dashboard/components/operation-commission.vue';

interface IExchangeFormData {
  from: ICoin;
  to: ICoin;
  amount: number;
}

const props = withDefaults(
  defineProps<{
    isSellOperation?: boolean;
  }>(),
  {
    isSellOperation: false,
  },
);

const { t } = useI18n();
const router = useRouter();

const { mappedCoins: coinList, isFetching: isWalletsFetching } = useGetWalletsApi();

const appFormRef = ref(null) as unknown as Ref<InstanceType<typeof AppForm>>;
const successExchangeModal = ref(null) as unknown as Ref<InstanceType<typeof AppModal>>;

const [isLoading, toggleLoadingState] = useToggle(false);
const isCommissionCalculated = ref(false);
const exchangeData = ref({} as ITransactionsRecord);
const commission = ref({} as IExchangeCalculateResponse);
const form = ref<Partial<IExchangeFormData>>({
  from: undefined,
  to: undefined,
  amount: undefined,
});

const isLoaderVisible = computed(() => isLoading.value || isWalletsFetching.value);
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
const filterCoinListByCurrencyCode = (currencyCode: string) => coinList.value.filter((coin) => coin.currency.code !== currencyCode);
const fromCoinsList = computed(() => (form.value.to?.currency.code ? filterCoinListByCurrencyCode(form.value.to?.currency.code) : coinList.value));
const toCoinsList = computed(() => (form.value.from?.currency.code ? filterCoinListByCurrencyCode(form.value.from?.currency.code) : coinList.value));

const calculateCommission = async (): Promise<void> => {
  if (isCommissionCalculated.value) {
    return;
  }

  const isValid: boolean = await appFormRef.value?.validate();

  if (!isValid) {
    return;
  }

  const payload: IExchangePayload = {
    inCoinSerial: form.value.from!.serial,
    outCoinSerial: form.value.to!.serial,
    amount: form.value.amount!,
    exchangeType: props.isSellOperation ? 'sell' : 'buy',
  };

  toggleLoadingState();
  const { response, error } = await ExchangeRequests.exchangeCalculate(payload);
  toggleLoadingState();

  if (error) {
    errorNotification(error);
    return;
  }

  commission.value = response || ({} as IExchangeCalculateResponse);
  isCommissionCalculated.value = true;
};

const onAccountChange = (value: ICoin, direction: 'to' | 'from') => {
  const { serial } = value;

  isCommissionCalculated.value = false;
  form.value.amount = undefined;

  if (direction === 'to') {
    if (form.value?.from?.serial === serial) {
      form.value.from = undefined;
    }
  } else if (form.value?.to?.serial === serial) {
    form.value.to = undefined;
  }
};

const handleForm = async () => {
  const isValid = await appFormRef.value?.validate();

  if (!isValid || !isCommissionCalculated.value) {
    return;
  }

  const { from, to, amount } = form.value as IExchangeFormData;

  const payload: IExchangePayload = {
    inCoinSerial: from.serial,
    outCoinSerial: to.serial,
    amount: amount,
    exchangeType: props.isSellOperation ? 'sell' : 'buy',
  };

  toggleLoadingState();
  const { response, error } = await ExchangeRequests.exchanges(payload);
  toggleLoadingState();

  if (error) {
    errorNotification(error);
    return;
  }

  if (response?.process) {
    exchangeData.value = response?.process;
    form.value.from = undefined;
    form.value.to = undefined;
    form.value.amount = undefined;
    isCommissionCalculated.value = false;
    await successExchangeModal.value.open();
    router.push({ name: 'user-exchange-operations' });
  }
};

const debouncedCommissionCalculation = useDebounceFn(calculateCommission, 900);

watch(
  form,
  () => {
    isCommissionCalculated.value = false;
  },
  {
    deep: true,
  },
);
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
