<template>
  <app-modal
    ref="appModal"
    class="details"
    @closed="closed">
    <template #header>
      <div class="details__head-background">
        <img
          class="details__head-image"
          :src="data.categoryImageLink || iconPlaceholder"
          alt="">

        <p class="details__card-text">
          {{ amount }}
        </p>
      </div>

      <div class="details__row">
        <p class="details__row-title">
          {{ title }}
        </p>

        <p class="details__row-description">
          {{ formattedDate }}
        </p>
      </div>
    </template>

    <div class="details__container">
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
              :status="data.status"/>
          </template>
        </details-list-form>
        <div
          v-if="isShowDescription"
          class="description">
          <h3 class="description__title">
            {{ $t('form.label.description') }}
          </h3>
          <p class="description__content">
            {{ data.data.description }}
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
          @invoice-rejected="onDataChanged"/>
      </div>
    </div>
  </app-modal>
</template>

<script lang="ts">
import dayjs from 'dayjs';
import {
  Component, Emit,
  Prop, Ref, Vue,
} from 'vue-property-decorator';

import DetailsListForm from '@/components/details-list.vue';
import AppActionButton from '@/components/ui-kit/app-action-button.vue';
import AppActionGroup from '@/components/ui-kit/app-action-group.vue';
import AppBadge from '@/components/ui-kit/app-badge.vue';
import AppOperationImage from '@/components/ui-kit/app-operation-image.vue';
import AppModal from '@/components/ui-kit/modals/app-modal.vue';
import { TRANSACTION_TYPES_ENUM } from '@/constants';
import PendingInvoiceForm from '@/modules/user-dashboard/components/pending-invoice-form.vue';
import { IDetailsValue, IPlainObject } from '@/types/interfaces';

const iconPlaceholder = require('@/assets/icons/empty-category.svg');

@Component({
  components: {
    AppModal,
    AppBadge,
    AppActionGroup,
    AppOperationImage,
    DetailsListForm,
    AppActionButton,
    PendingInvoiceForm,
  },
})
export default class dataDetails extends Vue {

  @Ref('appModal') readonly appModal!: AppModal;

  @Prop({ type: Object, required: true }) data!: IPlainObject;

  @Prop({ type: Boolean, default: false }) isInvoice!: false;

  @Emit('data-changed')
  onDataChanged(): boolean {
    this.close();
    return true;
  }

  protected iconPlaceholder = iconPlaceholder;

  protected get details(): IDetailsValue[] {
    const { type } = this.data;

    const checkExist = (value: string | null | number | undefined) => value || value === 0;

    const hideCommission = [
      TRANSACTION_TYPES_ENUM.client_transaction_transfer,
    ].includes(type);

    const invoiceData = [
      {
        label: '',
        value: this.data?.status,
        param: 'status',
      },
      {
        label: 'form.label.invoice_id',
        value: this.data?.identifier,
        param: 'invoiceId',
        hide: !checkExist(this.data?.identifier),
      },
      {
        label: 'form.label.merchant_name',
        param: 'merchantName',
        value: this.data?.merchantName,
        hide: !checkExist(this.data?.merchantName),
      },
      {
        label: 'form.label.expires_at',
        param: 'expiresAt',
        value: dayjs(this.data?.expiresAt).format('D MMM, HH:mm'),
        hide: !checkExist(this.data?.expiresAt),
      },
      {
        label: 'form.label.total_price',
        value: this.totalPriceString,
        param: 'totalPrice',
        hide: !checkExist(this.data?.totalPrice),
      },
    ];

    const transactionData = [
      {
        label: '',
        value: this.data?.status,
        param: 'status',
      },
      {
        label: 'form.label.amount',
        value: `${this.data.currencySymbol}${this.data.amountDetailsString}`,
        param: 'amount',
        hide: !checkExist(this.data.amountDetailsString),
      },
      {
        label: 'form.label.sold_amount',
        value: this.data.soldAmountString,
        param: 'soldAmount',
        hide: !checkExist(this.data.soldAmountString),
      },
      {
        label: 'form.label.bought_amount',
        value: this.data.boughtAmountString,
        param: 'boughtAmount',
        hide: !checkExist(this.data.boughtAmountString),
      },
      {
        label: 'form.label.commission',
        value: `${this.data.currencySymbol}${this.data.commissionString}`,
        param: 'commission',
        hide: !checkExist(this.data.commissionString) || hideCommission,
      },
      {
        label: 'form.label.account_name',
        value: this.data.accountNameString,
        param: 'accountName',
        hide: !checkExist(this.data.accountNameString),
      },
      {
        label: 'form.label.account_serial',
        value: this.data.accountSerialString,
        param: 'accountSerial',
        hide: !checkExist(this.data.accountSerialString),
      },
      {
        label: 'form.label.recipient_account',
        value: this.data.recipientAccountSerialString,
        param: 'accountSerial',
        hide: !checkExist(this.data.recipientAccountSerialString),
      },
      {
        label: 'form.label.category_id',
        value: this.data.categoryString,
        param: 'category',
        hide: !checkExist(this.data.categoryString),
      },
      {
        label: 'form.label.transaction_id',
        value: this.data?.transactionIdString,
        param: 'transactionId',
        hide: !checkExist(this.data.transactionIdString),
      },
      {
        label: 'form.label.invoice_id',
        value: this.data?.invoiceIdString,
        param: 'invoiceId',
        hide: !checkExist(this.data.invoiceIdString),
      },
      {
        label: 'form.label.sender',
        value: this.data.senderNameString,
        param: 'senderName',
        hide: !checkExist(this.data.senderNameString),
      },
      {
        label: 'form.label.recipient',
        value: this.data.recipientNameString,
        param: 'recipientName',
        hide: !checkExist(this.data.recipientNameString),
      },
      {
        label: 'form.label.gross_amount',
        value: `${this.data.currencySymbol}${this.data.grossAmountString}`,
        param: 'grossAmount',
        hide: !checkExist(this.data.grossAmountString),
      },
      {
        label: 'form.label.net_amount',
        value: `${this.data.currencySymbol}${this.data.netAmountString}`,
        param: 'netAmount',
        hide: !checkExist(this.data.netAmountString),
      },
      {
        label: 'form.label.recipient_fee',
        value: `${this.data.currencySymbol}${this.data.recipientFeeString}`,
        param: 'recipientFee',
        hide: !checkExist(this.data.recipientFeeString),
      },
      {
        label: 'form.label.sender_fee',
        value: `${this.data.currencySymbol}${this.data.senderFeeString}`,
        param: 'senderFee',
        hide: !checkExist(this.data.senderFeeString),
      },
    ];

    return this.isInvoice ? invoiceData : transactionData;

  }

  protected get title(): string {
    return this.data?.detailsTitle || this.data?.name!;
  }

  protected get formattedDate(): string {
    return dayjs(this.data?.createdAt).format('D MMM, HH:mm');
  }

  protected get amount(): string {
    return this.isInvoice ? this.totalPriceString : this.data?.amountString;
  }

  protected get totalPriceString(): string {
    const { issuer, totalPrice, status } = this.data || {};

    if (status === 'paid') {
      return `-${issuer?.symbol}${totalPrice}`;
    }

    return `${issuer?.symbol}${totalPrice}`;
  }

  protected get invoiceIdentifier(): string {
    return this.data?.identifier;
  }

  protected get invoiceCurrency(): string {
    return this.data?.issuer?.currency;
  }

  protected get isPendingInvoice(): boolean {
    return this.data?.status === 'pending';
  }

  protected get isShowDescription(): boolean {
    return this.data?.data?.description && this.isInvoice;
  }

  @Emit('closed')
  protected closed(): boolean {
    return false;
  }

  public open(): void {
    this.appModal.open();
  }

  public close(): void {
    this.appModal.close();
  }

}

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
