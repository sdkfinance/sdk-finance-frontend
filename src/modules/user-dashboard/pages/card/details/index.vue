<template>
  <div class="card-details">
    <app-simple-details-card
      :details="detailsList">
      <template #paymentSystem="{detail}">
        <div class="flex items-center">
          <img
            src="/images/icons/masterpass.svg"
            alt=""
            class="w-16 h-16 mr-4"> {{ detail.value }}
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
import { Component, Prop, Vue } from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppSimpleDetailsCard from '@/components/ui-kit/app-simple-details-card.vue';
import { ISmartCardRecord } from '@/services/requests/smart-cards/SmartCards.types';
import { IDetailsValue } from '@/types/interfaces';
import { errorNotification, successNotification } from '@/utils';
import { copyToClipboard } from '@/utils/copyToClipboard';

@Component({
  components: {
    AppButton,
    AppSimpleDetailsCard,
  },
})
export default class CardDetails extends Vue {

  @Prop({ type: Object, default: () => ({}) }) readonly card!: ISmartCardRecord

  protected get detailsList(): IDetailsValue[] {
    return [
      {
        label: 'form.label.holder',
        value: this.card?.name,
        param: 'holder',
      },
      {
        label: 'form.label.number',
        value: this.card?.cardNumber,
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
