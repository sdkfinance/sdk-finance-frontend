<template>
  <div class="transfer-details">
    <app-simple-details-card :details="detailsList" />
    <div class="transfer-details__buttons">
      <app-button
        transparent
        icon="icon-copy"
        @click="copyData">
        {{ $t('action.copy') }}
      </app-button>
    </div>
  </div>
</template>

<script lang="ts">
import type { IDetailsValue, IPlainObject } from '@sdk5/shared/types';
import { copyToClipboard, errorNotification, successNotification } from '@sdk5/shared/utils';
import { AppButton, AppSimpleDetailsCard } from '@sdk5/ui-kit-front-office';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'transfer-details',
  components: { AppButton, AppSimpleDetailsCard },
})
export default class TransferDetails extends Vue {
  @Prop({ type: Object, required: true }) readonly data!: IPlainObject;

  @Prop({ type: Boolean, default: false }) readonly isAccountPage!: boolean;

  protected get detailsList(): IDetailsValue[] {
    const { srcValue, destValue, recipientFullName, symbol } = this.data?.paymentToolDetails || {};
    const { transactionAmount, commissionAmountPush, recipientAmountPush } = this.data || {};

    return [
      {
        label: this.isAccountPage ? 'form.label.from_account' : 'form.label.from_card',
        param: 'srcValue',
        value: srcValue,
      },
      {
        label: 'form.label.recipient_full_name',
        param: 'recipientFullName',
        value: recipientFullName,
        hide: !recipientFullName,
      },
      {
        label: this.isAccountPage ? 'form.label.to_account' : 'form.label.to_card',
        param: 'destValue',
        value: destValue,
      },
      {
        label: 'form.label.amount',
        param: 'transactionAmount',
        value: symbol + transactionAmount,
      },
      {
        label: 'form.label.recipient_gets',
        param: 'recipientAmountPush',
        value: symbol + recipientAmountPush,
      },
      {
        label: 'form.label.fee',
        param: 'commissionAmountPush',
        value: commissionAmountPush ? symbol + commissionAmountPush : this.$t('other.no_fee'),
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
}
</script>

<style lang="scss">
.transfer-details {
  @apply w-full;

  &__buttons {
    @apply flex items-center sm:justify-end mt-20;

    .btn {
      width: initial !important;
      margin-right: initial !important;
      margin-left: initial !important;
    }
  }
}
</style>
