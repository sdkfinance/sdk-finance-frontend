<template>
  <div>
    <details-list
      title="pages.transfers.details_main_info"
      :details="mainInfoDetails"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import DetailsList from '@/components/details-list.vue';
import { IVouchersRecord } from '@/services/requests/prepaid-coins/Vouchers.interface';
import { IDetailsValue } from '@/types/interfaces';
import { getDefaultDate } from '@/utils';

@Component({
  components: {
    DetailsList,
  },
})
export default class VouchersFormDetails extends Vue {

  @Prop({ type: Object, required: true }) readonly formData!: IVouchersRecord;

  protected get mainInfoDetails(): IDetailsValue[] {
    return [
      {
        label: 'form.label.created_at',
        param: 'createdAt',
        value: getDefaultDate(this.formData.createdAt),

      },
      {
        label: 'form.label.activated_at',
        param: 'activatedAt',
        value: getDefaultDate(this.formData.activatedAt),

      },
      {
        label: 'form.label.amount',
        param: 'amount',
        value: this.formData.amount,

      },
      {
        label: 'form.label.status',
        param: 'status',
        value: this.formData.status,

      },
      {
        label: 'form.label.currency',
        param: 'currency',
        value: this.formData.issuer.currency,

      },
    ];
  }

}
</script>
