<template>
  <div>
    <app-button
      v-if="isPayInvoiceButtonVisible"
      class="button"
      @click="onPayClicked">
      {{ $t('action.pay_for_invoice') }}
    </app-button>

    <app-button
      v-if="isStatusPending"
      class="button"
      @click="onDeleteClicked">
      {{ $t('action.delete_invoice') }}
    </app-button>

    <details-list
      title="pages.invoices.main_info"
      :details="mainInfo"/>
    <details-list
      title="pages.invoices.operation_details"
      :details="operationDetails"/>
    <details-list
      title="pages.invoices.created_by_user"
      :details="createdByUser"/>
    <details-list
      title="pages.invoices.payer_details"
      :details="payerDetails"/>
  </div>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';

import DetailsList from '@/components/details-list.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { ROLES } from '@/constants';
import {
  IInvoicesRecord,
} from '@/services/requests/invoices/Invoices.types';
import { UserInstance } from '@/services/UserService';
import { IDetailsValue } from '@/types/interfaces';

@Component({
  components: {
    DetailsList,
    AppButton,
  },
})
export default class InvoiceDetailsForm extends Vue {

  @Prop({ type: Object, required: true }) readonly invoiceDetails!: IInvoicesRecord;

  @Emit('open-pay-invoice-modal')
  protected onPayClicked(): boolean {
    return true;
  }

  @Emit('open-delete-invoice-modal')
  protected onDeleteClicked(): boolean {
    return true;
  }

  protected get isRoleIndividual(): boolean {
    return UserInstance.isRole[ROLES.individual];
  }

  protected get isInvoiceCreator(): boolean {
    const userOrganizationId = UserInstance.organizationId;
    const createdUserOrganizationId = this.invoiceDetails.createdByUser?.profileOrganizationId;

    return userOrganizationId === createdUserOrganizationId;
  }

  protected get isStatusPending(): boolean {
    return this.invoiceDetails.status === 'pending';
  }

  protected get isPayInvoiceButtonVisible(): boolean {
    return this.isStatusPending && this.isRoleIndividual && !this.isInvoiceCreator;
  }

  protected get mainInfo(): IDetailsValue[] {
    return [
      {
        label: 'form.label.id',
        param: 'identifier',
        value: this.invoiceDetails.identifier,
      },
      {
        label: 'form.label.name',
        param: 'name',
        value: this.invoiceDetails.name,
      },
      {
        label: 'form.label.status',
        param: 'status',
        value: this.invoiceDetails.status,
      },
      {
        label: 'form.label.created_at',
        param: 'createdAt',
        value: this.invoiceDetails.createdAt,
      },
      {
        label: 'form.label.expired_at',
        param: 'expiresAt',
        value: this.invoiceDetails.expiresAt,
      },
    ];
  }

  protected get operationDetails(): IDetailsValue[] {
    return [
      {
        label: 'form.label.total_price',
        param: 'totalPrice',
        value: this.invoiceDetails.totalPrice,
      },
      {
        label: 'form.label.vat_applied',
        param: 'name',
        value: this.invoiceDetails.name,
      },
      {
        label: 'form.label.expires_at',
        param: 'expiresAt',
        value: this.invoiceDetails.expiresAt,
      },
      {
        label: 'form.label.created_at',
        param: 'createdAt',
        value: this.invoiceDetails.createdAt,
      },
      {
        label: 'form.label.merchant_name',
        param: 'merchantName',
        value: this.invoiceDetails.merchantName,
      },
      {
        label: 'form.label.payment_code',
        param: 'paymentCode',
        value: this.invoiceDetails.paymentCode,
      },
      {
        label: 'form.label.issuer_id',
        param: 'id',
        value: this.invoiceDetails.issuer?.id,
      },
      {
        label: 'form.label.serial_number',
        param: 'sn',
        value: this.invoiceDetails.issuer?.sn,
      },
      {
        label: 'form.label.currency',
        param: 'currency',
        value: this.invoiceDetails.issuer?.currency,
      },
    ];
  }

  protected get createdByUser(): IDetailsValue[] {
    return [
      {
        label: 'form.label.id',
        param: 'id',
        value: this.invoiceDetails.createdByUser?.id,
      },
      {
        label: 'form.label.name',
        param: 'name',
        value: this.invoiceDetails.createdByUser?.name,
      },
      {
        label: 'form.label.organization_id',
        param: 'profileOrganizationId',
        value: this.invoiceDetails.createdByUser?.profileOrganizationId,
      },
    ];
  }

  protected get payerDetails(): IDetailsValue[] {
    return [
      {
        label: 'form.label.status',
        param: 'status',
        value: this.invoiceDetails.payer?.status,
      },
      {
        label: 'form.label.message',
        param: 'message',
        value: this.invoiceDetails.payer?.message,
      },
      {
        label: 'form.label.id',
        param: 'id',
        value: this.invoiceDetails.payer?.id,
      },
      {
        label: 'form.label.type',
        param: 'type',
        value: this.invoiceDetails.payer?.type,
      },
      {
        label: 'form.label.name',
        param: 'name',
        value: this.invoiceDetails.payer?.name,
      },
      {
        label: 'form.label.status_identification',
        param: 'identificationStatus',
        value: this.invoiceDetails.payer?.identificationStatus,
      },
    ];
  }

}
</script>
