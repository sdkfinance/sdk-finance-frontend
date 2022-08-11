<template>
  <dashboard-content-layout is-secondary>
    <template #title>
      {{ $t('pages.transfers.title') }}
    </template>
    <app-data-table
      ref="dataTable"
      v-model="tableData"
      :filters="filters"
      :on-load="fetchData">
      <transfers-table
        :data="tableData"
        :is-loading="isLoading"
        @open-modal="openModal"/>
    </app-data-table>
    <modal
      v-model="isModalShow"
      :title="$t('pages.transfers.view_modal_title')"
      width="540px">
      <transfers-form
        :form-data="formData"/>
    </modal>
  </dashboard-content-layout>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import AppDataTable from '@/components/data-table/app-data-table.vue';
import Modal from '@/components/modal.vue';
import { CurrencyRequests, TransactionsRequests } from '@/services/requests';
import { errorNotification } from '@/utils';
import {
  ITransfersRecord,
  ITransfersOptions,
  IGetTransfersApiResponse,
} from '@/services/requests/transfers/Transfers.types';
import { ITableFilter } from '@/types/interfaces/TableFilters.interface';
import { ICurrency } from '@/services/requests/currencies/Currency.types';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import TransfersTable from '../components/transfers-table.vue';
import TransfersForm from '../components/transfers-form.vue';
import { transfersFilters } from '../filters/filters';

@Component({
  components: {
    DashboardContentLayout,
    Modal,
    AppDataTable,
    TransfersTable,
    TransfersForm,
  },
})
export default class TransfersPage extends Vue {

  @Ref('dataTable') readonly refDataTable!: AppDataTable

  protected tableData: ITransfersRecord[] = [];

  protected currencyList: ICurrency[] = [];

  protected formData: Partial<ITransfersRecord> = {};

  protected isLoading: boolean = false;

  protected isModalShow: boolean = false;

  protected transfersFilters: ITableFilter[] = transfersFilters;

  protected get filters(): ITableFilter[] {
    return this.transfersFilters.map((el: ITableFilter): ITableFilter => {
      if (el.param === 'currencyCodes') {
        el.options = this.currencyCodes;
      }
      return el;
    });
  }

  protected get currencyCodes() {
    return this.currencyList.reduce((acc, currency: ICurrency) => ({ ...acc, [currency.code]: currency.code }), {});
  }

  created() {
    this.fetchCurrency();
  }

  public async fetchCurrency(): Promise<void> {

    const { response, error } = await CurrencyRequests.getCurrencies();

    if (error) {
      errorNotification(error);
      return;
    }

    this.currencyList = response?.currencies || [];

  }

  protected async fetchData(params: ITransfersOptions): Promise<IGetTransfersApiResponse> {
    this.isLoading = true;
    const options: ITransfersOptions = {
      ...params,
      filter: {
        ...params.filter,
        types: ['client_transaction_transfer'],
      },
      sort: { createdAt: 'desc' },
    };

    const { response, error } = await TransactionsRequests.getRecords(options);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return { response, error };
    }

    return { response, error };
  }

  protected openModal(data: ITransfersRecord): void {
    this.formData = data;
    this.isModalShow = true;
  }

}
</script>
