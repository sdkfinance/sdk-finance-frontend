<template>
  <base-tabs-layout
    v-loading="isLoaderVisible"
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
      v-if="!!userRole"
      ref="dataTableRef"
      v-model="tableData"
      :filters="invoicesFiltersWithCurrencies"
      :on-load="fetchData">
      <invoices-table
        :data="tableData"
        @open-invoice-details-modal="openInvoiceDetailsModal" />
    </app-data-table>
    <modal
      v-model="isInvoiceDetailsModalShow"
      title="pages.invoices.view_modal_title"
      width="540px">
      <invoice-details-form
        :invoice-details="invoiceDetails"
        @view-qr-code="viewQrCodeHandler"
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
      ref="confirmDeleteModalRef"
      title="pages.invoices.view_modal_delete_title" />
    <modal
      v-model="viewQrCodeModalVisible"
      title="action.view_qr_code">
      <template #default="{ closeModal }">
        <invoice-qr-code-form
          :invoice-data="invoiceDetails"
          @cancel="closeModal" />
      </template>
    </modal>
  </base-tabs-layout>
</template>

<script setup lang="ts">
import { useGetCurrenciesApi, useGetCurrentUserProfileApi } from '@sdk5/shared/composables';
import { ROLES } from '@sdk5/shared/constants';
import type { ICurrency, IGetInvoicesApiResponse, IInvoicesFilter, IInvoicesOptions, IInvoicesRecord } from '@sdk5/shared/requests';
import { InvoicesRequests } from '@sdk5/shared/requests';
import { errorNotification } from '@sdk5/shared/utils';
import { AppButton, AppDataTable, ConfirmModal, Modal } from '@sdk5/ui-kit-front-office';
import { useToggle } from '@vueuse/core';
import type { Ref } from 'vue';
import { computed, ref } from 'vue';

import BaseTabsLayout from '../../../layouts/base-tabs-layout.vue';
import CreateInvoiceForm from '../components/create-invoice-form.vue';
import InvoiceDetailsForm from '../components/invoice-details-form.vue';
import InvoiceQrCodeForm from '../components/invoice-qr-code-form.vue';
import InvoicesTable from '../components/invoices-table.vue';
import PayInvoiceForm from '../components/pay-invoice-form.vue';
import type { IInvoiceTableFilter } from '../filters/filters';
import { INVOICE_TABLE_FILTER_PARAM, invoicesFilters } from '../filters/filters';
import { INVOICES_CHILDREN } from '../routes/index';
import { getViewInvoicesRequestFilterPayload } from '../utils';

const { isFetching: isCurrentUserProfileFetching, userRole } = useGetCurrentUserProfileApi();
const { isFetching: isCurrenciesFetching, currencies: currencyList } = useGetCurrenciesApi();

const [viewQrCodeModalVisible, toggleViewQrCodeModalVisibility] = useToggle(false);

const confirmDeleteModalRef = ref(null) as unknown as Ref<InstanceType<typeof ConfirmModal>>;
const dataTableRef = ref(null) as unknown as Ref<InstanceType<typeof AppDataTable>>;

const tableData = ref([] as IInvoicesRecord[]);
const invoiceDetails = ref({} as Partial<IInvoicesRecord>);
const isCreateModalShow = ref(false);
const isPayInvoiceModalShow = ref(false);
const isInvoiceDetailsModalShow = ref(false);
const invoiceCreateModalTitle = ref('pages.invoices.create_modal_title');
const invoicePayModalTitle = ref('pages.invoices.pay_invoice_modal_title');

const isLoaderVisible = computed(() => isCurrenciesFetching.value || isCurrentUserProfileFetching.value);
const currenciesIds = computed(() => {
  return currencyList.value.reduce(
    (acc, current) => ({ ...acc, [current.id]: current.name }),
    {} as Record<ICurrency['name'], Required<ICurrency>['id']>,
  );
});
const invoicesFiltersWithCurrencies = computed<IInvoiceTableFilter[]>(() => {
  return invoicesFilters.map((filter) => {
    if (filter.param !== INVOICE_TABLE_FILTER_PARAM.currencyId) {
      return filter;
    }

    filter.options = currenciesIds.value;
    return filter;
  });
});
const isMerchant = computed(() => userRole.value === ROLES.merchant);
const isRoleIndividual = computed(() => userRole.value === ROLES.individual);
const allowedLinks = computed(() => {
  return isRoleIndividual.value ? [] : INVOICES_CHILDREN;
});
const defaultFilter = computed<IInvoicesFilter>(() => {
  return {
    statuses: [],
    direction: isMerchant.value ? 'OUTGOING' : 'INCOMING',
  };
});

const updateInvoicesData = () => {
  invoiceCreateModalTitle.value = 'pages.invoices.invoice_created_modal_title';
  dataTableRef.value.loadData();
};
const updatePayedInvoiceData = () => {
  invoicePayModalTitle.value = 'pages.invoices.invoice_payed_model_title';
  dataTableRef.value.loadData();
};
const openInvoiceDetailsModal = (data: IInvoicesRecord) => {
  invoiceDetails.value = data;
  isInvoiceDetailsModalShow.value = true;
};
const openPayInvoiceModal = () => {
  isInvoiceDetailsModalShow.value = false;
  isPayInvoiceModalShow.value = true;
};
const fetchData = async (params: IInvoicesOptions<IInvoicesFilter>): Promise<IGetInvoicesApiResponse> => {
  const filterPayload = getViewInvoicesRequestFilterPayload({ ...defaultFilter.value, ...params.filter });
  const { response, error } = await InvoicesRequests.getRecords({
    ...params,
    filter: {
      ...filterPayload,
    },
    sort: { createdAt: 'desc' },
  });

  if (error) {
    errorNotification(error);
    return { response: null, error };
  }

  return { response, error: null };
};
const deletePendingInvoice = async () => {
  const value: boolean = await confirmDeleteModalRef.value.open();

  if (!value) {
    return;
  }

  const id = invoiceDetails.value?.identifier ?? '';

  const { error } = await InvoicesRequests.deleteInvoice(id);

  if (error) {
    errorNotification(error);
    return;
  }

  isInvoiceDetailsModalShow.value = false;
  await dataTableRef.value.loadData();
};
const viewQrCodeHandler = () => {
  toggleViewQrCodeModalVisibility(true);
};
</script>
