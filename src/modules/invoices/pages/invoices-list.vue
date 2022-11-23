<template>
  <base-tabs-layout
    title="pages.invoices.invoices_list"
    :links="allowedLinks">
    <template #actions>
      <app-button
        v-if="isMerchant"
        size="small"
        @click="isCreateModalShow = true">
        {{ $t('action.create_invoice') }}
      </app-button>
    </template>
    <app-data-table
      ref="dataTable"
      v-model="tableData"
      :filters="invoicesFilters"
      :on-load="fetchData">
      <invoices-table
        :data="tableData"
        :is-loading="isLoading"
        @open-invoice-details-modal="openInvoiceDetailsModal"/>
    </app-data-table>
    <modal
      v-model="isInvoiceDetailsModalShow"
      :title="$t('pages.invoices.view_modal_title')"
      width="540px">
      <invoice-details-form
        :invoice-details="invoiceDetails"
        @open-delete-invoice-modal="deletePendingInvoice"
        @open-pay-invoice-modal="openPayInvoiceModal"/>
    </modal>
    <modal
      v-model="isCreateModalShow"
      :title="invoiceCreateModalTitle"
      width="380px">
      <create-invoice-form
        @created="updateInvoicesData"/>
    </modal>
    <modal
      v-model="isPayInvoiceModalShow"
      :title="invoicePayModalTitle"
      width="380px">
      <pay-invoice-form
        :invoice-details="invoiceDetails"
        @payed="updatePayedInvoiceData"/>
    </modal>
    <confirm-modal
      ref="confirmDeleteModal"
      title="pages.invoices.view_modal_delete_title"/>
  </base-tabs-layout>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';

import ConfirmModal from '@/components/confirm-modal.vue';
import AppDataTable from '@/components/data-table/app-data-table.vue';
import Modal from '@/components/modal.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { ROLES } from '@/constants';
import BaseTabsLayout from '@/layouts/base-tabs-layout.vue';
import { InvoicesRequests } from '@/services/requests';
import {
  IGetInvoicesApiResponse,
  IInvoicesFilter,
  IInvoicesOptions,
  IInvoicesRecord,
} from '@/services/requests/invoices/Invoices.types';
import { UserInstance } from '@/services/UserService';
import { ITableFilter } from '@/types/interfaces/TableFilters.interface';
import { errorNotification } from '@/utils';

import CreateInvoiceForm from '../components/create-invoice-form.vue';
import InvoiceDetailsForm from '../components/invoice-details-form.vue';
import InvoicesTable from '../components/invoices-table.vue';
import PayInvoiceForm from '../components/pay-invoice-form.vue';
import { invoicesFilters } from '../filters/filters';
import { INVOICES_CHILDREN } from '../routes/index';

@Component({
  components: {
    BaseTabsLayout,
    CreateInvoiceForm,
    Modal,
    AppDataTable,
    AppButton,
    InvoicesTable,
    InvoiceDetailsForm,
    PayInvoiceForm,
    ConfirmModal,
  },
})
export default class InvoicesList extends Vue {

  @Ref('dataTable') readonly refDataTable!: AppDataTable

  @Ref('confirmDeleteModal') readonly confirmDeleteModal!: ConfirmModal;

  protected readonly links = INVOICES_CHILDREN;

  protected tableData: IInvoicesRecord[] = [];

  protected invoiceDetails: Partial<IInvoicesRecord> = {};

  protected invoicesFilters: ITableFilter[] = invoicesFilters;

  protected isCreateModalShow: boolean = false;

  protected isPayInvoiceModalShow: boolean = false;

  protected isLoading: boolean = false;

  protected isConfirmModalVisible: boolean = false;

  protected isInvoiceDetailsModalShow: boolean = false;

  protected invoiceCreateModalTitle: string = 'pages.invoices.create_modal_title';

  protected invoicePayModalTitle: string = 'pages.invoices.pay_invoice_modal_title';

  protected get isMerchant(): boolean {
    return UserInstance.isRole[ROLES.merchant];
  }

  protected get isRoleIndividual(): boolean {
    return UserInstance.isRole[ROLES.individual];
  }

  protected get allowedLinks(): any {
    return this.isRoleIndividual ? [] : this.links;
  }

  protected get defaultFilter(): IInvoicesFilter {
    return {
      statuses: ['initiated', 'pending', 'approved', 'paid', 'declined', 'expired'],
      direction: this.isMerchant ? 'OUTGOING' : 'INCOMING',
    };
  }

  public updateInvoicesData(): void {
    this.invoiceCreateModalTitle = 'pages.invoices.invoice_created_modal_title';
    this.refDataTable.loadData();
  }

  public updatePayedInvoiceData(): void {
    this.invoicePayModalTitle = 'pages.invoices.invoice_payed_model_title';
    this.refDataTable.loadData();
  }

  protected async fetchData(params: IInvoicesOptions): Promise<IGetInvoicesApiResponse> {
    this.isLoading = true;

    const { response, error } = await InvoicesRequests.getRecords({
      ...params,
      filter: {
        ...this.defaultFilter,
        ...params.filter,
      },
      sort: { createdAt: 'desc' },
    });

    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return { response, error };
    }

    return { response, error };
  }

  protected openInvoiceDetailsModal(data: IInvoicesRecord): void {
    this.invoiceDetails = data;
    this.isInvoiceDetailsModalShow = true;
  }

  protected openPayInvoiceModal(): void {
    this.isInvoiceDetailsModalShow = false;
    this.isPayInvoiceModalShow = true;
  }

  protected async deletePendingInvoice(): Promise<void> {
    const value: boolean = await this.confirmDeleteModal.open();
    if (!value) return;

    const id = this.invoiceDetails?.identifier ?? '';

    const { error } = await InvoicesRequests.deleteInvoice(id);

    if (error) {
      errorNotification(error);
      return;
    }

    this.isInvoiceDetailsModalShow = false;
    await this.refDataTable.loadData();
  }

}
</script>
