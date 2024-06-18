<template>
  <div class="card-details">
    <app-simple-details-card :details="detailsList">
      <template #paymentSystem="{ detail }">
        <div class="flex items-center">
          <img
            src="/images/icons/masterpass.svg"
            alt=""
            class="w-16 h-16 mr-4" />
          {{ detail.value }}
        </div>
      </template>
    </app-simple-details-card>
    <div class="card-details__buttons">
      <app-button
        transparent
        icon="icon-copy"
        @click="copyData">
        {{ $t('action.copy') }}
      </app-button>
      <app-button
        transparent
        icon="icon-print"
        @click="printData">
        {{ $t('action.print') }}
      </app-button>
    </div>
  </div>
</template>

<script lang="ts">
import type { IDetailsValue } from '@sdk5/shared/types';
import { copyToClipboard, errorNotification, successNotification } from '@sdk5/shared/utils';
import { AppButton, AppSimpleDetailsCard } from '@sdk5/ui-kit-front-office';
import { Component, Prop, Vue } from 'vue-property-decorator';

import type { TDisplayCardDetails } from '../types';

const COMPONENTS = {
  AppButton,
  AppSimpleDetailsCard,
} as const;

@Component({
  components: COMPONENTS,
})
export default class CardDetails extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ type: Object, default: () => ({}) }) readonly card!: TDisplayCardDetails;

  protected get cardNumberFormat() {
    return this.card?.cardNumber.match(/.{1,4}/g)?.join(' ') ?? '';
  }

  protected get detailsList(): IDetailsValue[] {
    return [
      {
        label: 'form.label.holder',
        value: this.card?.cardHolder,
        param: 'holder',
      },
      {
        label: 'form.label.number',
        value: this.cardNumberFormat,
        param: 'number',
      },
      {
        label: 'form.label.expire_date',
        value: this.card?.expirationDate,
        param: 'expireDate',
      },
      {
        label: 'form.label.cvv',
        value: this.card?.cvv,
        param: 'cvv',
      },
      {
        label: 'form.label.payment_system',
        value: this.card?.paymentSystem || 'Mastercard',
        param: 'paymentSystem',
      },
    ];
  }

  protected copyData(): void {
    try {
      const text = this.detailsList.reduce((acc, { label, value }) => `${acc}${this.$t(label)}: ${value} \n`, '');
      copyToClipboard(text);
      successNotification('notification.copied');
    } catch (error) {
      errorNotification('notification.copy_failed');
    }
  }

  protected printData(): void {
    window.print();
  }
}
</script>

<style lang="scss">
.card-details {
  @apply w-full;

  &__buttons {
    @apply flex items-center sm:justify-end mt-20;
  }
}

@media print {
  .user-dashboard__header,
  .account-details__actions,
  .tabs,
  .card-page__card,
  .card-details__buttons,
  .card-page__progress {
    display: none !important;
  }
}
</style>
