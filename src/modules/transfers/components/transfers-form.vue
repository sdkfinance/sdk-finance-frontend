<template>
  <div>
    <details-list
      title="pages.transfers.details_main_info"
      :details="mainInfoDetails"/>
    <details-list
      title="pages.transfers.details_from"
      :details="fromDetails"/>
    <details-list
      title="pages.transfers.details_to"
      :details="toDetails"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import DetailsList from '@/components/details-list.vue';
import {
  ITransfersRecord,
  ITransfersTransaction,
} from '@/services/requests/transfers/Transfers.types';
import { IDetailsValue } from '@/types/interfaces';
import { getDefaultDate } from '@/utils';

@Component({
  components: {
    DetailsList,
  },
})
export default class TransfersForm extends Vue {

  @Prop({ type: Object, required: true }) readonly formData!: ITransfersRecord;

  protected get transaction(): any {
    return this.formData.transactions.find((el: ITransfersTransaction) => el.type === 'transfer');
  }

  protected get mainInfoDetails(): IDetailsValue[] {
    return [
      {
        label: 'form.label.created_at',
        param: 'createdAt',
        value: getDefaultDate(this.formData.createdAt),

      },
      {
        label: 'form.label.updated_at',
        param: 'updatedAt',
        value: getDefaultDate(this.formData.updatedAt),

      },
      {
        label: 'form.label.amount',
        param: 'amount',
        value: this.transaction?.amount,

      },
      {
        label: 'form.label.description',
        param: 'description',
        value: this.formData.description,

      },
      {
        label: 'form.label.status',
        param: 'status',
        value: this.formData.status,

      },
      {
        label: 'form.label.request_id',
        param: 'requestIdentifier',
        value: this.formData.requestIdentifier,

      },
      {
        label: 'form.label.request_status',
        param: 'requestStatus',
        value: this.formData.requestStatus,

      },
      {
        label: 'form.label.transaction_id',
        param: 'id',
        value: this.transaction?.id,

      },
      {
        label: 'form.label.transaction_type',
        param: 'type',
        value: this.$t(`entity.transaction.type.${this.formData.type}`),

      },
    ];
  }

  protected get fromDetails(): IDetailsValue[] {
    return [
      {
        label: 'form.label.wallet_serial',
        param: 'serial',
        value: this.transaction?.from.serial,

      },
      {
        label: 'form.label.organization_id',
        param: 'organizationId',
        value: this.transaction?.from.organizationId,

      },
      {
        label: 'form.label.organization_name',
        param: 'organizationName',
        value: this.transaction?.from.organizationName,

      },
      {
        label: 'form.label.technical',
        param: 'technical',
        value: this.transaction?.from.technical,

      },
      {
        label: 'form.label.wallet_type',
        param: 'type',
        value: this.transaction?.from.type,

      },
      {
        label: 'form.label.issuer_id',
        param: 'id',
        value: this.transaction?.from.issuer.id,

      },
      {
        label: 'form.label.serial_number',
        param: 'sn',
        value: this.transaction?.from.issuer.sn,

      },
      {
        label: 'form.label.currency',
        param: 'currency',
        value: this.transaction?.from.issuer.currency,

      },
    ];
  }

  protected get toDetails(): IDetailsValue[] {
    return [
      {
        label: 'form.label.wallet_serial',
        param: 'serial',
        value: this.transaction?.to.serial,

      },
      {
        label: 'form.label.organization_id',
        param: 'organizationId',
        value: this.transaction?.to.organizationId,

      },
      {
        label: 'form.label.organization_name',
        param: 'organizationName',
        value: this.transaction?.to.organizationName,

      },
      {
        label: 'form.label.technical',
        param: 'technical',
        value: this.transaction?.to.technical,

      },
      {
        label: 'form.label.wallet_type',
        param: 'type',
        value: this.transaction?.to.type,

      },
      {
        label: 'form.label.issuer_id',
        param: 'id',
        value: this.transaction?.to.issuer.id,

      },
      {
        label: 'form.label.serial_number',
        param: 'sn',
        value: this.transaction?.to.issuer.sn,

      },
      {
        label: 'form.label.currency',
        param: 'currency',
        value: this.transaction?.to.issuer.currency,

      },
    ];
  }

}
</script>
