<template>
  <app-form
    ref="appFormRef"
    :loading="isLoaderVisible"
    :model="form"
    class="pending-invoice-form"
    :rules="rules">
    <app-form-item prop="payerCoin">
      <account-select
        v-model="form.payerCoin"
        size="medium"
        :disabled="isNoAvailableAccounts"
        :placeholder="accountPlaceholder"
        :coins="availableAccountList"
        label="form.label.choose_account" />
    </app-form-item>
    <div class="pending-invoice-form__controls">
      <app-button
        outlined
        type="secondary"
        full-width
        @click.prevent="rejectForInvoice">
        {{ $t('action.reject') }}
      </app-button>
      <app-button
        type="secondary"
        full-width
        :disabled="isNoAvailableAccounts"
        @click.prevent="payForInvoice">
        {{ $t('action.pay') }}
      </app-button>
    </div>
  </app-form>
</template>

<script setup lang="ts">
import { useGetWalletsApi } from '@sdk5/shared/composables';
import { useI18n } from '@sdk5/shared/i18n';
import type { ICoin } from '@sdk5/shared/requests';
import { InvoicesRequests } from '@sdk5/shared/requests';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { OnChangeRequiredValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppForm, AppFormItem } from '@sdk5/ui-kit-front-office';
import type { Ref } from 'vue';
import { computed, ref } from 'vue';

import AccountSelect from './account-select.vue';

interface IForm {
  payerCoin: ICoin;
}

const props = withDefaults(
  defineProps<{
    invoiceCurrency?: string;
    invoiceIdentifier?: string;
  }>(),
  {
    invoiceCurrency: '',
    invoiceIdentifier: '',
  },
);
const emit = defineEmits(['invoice-payed', 'invoice-rejected']);

const rules = {
  payerCoin: OnChangeRequiredValidationRule(),
};

const { t } = useI18n();
const { coinList: accountList, isFetching: isWalletsFetching } = useGetWalletsApi();

const appFormRef = ref(null) as unknown as Ref<InstanceType<typeof AppForm>>;

const isLoading = ref(false);
const form = ref<IForm>({
  payerCoin: {} as ICoin,
});

const isLoaderVisible = computed(() => isLoading.value || isWalletsFetching.value);
const availableAccountList = computed(() => accountList.value.filter((account: ICoin) => account?.currency?.code === props.invoiceCurrency));
const isNoAvailableAccounts = computed(() => availableAccountList.value.length === 0);
const accountPlaceholder = computed(() => {
  const noAvailableCurrencyString = t('placeholder.select.no_available_currency_account', { currency: props.invoiceCurrency }).toString();

  return isNoAvailableAccounts.value ? noAvailableCurrencyString : t('placeholder.select.choose_account').toString();
});

const onInvoicePayed = () => {
  emit('invoice-payed');
};
const onInvoiceRejected = () => {
  emit('invoice-rejected');
};
const rejectForInvoice = async () => {
  isLoading.value = true;

  const { error } = await InvoicesRequests.deleteInvoice(props.invoiceIdentifier);

  isLoading.value = false;

  if (error) {
    errorNotification(error);
    return;
  }

  successNotification();
  onInvoiceRejected();
};
const payForInvoice = async () => {
  const isValid = await appFormRef.value.validate();

  if (!isValid) {
    return;
  }

  isLoading.value = true;

  const { error } = await InvoicesRequests.payForInvoice({ payerCoin: form.value.payerCoin.serial }, props.invoiceIdentifier);

  isLoading.value = false;

  if (error) {
    errorNotification(error);
    return;
  }

  successNotification();
  onInvoicePayed();
};
</script>

<style lang="scss">
.pending-invoice-form {
  @apply m-0 w-full;

  &__controls {
    @apply flex;
  }

  &__select {
    @apply text-primary;
  }
}
</style>
