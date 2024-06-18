<template>
  <app-modal
    ref="appModal"
    class="details"
    @closed="closed">
    <template #header>
      <div class="details__head-background">
        <img
          class="details__head-image"
          :src="categoryImageLink"
          alt="" />

        <p class="details__card-text">
          {{ amount }}
        </p>
      </div>
      <div class="details__row">
        <p class="details__row-title">
          {{ $t(title) }}
        </p>

        <p class="details__row-description">
          {{ formattedDate }}
        </p>
      </div>
    </template>

    <div
      v-if="data"
      class="details__container">
      <div class="details__body">
        <details-list-form
          :is-secondary="true"
          title="pages.transactions.information"
          :details="details">
          <template #status>
            <div class="details-list__label">
              {{ $t('form.label.status') }}
            </div>
            <app-badge
              class="details__body-badge"
              is-borderless
              is-background-transparent
              :status="data.status" />
          </template>
        </details-list-form>
        <div
          v-if="isShowDescription"
          class="description">
          <h3 class="description__title">
            {{ $t('form.label.description') }}
          </h3>
          <p class="description__content">
            {{ dataDescription }}
          </p>
        </div>
      </div>
      <div
        v-if="isPendingInvoice && isInvoice"
        class="details__footer">
        <pending-invoice-form
          :invoice-identifier="invoiceIdentifier"
          :invoice-currency="invoiceCurrency"
          @invoice-payed="onDataChanged"
          @invoice-rejected="onDataChanged" />
      </div>
    </div>
  </app-modal>
</template>

<script lang="ts">
import { TRANSACTION_TYPES_ENUM } from '@sdk5/shared/constants';
import type { IInvoicesRecord, ITransactionRecordComputed } from '@sdk5/shared/requests';
import type { IDetailsValue } from '@sdk5/shared/types';
import { AppBadge, AppModal, DetailsList } from '@sdk5/ui-kit-front-office';
import dayjs from 'dayjs';
import type { PropType, Ref } from 'vue';
import { computed, defineComponent, ref } from 'vue';

import iconPlaceholder from '../../../assets/icons/empty-category.svg';
import PendingInvoiceForm from './pending-invoice-form.vue';

export default defineComponent({
  name: 'DataDetails',
  components: {
    AppModal,
    AppBadge,
    DetailsListForm: DetailsList,
    PendingInvoiceForm,
  },
  props: {
    data: { type: Object as PropType<ITransactionRecordComputed | IInvoicesRecord>, default: undefined },
    isInvoice: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const appModal = ref(null) as unknown as Ref<InstanceType<typeof AppModal>>;
    const invoiceRecord = computed(() => props.data as IInvoicesRecord);
    const transactionRecord = computed(() => props.data as ITransactionRecordComputed);
    const isExchangeTransactionType = computed(() => (props.data as ITransactionRecordComputed).type === TRANSACTION_TYPES_ENUM.exchange_transaction);
    const title = computed(() => `entity.transaction.type.${transactionRecord.value?.type ?? ''}`);
    const formattedDate = computed(() => dayjs(props.data?.createdAt).format('D MMM, HH:mm'));
    const totalPriceString = computed(() => {
      const { currency, totalPrice, status } = (invoiceRecord.value || {}) as IInvoicesRecord;

      if (status === 'paid') {
        return `-${currency?.symbol}${totalPrice}`;
      }

      return `${currency?.symbol}${totalPrice}`;
    });
    const amount = computed(() => (props.isInvoice ? totalPriceString.value : transactionRecord.value?.totalAmountString ?? ''));
    const invoiceIdentifier = computed(() => invoiceRecord.value?.identifier);
    const invoiceCurrency = computed(() => invoiceRecord.value?.currency.code);
    const isPendingInvoice = computed(() => props.data?.status === 'pending');
    const isShowDescription = computed(() => !!(invoiceRecord.value?.data?.description && props.isInvoice));
    const dataDescription = computed(() => invoiceRecord.value?.data?.description);
    const categoryImageLink = computed(() => transactionRecord.value.categoryImageLink ?? iconPlaceholder);

    const details = computed<IDetailsValue[]>(() => {
      const checkExist = (value: string | null | number | undefined) => value || value === 0;

      const invoiceData = [
        {
          label: '',
          value: props.data?.status,
          param: 'status',
        },
        {
          label: 'form.label.invoice_id',
          value: invoiceRecord.value?.identifier,
          param: 'invoiceId',
          hide: !checkExist(invoiceRecord.value?.identifier),
        },
        {
          label: 'form.label.merchant_name',
          param: 'merchantName',
          value: invoiceRecord.value?.merchantName,
          hide: !checkExist(invoiceRecord.value?.merchantName),
        },
        {
          label: 'form.label.expires_at',
          param: 'expiresAt',
          value: dayjs(invoiceRecord.value?.expiresAt).format('D MMM, HH:mm'),
          hide: !checkExist(invoiceRecord.value?.expiresAt),
        },
        {
          label: 'form.label.total_price',
          value: totalPriceString.value,
          param: 'totalPrice',
          hide: !checkExist(invoiceRecord.value?.totalPrice),
        },
      ];

      const transactionData: IDetailsValue[] = [
        {
          label: '',
          value: props.data?.status,
          param: 'status',
        },
        {
          label: 'form.label.category_id',
          value: transactionRecord.value.categoryName,
          param: 'category',
          hide: !checkExist(transactionRecord.value.categoryName),
        },
        {
          label: 'form.label.transaction_id',
          value: transactionRecord.value?.transactionIdString,
          param: 'transactionId',
          hide: !checkExist(transactionRecord.value.transactionIdString),
        },
        {
          label: 'form.label.exchange_type',
          param: 'exchangeDirectionType',
          value: transactionRecord.value.exchangeDirectionType,
          hide: !transactionRecord.value.exchangeDirectionType,
        },
        {
          label: 'form.label.product_id',
          value: transactionRecord.value?.productIdString,
          param: 'productId',
          hide: !checkExist(transactionRecord.value.productIdString),
        },
        {
          label: 'form.label.bank_name',
          value: transactionRecord.value.bankNameString,
          param: 'bankName',
          hide: !checkExist(transactionRecord.value.bankNameString),
        },
        {
          label: 'form.label.bank_bic',
          value: transactionRecord.value.bankBicString,
          param: 'bankName',
          hide: !checkExist(transactionRecord.value.bankBicString),
        },
        {
          label: 'form.label.iban',
          value: transactionRecord.value.ibanString,
          param: 'bankName',
          hide: !checkExist(transactionRecord.value.ibanString),
        },
        {
          label: 'form.label.account_name',
          value: transactionRecord.value.accountNameString,
          param: 'accountName',
          hide: !checkExist(transactionRecord.value.accountNameString),
        },
        {
          label: 'form.label.account_serial',
          value: transactionRecord.value.accountSerialString,
          param: 'accountSerial',
          hide: !checkExist(transactionRecord.value.accountSerialString),
        },
        {
          label: 'form.label.recipient_account',
          value: transactionRecord.value.recipientAccountSerialString,
          param: 'accountSerial',
          hide: !checkExist(transactionRecord.value.recipientAccountSerialString),
        },
        {
          label: 'form.label.invoice_id',
          value: transactionRecord.value?.invoiceIdString,
          param: 'invoiceId',
          hide: !checkExist(transactionRecord.value.invoiceIdString),
        },
        {
          label: 'form.label.company_name',
          value: transactionRecord.value.companyNameString,
          param: 'companyName',
          hide: !checkExist(transactionRecord.value.companyNameString),
        },
        {
          label: 'form.label.sender',
          value: transactionRecord.value.senderNameString,
          param: 'senderName',
          hide: !checkExist(transactionRecord.value.senderNameString),
        },
        {
          label: 'form.label.recipient',
          value: transactionRecord.value.recipientNameString,
          param: 'recipientName',
          hide: !checkExist(transactionRecord.value.recipientNameString),
        },
        {
          label: 'form.label.amount',
          param: 'amount',
          value: transactionRecord.value.amountString,
          hide: !checkExist(transactionRecord.value.amountString),
        },
        {
          label: 'form.label.fee',
          value: transactionRecord.value.feeString,
          param: 'fee',
          hide: !checkExist(transactionRecord.value.feeString),
        },
        {
          label: 'form.label.recipient_fee',
          value: transactionRecord.value.recipientFeeString,
          param: 'recipientFee',
          hide: !checkExist(transactionRecord.value.recipientFeeString),
        },
        {
          label: 'form.label.sender_fee',
          value: transactionRecord.value.senderFeeString,
          param: 'senderFee',
          hide: !checkExist(transactionRecord.value.senderFeeString),
        },
        {
          label: 'form.label.gross_amount',
          value: `${transactionRecord.value.currencySymbol}${transactionRecord.value.grossAmountString}`,
          param: 'grossAmount',
          hide: !checkExist(transactionRecord.value.grossAmountString),
        },
        {
          label: 'form.label.net_amount',
          value: transactionRecord.value.netAmountString,
          param: 'netAmount',
          hide: !checkExist(transactionRecord.value.netAmountString),
        },
        {
          label: 'form.label.sold_amount',
          value: transactionRecord.value.soldAmountString,
          param: 'soldAmount',
          hide: !checkExist(transactionRecord.value.soldAmountString),
        },
        {
          label: 'form.label.bought_amount',
          value: transactionRecord.value.boughtAmountString,
          param: 'boughtAmount',
          hide: !checkExist(transactionRecord.value.boughtAmountString),
        },
        {
          label: 'form.label.description',
          value: transactionRecord.value.description,
          param: 'description',
          hide: !transactionRecord.value.description,
        },
        {
          label: 'form.label.wallet_balance',
          value: transactionRecord.value.walletAmountString,
          param: 'walletBalance',
          hide: !checkExist(transactionRecord.value.walletAmountString),
        },
        {
          label: 'form.label.wallet_hold_balance',
          value: transactionRecord.value.walletHeldAmountString,
          param: 'walletHoldBalance',
          hide: !checkExist(transactionRecord.value.walletHeldAmountString),
        },
      ];

      return props.isInvoice ? invoiceData : transactionData;
    });
    const open = () => {
      appModal.value.open();
    };
    const close = () => {
      appModal.value.close();
    };
    const onDataChanged = () => {
      close();
      emit('data-changed', true);
    };
    const closed = () => {
      emit('closed', false);
    };

    return {
      appModal,
      iconPlaceholder,
      isExchangeTransactionType,
      invoiceRecord,
      transactionRecord,
      title,
      formattedDate,
      totalPriceString,
      amount,
      invoiceIdentifier,
      invoiceCurrency,
      isPendingInvoice,
      isShowDescription,
      dataDescription,
      categoryImageLink,
      open,
      close,
      onDataChanged,
      closed,
      details,
    };
  },
});

// TODO: Вынести в отдельный компонент для переиспользования стилей
// Перемапить нормально все данные для инвойса
</script>

<style lang="scss">
.details {
  &__container {
    @apply flex justify-between flex-col h-full;
  }

  &__head-background {
    @apply w-full h-150 bg-blue-accent flex items-center justify-between px-24 text-white font-semibold text-xl;
  }

  &__head-image {
    filter: brightness(0) invert(1);

    @apply h-32 w-32;
  }

  &__head {
    @apply px-25 pb-25;

    &-row {
      @apply relative -top-35 flex items-center justify-between;

      .details__card {
        @apply p-18 bg-white rounded-lg border border-blue-300 w-fit font-bold;

        &-text {
          @apply text-gray-900;
        }
      }
    }
  }

  .details__row {
    @apply px-24 pb-32 pt-24;

    &--sub {
      @apply flex-col items-start static -mt-10;
    }

    &-title {
      @apply text-gray-900 text-xl mb-5 font-semibold;
    }

    &-subtitle {
      @apply text-blue-500 text-base font-semibold;
    }

    &-description {
      @apply text-blue-500 text-base font-medium;
    }
  }

  &__body {
    @apply p-25;

    &-badge {
      @apply ml-auto px-0;
    }
  }

  &__footer {
    @apply px-25 pb-32;
  }
}

.description {
  @apply mt-32;

  &__title {
    @apply text-base font-semibold mb-16;
  }

  &__content {
    @apply text-base font-medium;
  }
}
</style>
