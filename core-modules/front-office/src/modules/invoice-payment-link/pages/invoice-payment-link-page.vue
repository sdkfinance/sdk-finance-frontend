<template>
  <div
    v-loading="isInvoiceInfoFetching"
    class="invoice-payment-link-page">
    <div class="invoice-payment-link-page__container">
      <div class="invoice-payment-link-page__title">
        {{ $t('pages.invoices.view_modal_title') }}
      </div>
      <details-list
        title="form.label.main_info"
        :details="invoiceInfoDetails" />

      <div class="invoice-payment-link-page__actions">
        <app-button
          native-type="button"
          type="secondary"
          size="big"
          full-width
          outlined
          @click="cancelButtonClickHandler">
          {{ $t('action.cancel') }}
        </app-button>
        <app-button
          native-type="button"
          type="primary"
          size="big"
          :disabled="isInvoiceInfoFetching"
          full-width
          @click="payInvoiceButtonClickHandler">
          {{ $t('action.pay_invoice') }}
        </app-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ROLES } from '@sdk5/shared';
import { useViewQrInvoiceInfoApi } from '@sdk5/shared/composables';
import { LocalStorageService } from '@sdk5/shared/services';
import type { IDetailsValue } from '@sdk5/shared/types';
import { moneyAmountFormat } from '@sdk5/shared/utils';
import { AppButton, DetailsList } from '@sdk5/ui-kit-front-office';
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';

const route = useRoute();
const router = useRouter();

const invoiceIdentifier = computed(() => route.params.identifier);
const { data: invoiceInfo, isFetching: isInvoiceInfoFetching, isFetched: isInvoiceInfoFetched } = useViewQrInvoiceInfoApi(invoiceIdentifier);

const invoiceInfoDetails = computed<IDetailsValue[]>(() => [
  {
    label: 'form.label.invoice_id',
    param: 'invoiceId',
    value: invoiceInfo?.value?.invoiceIdentifier,
  },
  {
    label: 'form.label.amount',
    param: 'amount',
    value: invoiceInfo?.value?.amount ? moneyAmountFormat(invoiceInfo?.value?.amount) : undefined,
  },
  {
    label: 'form.label.currency',
    param: 'currency',
    value: invoiceInfo?.value?.currency,
  },
  {
    label: 'form.label.merchant_name',
    param: 'merchantName',
    value: invoiceInfo?.value?.merchantName,
  },
]);

const pushToHomePage = () => {
  router.push('/');
};
const cancelButtonClickHandler = () => pushToHomePage();
const payInvoiceButtonClickHandler = () => {
  const role = LocalStorageService.get('role');

  if (role === ROLES.individual) {
    router.push({
      name: 'user-dashboard-invoices',
      query: {
        statuses: encodeURI('["pending"]'),
      },
    });
    return;
  }

  pushToHomePage();
};

watch(isInvoiceInfoFetched, (fetched) => {
  if (fetched && !invoiceInfo?.value) {
    pushToHomePage();
  }
});
</script>

<style lang="scss">
.invoice-payment-link-page {
  @apply flex justify-center;

  &__container {
    @apply w-[32.5rem] flex flex-col gap-y-[2rem] p-[2rem];
  }

  &__title {
    @apply font-semibold text-gray-500 text-2xl;
  }

  &__actions {
    @apply flex items-center gap-x-[1rem];

    .app-button {
      @apply ml-0;
    }
  }
}
</style>
