<template>
  <app-modal
    ref="appModal"
    class="transaction-details"
    @closed="closed">
    <template #header>
      <div class="transaction-details__head-background">
        <img
          class="transaction-details__head-image"
          :src="data.categoryImageLink || iconPlaceholder"
          alt="">

        <p class="transaction-details__card-text">
          {{ data.amountString }}
        </p>
      </div>

      <div class="transaction-details__row">
        <p class="transaction-details__row-title">
          {{ title }}
        </p>

        <p class="transaction-details__row-description">
          {{ formattedDate }}
        </p>
      </div>
    </template>

    <div class="transaction-details__body">
      <details-list-form
        :is-secondary="true"
        title="pages.transactions.information"
        :details="details">
        <template #status>
          <div class="details-list__label">
            {{ $t('form.label.status') }}
          </div>
          <app-badge
            class="transaction-details__body-badge"
            is-borderless
            :status="data.status"/>
        </template>
      </details-list-form>
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
import { ITransactionRecordComputed } from '@/services/requests/transactions/Transactions.types';
import { IActionButton, IDetailsValue } from '@/types/interfaces';

const iconPlaceholder = require('@/assets/icons/empty-category.svg');

@Component({
  components: {
    AppModal,
    AppBadge,
    AppActionGroup,
    AppOperationImage,
    DetailsListForm,
    AppActionButton,
  },
})
export default class TransactionDetails extends Vue {

  @Ref('appModal') readonly appModal!: AppModal;

  @Prop({ type: Object, required: true }) data!: ITransactionRecordComputed;

  protected iconPlaceholder = iconPlaceholder;

  protected buttonsConfig: IActionButton[] = [
    {
      title: 'action.download_receipt',
      icon: 'icon-transfer-from',
      disabled: false,
      event: 'onTransfer',
    },
    {
      title: 'action.make_recurrent',
      icon: 'icon-refresh',
      disabled: false,
      event: 'onTransfer',
    },
    {
      title: 'action.add_to_template',
      icon: 'icon-star',
      disabled: false,
      event: 'onTransfer',
    },
    {
      title: 'action.dispute',
      icon: 'icon-dispute',
      disabled: false,
      event: 'onTransfer',
    },
  ];

  protected get details(): IDetailsValue[] {
    const { type } = this.data;
    const checkExist = (value: string | null | number | undefined) => value || value === 0;

    const hideCommission = [
      TRANSACTION_TYPES_ENUM.client_transaction_transfer,
    ].includes(type);

    return [
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

  }

  protected get title(): string {
    return this.data.detailsTitle || this.data.title!;
  }

  protected get formattedDate(): string {
    return dayjs(this.data?.createdAt).format('D MMM, HH:mm');
  }

  @Emit('closed')
  protected closed(): boolean {
    return false;
  }

  public open(): void {
    this.appModal.open();
  }

}
</script>

<style lang="scss">
.transaction-details {
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

      .transaction-details__card {
        @apply p-18 bg-white rounded-lg border border-blue-300 w-fit font-bold;

        &-text {
          @apply text-gray-900;
        }
      }
    }
  }

  .transaction-details__row {
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
      @apply ml-auto;
    }
  }
}
</style>
