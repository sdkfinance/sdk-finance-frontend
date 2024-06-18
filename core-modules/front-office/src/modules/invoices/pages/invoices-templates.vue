<template>
  <base-tabs-layout
    title="pages.invoices.invoices_templates"
    :links="links">
    <invoices-templates-table
      :data="tableData"
      :is-loading="isLoading"
      @resend="onResend"
      @edit="openEditModal" />
    <modal
      v-model="isTemplateModalVisible"
      title="pages.invoices.edit_invoice_template"
      width="380px">
      <invoice-template-form
        :form-data="formData"
        @delete="onDelete"
        @submit="onUpdated" />
    </modal>
    <modal
      v-model="isResendModalVisible"
      :title="invoiceResendModalTitle"
      width="380px">
      <create-invoice-form
        :is-resend="true"
        :form-data="formData"
        @created="onResendSubmit" />
    </modal>
    <confirm-modal
      ref="deleteTemplateModal"
      title="pages.invoices.confirm_delete_template" />
  </base-tabs-layout>
</template>

<script lang="ts">
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { AppButton, AppDataTable, ConfirmModal, Modal } from '@sdk5/ui-kit-front-office';
import { Component, Ref, Vue } from 'vue-property-decorator';

import BaseTabsLayout from '../../../layouts/base-tabs-layout.vue';
import type { IInvoiceTemplatesRecord } from '../../../requests';
import { InvoicesTemplatesRequests } from '../../../requests';
import CreateInvoiceForm from '../components/create-invoice-form.vue';
import InvoiceTemplateForm from '../components/invoice-template-form.vue';
import InvoicesTemplatesTable from '../components/invoices-templates-table.vue';
import { INVOICES_CHILDREN } from '../routes/index';

@Component({
  name: 'invoices-templates',
  components: {
    BaseTabsLayout,
    InvoicesTemplatesTable,
    Modal,
    AppDataTable,
    AppButton,
    InvoiceTemplateForm,
    ConfirmModal,
    CreateInvoiceForm,
  },
})
export default class InvoicesTemplates extends Vue {
  @Ref('dataTable') readonly refDataTable!: AppDataTable;

  @Ref('deleteTemplateModal') readonly deleteTemplateModal!: ConfirmModal;

  protected readonly links = INVOICES_CHILDREN;

  protected tableData: IInvoiceTemplatesRecord[] = [];

  protected formData: IInvoiceTemplatesRecord | null = null;

  protected isLoading: boolean = false;

  protected isTemplateModalVisible: boolean = false;

  protected isResendModalVisible: boolean = false;

  protected invoiceResendModalTitle: string = 'pages.invoices.resend_invoice';

  protected created(): void {
    this.fetchData();
  }

  protected async fetchData(): Promise<void> {
    this.isLoading = true;

    const { response, error } = await InvoicesTemplatesRequests.fetchRecords();

    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.tableData = response?.records || [];
  }

  protected async onDelete(id: string): Promise<void> {
    const value = await this.deleteTemplateModal.open();

    if (!value) {
      return;
    }

    const { error } = await InvoicesTemplatesRequests.deleteRecord(id);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.isTemplateModalVisible = false;
    await this.fetchData();
  }

  protected async onResend(record: IInvoiceTemplatesRecord): Promise<void> {
    this.isResendModalVisible = true;
    this.formData = record;
  }

  public onResendSubmit(): void {
    this.invoiceResendModalTitle = 'pages.invoices.invoice_created_modal_title';
  }

  protected openEditModal(record: IInvoiceTemplatesRecord): void {
    this.formData = record;
    this.isTemplateModalVisible = true;
  }

  protected onUpdated(): void {
    this.fetchData();
    this.isTemplateModalVisible = false;
  }
}
</script>
