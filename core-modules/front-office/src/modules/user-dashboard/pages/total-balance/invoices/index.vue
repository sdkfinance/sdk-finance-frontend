<template>
  <div class="invoices-page">
    <app-data-controller
      ref="dataControllerRef"
      v-loading="isExportLoading"
      :on-load="fetchData"
      with-export
      :filters="filters"
      @get-export="getExport">
      <template #additional-controls>
        <app-switch
          v-if="isInvoiceSwitchVisible"
          v-model="isInvoicesEnable"
          secondary
          label="pages.invoices.invoices"
          is-label-after />
      </template>

      <template
        v-if="isInvoicesMapAvailable"
        #prepend="{ records, isLoading: isLoadingPrepend }">
        <app-map
          v-loading="isLoadingPrepend"
          wrapper-class="transactions-page__map"
          :data="records"
          @open-details="openDetails" />
      </template>
      <template #default="{ records, isLastPage, isLoading: isLoadingInvoicesTable }">
        <invoices-table
          v-loading="isLoadingInvoicesTable"
          :data="records"
          @open-details="openDetails" />
        <div
          v-if="isLastPage && !isLoading"
          class="transactions-page__no-data">
          {{ $t('pages.user_dashboard.transactions.no_data') }}
        </div>
      </template>
    </app-data-controller>

    <data-details
      ref="invoicesDetailsModalRef"
      :data="modalData"
      is-invoice
      @data-changed="updateData"
      @closed="onDataDetailsClosed" />
  </div>
</template>

<script setup lang="ts">
import { useIsUaWebview } from '@sdk5/shared/composables';
import type { IGetInvoicesApiResponse, IInvoicesFilter, IInvoicesOptions, IInvoicesRecord, ITransactionsOptions } from '@sdk5/shared/requests';
import { InvoicesRequests } from '@sdk5/shared/requests';
import { errorNotification, getExportFile } from '@sdk5/shared/utils';
import { AppMap, AppSwitch } from '@sdk5/ui-kit-front-office';
import type { Ref } from 'vue';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';

import AppDataController from '../../../../../components/app-data-controller/app-data-controller.vue';
import { DataExportRequests } from '../../../../../requests/data-export/DataExport.requests';
import { getViewInvoicesRequestFilterPayload } from '../../../../../utils';
import DataDetails from '../../../components/data-details.vue';
import InvoicesTable from '../../../components/invoices-table.vue';
import { invoicesFilters } from '../../../filters/invoices';

const router = useRouter();
const route = useRoute();

const { isWebview } = useIsUaWebview();

const filters = invoicesFilters;
const defaultFilter: IInvoicesFilter = {
  statuses: ['declined', 'pending', 'expired', 'paid'],
  direction: 'INCOMING',
};

const invoicesDetailsModalRef = ref(null) as unknown as Ref<InstanceType<typeof DataDetails>>;
const dataControllerRef = ref(null) as unknown as Ref<InstanceType<typeof AppDataController>>;

const isExportLoading = ref(false);
const isInvoicesEnable = ref(true);
const isLoading = ref(false);
const modalData = ref({} as IInvoicesRecord);

const isInvoicesMapAvailable = computed(() => import.meta.env.VUE_APP_TRANSACTIONS_MAP_ENABLED === 'true');
const isInvoiceSwitchVisible = computed(() => route.name === 'user-dashboard-invoices');

const goToTransactions = () => {
  router.push({ name: 'user-dashboard-transactions-layout' });
};

const openDetails = (data: IInvoicesRecord) => {
  modalData.value = data;
  invoicesDetailsModalRef.value.open();
};

const onDataDetailsClosed = () => {
  modalData.value = {} as IInvoicesRecord;
};

const updateData = async () => {
  dataControllerRef.value.fetchRecords();
};

const fetchData = async (params: IInvoicesOptions<IInvoicesFilter>): Promise<IGetInvoicesApiResponse> => {
  isLoading.value = true;
  const filterPayload = getViewInvoicesRequestFilterPayload({ ...defaultFilter, ...params.filter });

  const request = await InvoicesRequests.getRecords({
    ...params,
    filter: {
      ...filterPayload,
    },
    sort: { createdAt: 'desc' },
  });

  isLoading.value = false;

  if (request.error) {
    errorNotification(request.error);
  }

  return request;
};

const getExport = async (params: ITransactionsOptions) => {
  if (isWebview) {
    errorNotification('notification.not_available_from_mobile');
    return;
  }

  const exportInstance = getExportFile(DataExportRequests.init, DataExportRequests.info);
  isExportLoading.value = true;
  await exportInstance.init({
    ...params,
    filter: {
      types: ['merchant_invoice'],
    },
  });
  isExportLoading.value = false;
};

watch(isInvoicesEnable, () => {
  goToTransactions();
});
</script>

<style lang="scss">
.transactions-page {
  &__map {
    @apply h-200 sm:h-240 md:h-324 rounded-lg overflow-hidden;
  }

  &__no-data {
    @apply text-center text-blue-500 max-w-300 font-medium ml-auto mr-auto;
  }
}
</style>
