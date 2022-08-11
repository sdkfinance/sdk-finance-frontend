<template>
  <div class="transactions-page">
    <app-data-controller
      v-loading="isExportLoading"
      :default-params="defaultParams"
      :on-load="fetchData"
      with-export
      :filters="filters"
      @get-export="getExport">
      <template
        #additional-controls>
        <app-switch
          v-if="isInvoiceSwitchVisible"
          v-model="isInvoicesEnable"
          secondary
          :label="$t('pages.invoices.invoices')"
          is-label-after/>
      </template>

      <template #prepend="{ records, isLoading }">
        <app-map
          v-loading="isLoading"
          wrapper-class="transactions-page__map"
          :data="records"
          @open-details="openDetails"/>
      </template>
      <template #default="{ records, isLastPage, isLoading }">
        <transactions-table
          v-loading="isLoading"
          :data="records"
          @open-details="openDetails"/>
        <div
          v-if="isLastPage && !isLoading"
          class="transactions-page__no-data">
          {{ $t('pages.user_dashboard.transactions.no_data') }}
        </div>
      </template>
    </app-data-controller>

    <data-details
      ref="transactionDetailsModal"
      :data="modalData"
      @closed="modalData = {}"/>
  </div>
</template>

<script lang="ts">
import {
  Component, Ref, Vue, Watch,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import AppDataController from '@/components/ui-kit/app-data-controller/app-data-controller.vue';
import TransactionsTable from '@/modules/user-dashboard/components/transactions-table.vue';
import { ITableFilter } from '@/types/interfaces/TableFilters.interface';
import {
  IGetTransactionsComputedApiResponse,
  ITransactionRecordComputed, ITransactionsFilter,
  ITransactionsOptions,
  ITransactionsRecord,
} from '@/services/requests/transactions/Transactions.types';
import { TransactionsRequests } from '@/services/requests';
import { errorNotification, cloneDeep } from '@/utils';
import { transactionsFilters } from '@/modules/user-dashboard/filters/transactions';
import TransactionDetails from '@/modules/user-dashboard/components/transaction-details.vue';
import AppMap from '@/components/ui-kit/app-map.vue';
import AppSwitch from '@/components/ui-framework/app-switch.vue';
import { IPlainObject } from '@/types/interfaces';
import { getExportFile } from '@/utils/getExportFile';
import { DataExportRequests } from '@/services/requests/data-export/DataExport.requests';
import { getTransactionsData } from '@/modules/user-dashboard/utils/getComputedTransactionData';
import { IProfileContact } from '@/types/interfaces/Profile.interface';
import { Profile } from '@/store/modules';
import DataDetails from '@/modules/user-dashboard/components/data-details.vue';

@Component({
  inheritAttrs: false,
  components: {
    DataDetails,
    AppMap,
    AppSwitch,
    AppDataController,
    TransactionsTable,
  },
})
export default class TransactionsPage extends Vue {

  @Ref('transactionDetailsModal') readonly transactionsModal!: TransactionDetails;

  @Watch('isInvoicesEnable')
  protected async goToInvoices(): Promise<void> {
    await this.$router.push({ name: 'user-dashboard-invoices' });
  }

  readonly profileModule = getModule(Profile, this.$store);

  protected modalData: IPlainObject = {};

  protected filters: ITableFilter[] = transactionsFilters;

  protected isExportLoading: boolean = false;

  protected isInvoicesEnable: boolean = false;

  protected get defaultParams(): IPlainObject {
    const { serial } = this.$route.params || {};
    return {
      filter: {
        ...(serial ? { coinSerials: [serial] } : {}),
      },
      sort: { createdAt: 'desc' },
    };
  }

  protected async fetchData(params: ITransactionsOptions): Promise<IGetTransactionsComputedApiResponse> {
    const { response, error } = await TransactionsRequests.getRecords(params);

    if (error) {
      errorNotification(error);

      return { response, error };
    }

    response!.records = this.getTransactionsList(response!.records);

    return { response, error };
  }

  protected openDetails(data: IPlainObject): void {
    this.modalData = data;
    this.transactionsModal.open();
  }

  protected getTransactionsList(transactions: ITransactionsRecord[] = []): ITransactionRecordComputed[] {
    const transactionList = cloneDeep(transactions);
    return transactionList
      .reduce((
        acc: ITransactionRecordComputed[],
        item: ITransactionsRecord,
      ) => [...acc, ...getTransactionsData(item, this.profileContact)], []);
  }

  protected get profileContact(): IProfileContact {
    return this.profileModule.profileData?.contact || {} as IProfileContact;
  }

  protected get isInvoiceSwitchVisible(): boolean {
    return this.$route.name === 'user-dashboard-transactions';
  }

  protected async getExport(params: ITransactionsFilter): Promise<void> {
    const exportInstance = getExportFile(
      DataExportRequests.init,
      DataExportRequests.info,
    );
    this.isExportLoading = true;
    await exportInstance.init(params);
    this.isExportLoading = false;
  }

  public async updateData(): Promise<void> {
    await this.fetchData({});
  }

}
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
