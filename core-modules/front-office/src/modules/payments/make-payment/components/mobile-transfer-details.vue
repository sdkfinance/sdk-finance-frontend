<template>
  <div class="mb-36">
    <app-simple-details-card :details="detailsList" />
  </div>
</template>

<script lang="ts">
import type { IDetailsValue, IPlainObject } from '@sdk5/shared/types';
import { AppSimpleDetailsCard } from '@sdk5/ui-kit-front-office';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'mobile-transfer-details',
  components: { AppSimpleDetailsCard },
})
export default class MobileTransferDetails extends Vue {
  @Prop({ type: Object, required: true }) readonly data!: IPlainObject;

  protected get detailsList(): IDetailsValue[] {
    const { srcValue, destValue, symbol } = this.data?.paymentToolDetails || {};
    const { transactionAmount } = this.data || {};

    return [
      {
        label: 'form.label.from_account',
        param: 'srcValue',
        value: srcValue,
      },
      {
        label: 'form.label.recipient',
        param: 'destValue',
        value: destValue,
      },
      {
        label: 'form.label.amount',
        param: 'transactionAmount',
        value: symbol + transactionAmount,
      },
      {
        label: 'form.label.fee',
        param: 'commissionAmountPush',
        value: this.$t('other.no_fee'),
      },
    ];
  }
}
</script>
