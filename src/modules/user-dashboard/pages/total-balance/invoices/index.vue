<template>
  <div class="invoices-page">
    <app-data-controller
      ref="dataController"
      :on-load="fetchData"
      with-export
      :filters="filters">
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
        <invoices-table
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
      ref="invoicesDetailsModal"
      :data="modalData"
      is-invoice
      @data-changed="updateData"
      @closed="modalData = {}"/>
  </div>
</template>

<script lang="ts">
import {
  Component, Ref, Vue, Watch,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import AppSwitch from '@/components/ui-framework/app-switch.vue';
import AppDataController from '@/components/ui-kit/app-data-controller/app-data-controller.vue';
import AppMap from '@/components/ui-kit/app-map.vue';
import DataDetails from '@/modules/user-dashboard/components/data-details.vue';
import InvoiceDetails from '@/modules/user-dashboard/components/invoice-details.vue';
import InvoicesTable from '@/modules/user-dashboard/components/invoices-table.vue';
import { invoicesFilters } from '@/modules/user-dashboard/filters/invoices';
import { InvoicesRequests } from '@/services/requests';
import {
  IGetInvoicesApiResponse,
  IInvoicesFilter,
  IInvoicesOptions,
} from '@/services/requests/invoices/Invoices.types';
import { Profile } from '@/store/modules';
import { IPlainObject } from '@/types/interfaces';
import { ITableFilter } from '@/types/interfaces/TableFilters.interface';
import { errorNotification } from '@/utils';

@Component({
  inheritAttrs: false,
  components: {
    DataDetails,
    InvoicesTable,
    AppMap,
    AppSwitch,
    AppDataController,
  },
})
export default class InvoicesPage extends Vue {

  @Ref('invoicesDetailsModal') readonly invoicesModal!: InvoiceDetails;

  @Ref('dataController') readonly refDataController!: AppDataController;

  @Watch('isInvoicesEnable')
  protected async goToTransactions(): Promise<void> {
    await this.$router.push({ name: 'user-dashboard-transactions-layout' });
  }

  readonly profileModule = getModule(Profile, this.$store);

  protected modalData: IPlainObject = {};

  protected filters: ITableFilter[] = invoicesFilters;

  protected isLoading: boolean = false;

  protected isInvoicesEnable: boolean = true;

  protected openDetails(data: IPlainObject): void {
    this.modalData = data;
    this.invoicesModal.open();
  }

  protected get defaultFilter(): IInvoicesFilter {
    return {
      statuses: ['declined', 'pending', 'expired', 'paid'],
      direction: 'INCOMING',
    };
  }

  protected get isInvoiceSwitchVisible(): boolean {
    return this.$route.name === 'user-dashboard-invoices';
  }

  protected async fetchData(params: IInvoicesOptions): Promise<IGetInvoicesApiResponse> {
    this.isLoading = true;

    const request = await InvoicesRequests.getRecords({
      ...params,
      filter: {
        ...this.defaultFilter,
        ...params.filter,
      },
      sort: { createdAt: 'desc' },
    });

    this.isLoading = false;

    if (request.error) {
      errorNotification(request.error);
    }

    return request;
  }

  public async updateData(): Promise<void> {
    await this.refDataController.fetchRecords();
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
