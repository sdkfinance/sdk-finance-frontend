<template>
  <div>
    <details-list
      title="pages.transfers.details_main_info"
      :details="mainInfoDetails" />
  </div>
</template>

<script lang="ts">
import type { IVouchersRecord } from '@sdk5/shared/requests';
import type { IDetailsValue } from '@sdk5/shared/types';
import { getDefaultDate } from '@sdk5/shared/utils';
import { DetailsList } from '@sdk5/ui-kit-front-office';
import { Component, Prop, Vue } from 'vue-property-decorator';

const COMPONENTS = {
  DetailsList,
} as const;

@Component({
  name: 'vouchers-form-details',
  components: COMPONENTS,
})
export default class VouchersFormDetails extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ type: Object, required: true }) readonly formData!: IVouchersRecord;

  $props!: {
    formData: IVouchersRecord;
  };

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
        value: this.formData.currency.code,
      },
    ];
  }
}
</script>
