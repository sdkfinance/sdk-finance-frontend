<template>
  <div class="transactions-page">
    <app-data-controller
      v-loading="isExportLoading"
      :default-params="defaultParams"
      :on-load="fetchData"
      with-export
      :filters="filters"
      :is-export-loading="isExportLoading"
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
        v-if="isTransactionsMapAvailable"
        #prepend="{ records, isLoading }">
        <app-map
          v-loading="isLoading"
          wrapper-class="transactions-page__map"
          :data="records"
          @open-details="openDetails" />
      </template>
      <template #default="{ records, isLastPage, isLoading }">
        <transactions-table
          v-loading="isLoading"
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
      v-if="modalData"
      ref="transactionDetailsModal"
      :data="modalData"
      @closed="modalData = null" />
  </div>
</template>

<script setup lang="ts">
import { useGetVuexModule, useIsUaWebview } from '@sdk5/shared/composables';
import type {
  IGetTransactionsComputedApiResponse,
  ITransactionRecordComputed,
  ITransactionsOptions,
  ITransactionsRecord,
} from '@sdk5/shared/requests';
import { TransactionsRequests } from '@sdk5/shared/requests';
import { Profile } from '@sdk5/shared/store';
import type { IProfileContact, ITableFilter } from '@sdk5/shared/types';
import { errorNotification, getExportFile } from '@sdk5/shared/utils';
import { AppMap, AppSwitch } from '@sdk5/ui-kit-front-office';
import { cloneDeep } from 'lodash';
import type { Ref } from 'vue';
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';

import AppDataController from '../../../../../components/app-data-controller/app-data-controller.vue';
import { DataExportRequests } from '../../../../../requests';
import DataDetails from '../../../components/data-details.vue';
import TransactionsTable from '../../../components/transactions-table.vue';
import { transactionsFilters } from '../../../filters/transactions';
import { getTransactionsData } from '../../../utils/getComputedTransactionData';

const profileModule = useGetVuexModule(Profile);
const { isWebview } = useIsUaWebview();

const route = useRoute();
const router = useRouter();

const transactionDetailsModal = ref(null) as unknown as Ref<InstanceType<typeof DataDetails>>;
const isInvoicesEnable = ref(false);
const isExportLoading = ref(false);
const modalData = ref<ITransactionRecordComputed | null>(null);
const filters = ref<ITableFilter[]>(transactionsFilters);

const isTransactionsMapAvailable = computed(() => import.meta.env.VUE_APP_TRANSACTIONS_MAP_ENABLED === 'true');
const defaultParams = computed(() => {
  const { serial } = route.params || {};
  return {
    filter: {
      ...(serial ? { coinSerials: [serial] } : {}),
    },
    sort: { createdAt: 'desc' },
  };
});
const isInvoiceSwitchVisible = computed(() => route.name === 'user-dashboard-transactions');
const profileContact = computed(() => profileModule.profileData?.contact || ({} as IProfileContact));

const openDetails = (data: ITransactionRecordComputed) => {
  modalData.value = data;
  nextTick(() => {
    transactionDetailsModal.value.open();
  });
};
const goToInvoices = async () => {
  router.push({ name: 'user-dashboard-invoices' });
};
const getExport = async (params: ITransactionsOptions) => {
  if (isWebview) {
    errorNotification('notification.not_available_from_mobile');
    return;
  }

  const exportInstance = getExportFile(DataExportRequests.init, DataExportRequests.info);
  isExportLoading.value = true;
  await exportInstance.init(params);
  isExportLoading.value = false;
};
const getTransactionsList = (transactions: ITransactionsRecord[] = []): ITransactionRecordComputed[] => {
  const transactionList = cloneDeep(transactions);
  return transactionList.reduce(
    (acc: ITransactionRecordComputed[], item: ITransactionsRecord) => [...acc, ...getTransactionsData(item, profileContact.value)],
    [],
  );
};
const fetchData = async (params: ITransactionsOptions): Promise<IGetTransactionsComputedApiResponse> => {
  const { response, error } = await TransactionsRequests.getRecords(params);

  if (error) {
    errorNotification(error);

    return { response: null, error };
  }

  response.records = getTransactionsList(response!.records);

  return { response, error };
};

watch(isInvoicesEnable, () => {
  goToInvoices();
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
