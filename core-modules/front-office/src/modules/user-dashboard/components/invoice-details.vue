<template>
  <app-modal
    ref="appModal"
    class="invoice-details"
    @closed="closed">
    <template #header>
      <div class="invoice-details__head-background">
        <img
          class="invoice-details__head-image"
          :src="data.categoryImageLink || iconPlaceholder"
          alt="" />

        <p class="invoice-details__card-text">
          {{ totalPriceString }}
        </p>
      </div>

      <div class="invoice-details__row">
        <p class="invoice-details__row-title">
          {{ title }}
        </p>

        <p class="invoice-details__row-description">
          {{ formattedDate }}
        </p>
      </div>
    </template>

    <div class="invoice-details__container">
      <div class="invoice-details__body">
        <details-list-form
          :is-secondary="true"
          title="pages.transactions.information"
          :details="details">
          <template #status>
            <div class="details-list__label">
              {{ $t('form.label.status') }}
            </div>
            <app-badge
              class="invoice-details__body-badge"
              is-borderless
              :status="data.status" />
          </template>
        </details-list-form>

        <div
          v-if="data.description"
          class="description">
          <h3 class="description__title">
            {{ $t('form.label.description') }}
          </h3>
          <p class="description__content">
            {{ data.description }}
          </p>
        </div>
      </div>

      <div
        v-if="isPendingInvoice"
        class="invoice-details__footer">
        <pending-invoice-form
          :invoice-identifier="invoiceIdentifier"
          :account-list="accountsList"
          :invoice-currency="invoiceCurrency"
          @invoice-payed="onDataChanged"
          @invoice-rejected="onDataChanged" />
      </div>
    </div>
  </app-modal>
</template>

<script lang="ts">
import type { ICoin } from '@sdk5/shared/requests';
import type { IDetailsValue } from '@sdk5/shared/types';
import { AppActionButton, AppActionGroup, AppBadge, AppModal, AppOperationImage, DetailsList } from '@sdk5/ui-kit-front-office';
import dayjs from 'dayjs';
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import iconPlaceholder from '../../../assets/icons/empty-category.svg';
import { UserCoins } from '../../../store/modules';
import PendingInvoiceForm from './pending-invoice-form.vue';

type IPlainObject = Record<string, any>;

// FIXME: Not used
@Component({
  name: 'invoice-details',
  components: {
    AppModal,
    AppBadge,
    AppActionGroup,
    AppOperationImage,
    DetailsListForm: DetailsList,
    AppActionButton,
    PendingInvoiceForm,
  },
})
export default class InvoiceDetails extends Vue {
  @Ref('appModal') readonly appModal!: AppModal;

  @Prop({ type: Object, required: true }) data!: IPlainObject;

  @Emit('dataChanged')
  onDataChanged(): boolean {
    this.close();
    return true;
  }

  protected iconPlaceholder = iconPlaceholder;

  protected userCoinsModule = getModule(UserCoins, this.$store);

  protected get details(): IDetailsValue[] {
    const checkExist = (value: string | null | number | undefined) => value || value === 0;

    return [
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
  }

  protected get title(): string {
    return this.data?.detailsTitle || this.data?.name;
  }

  protected get formattedDate(): string {
    return dayjs(this.data?.createdAt).format('D MMM, HH:mm');
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

  protected get accountsList(): ICoin[] {
    return this.userCoinsModule.coinList;
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
</script>

<style lang="scss">
.invoice-details {
  &__container {
    @apply flex justify-between flex-col h-full;
  }

  &__head-background {
    @apply w-full h-150 bg-primary flex items-center justify-between px-24 text-white font-semibold text-xl;
  }

  &__head-image {
    filter: brightness(0) invert(1);

    @apply h-32 w-32;
  }

  &__head {
    @apply px-25 pb-25;

    &-row {
      @apply relative -top-35 flex items-center justify-between;

      .invoice-details__card {
        @apply p-18 bg-white rounded-lg border border-blue-300 w-fit font-bold;

        &-text {
          @apply text-gray-900;
        }
      }
    }
  }

  .invoice-details__row {
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
