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
      :filters="invoicesFiltersWithCurrencies"
      :on-load="fetchData">
      <invoices-table
        :data="tableData"
        :is-loading="isLoading"
        @open-invoice-details-modal="openInvoiceDetailsModal" />
    </app-data-table>
    <modal
      v-model="isInvoiceDetailsModalShow"
      :title="$t('pages.invoices.view_modal_title')"
      width="540px">
      <invoice-details-form
        :invoice-details="invoiceDetails"
        @open-delete-invoice-modal="deletePendingInvoice"
        @open-pay-invoice-modal="openPayInvoiceModal" />
    </modal>
    <modal
      v-model="isCreateModalShow"
      :title="invoiceCreateModalTitle"
      width="380px">
      <create-invoice-form @created="updateInvoicesData" />
    </modal>
    <modal
      v-model="isPayInvoiceModalShow"
      :title="invoicePayModalTitle"
      width="380px">
      <pay-invoice-form
        :invoice-details="invoiceDetails"
        @payed="updatePayedInvoiceData" />
    </modal>
    <confirm-modal
      ref="confirmDeleteModal"
      title="pages.invoices.view_modal_delete_title" />
  </base-tabs-layout>
</template>

<script lang="ts">
// @ts-nocheck
import { ROLES } from '@sdk5/shared/constants';
import type { ICurrency, IGetInvoicesApiResponse, IInvoicesFilter, IInvoicesOptions, IInvoicesRecord } from '@sdk5/shared/requests';
import { InvoicesRequests } from '@sdk5/shared/requests';
import { UserInstance } from '@sdk5/shared/services';
import { Catalog } from '@sdk5/shared/store';
import { errorNotification } from '@sdk5/shared/utils';
import { AppButton, AppDataTable, ConfirmModal, Modal } from '@sdk5/ui-kit-front-office';
import { Component, Ref, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import BaseTabsLayout from '../../../layouts/base-tabs-layout.vue';
import CreateInvoiceForm from '../components/create-invoice-form.vue';
import InvoiceDetailsForm from '../components/invoice-details-form.vue';
import InvoicesTable from '../components/invoices-table.vue';
import PayInvoiceForm from '../components/pay-invoice-form.vue';
import type { IInvoiceTableFilter } from '../filters/filters';
import { INVOICE_TABLE_FILTER_PARAM, invoicesFilters } from '../filters/filters';
import { INVOICES_CHILDREN } from '../routes/index';
import { getViewInvoicesRequestFilterPayload } from '../utils';

const COMPONENTS = {
  BaseTabsLayout,
  CreateInvoiceForm,
  Modal,
  AppDataTable,
  AppButton,
  InvoicesTable,
  InvoiceDetailsForm,
  PayInvoiceForm,
  ConfirmModal,
} as const;

@Component({
  name: 'invoices-list',
  components: COMPONENTS,
})
export default class InvoicesList extends Vue {
  static components: typeof COMPONENTS;

  @Ref('dataTable') readonly refDataTable!: AppDataTable;

  @Ref('confirmDeleteModal') readonly confirmDeleteModal!: ConfirmModal;

  protected readonly catalogModule = getModule(Catalog, this.$store);

  protected readonly links = INVOICES_CHILDREN;

  protected tableData: IInvoicesRecord[] = [];

  protected invoiceDetails: Partial<IInvoicesRecord> = {};

  protected isCreateModalShow: boolean = false;

  protected isPayInvoiceModalShow: boolean = false;

  protected isLoading: boolean = false;

  protected isConfirmModalVisible: boolean = false;

  protected isInvoiceDetailsModalShow: boolean = false;

  protected invoiceCreateModalTitle: string = 'pages.invoices.create_modal_title';

  protected invoicePayModalTitle: string = 'pages.invoices.pay_invoice_modal_title';

  protected currencies: ICurrency[] = [];

  protected readonly invoicesFilters = invoicesFilters;

  protected get currencyList() {
    return this.catalogModule.currencyList;
  }

  protected get currenciesIds() {
    return this.currencyList.reduce(
      (acc, current) => ({ ...acc, [current.id]: current.name }),
      {} as Record<ICurrency['name'], Required<ICurrency>['id']>,
    );
  }

  protected get invoicesFiltersWithCurrencies(): IInvoiceTableFilter[] {
    return this.invoicesFilters.map((filter) => {
      if (filter.param !== INVOICE_TABLE_FILTER_PARAM.currencyId) {
        return filter;
      }

      filter.options = this.currenciesIds;
      return filter;
    });
  }

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
      statuses: [],
      direction: this.isMerchant ? 'OUTGOING' : 'INCOMING',
    };
  }

  protected async fetchCurrency() {
    this.isLoading = true;
    await this.catalogModule.fetchCurrency();
    this.isLoading = false;
  }

  public updateInvoicesData(): void {
    this.invoiceCreateModalTitle = 'pages.invoices.invoice_created_modal_title';
    this.refDataTable.loadData();
  }

  public updatePayedInvoiceData(): void {
    this.invoicePayModalTitle = 'pages.invoices.invoice_payed_model_title';
    this.refDataTable.loadData();
  }

  protected async fetchData(params: IInvoicesOptions<IInvoicesFilter>): Promise<IGetInvoicesApiResponse> {
    const filterPayload = getViewInvoicesRequestFilterPayload({ ...this.defaultFilter, ...params.filter });
    this.isLoading = true;
    const { response, error } = await InvoicesRequests.getRecords({
      ...params,
      filter: {
        ...filterPayload,
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

    if (!value) {
      return;
    }

    const id = this.invoiceDetails?.identifier ?? '';

    const { error } = await InvoicesRequests.deleteInvoice(id);

    if (error) {
      errorNotification(error);
      return;
    }

    this.isInvoiceDetailsModalShow = false;
    await this.refDataTable.loadData();
  }

  created() {
    this.fetchCurrency();
  }
}
</script>
