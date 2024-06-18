<template>
  <component
    :is="isFullPage ? 'dashboard-content-layout' : 'div'"
    is-secondary
    is-back-hidden>
    <template
      v-if="isTitleVisible"
      #title>
      {{ $t('pages.transactions.title') }}
    </template>
    <app-data-table
      ref="dataTable"
      v-model="tableData"
      :filters="filters"
      :on-load="fetchData">
      <transactions-table
        :data="tableData"
        :is-loading="isLoading"
        @open-modal="openModal"
        @open-details="openDetailsHandler" />
    </app-data-table>
    <modal
      v-model="isModalShow"
      title="pages.transactions.view_modal_title"
      width="540px">
      <transactions-form
        v-if="formData !== null"
        :form-data="formData" />
    </modal>
  </component>
</template>

<script lang="ts">
import type {
  ICurrency,
  IGetTransactionsApiResponse,
  ITransactionRecordComputed,
  ITransactionsFilter,
  ITransactionsOptions,
  ITransactionsRecord,
} from '@sdk5/shared/requests';
import { CurrencyRequests, TransactionsRequests } from '@sdk5/shared/requests';
import type { ITableFilter } from '@sdk5/shared/types';
import { errorNotification } from '@sdk5/shared/utils';
import { AppDataTable, Modal } from '@sdk5/ui-kit-front-office';
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';

import DashboardContentLayout from '../../../layouts/dashboard/dashboard-content-layout.vue';
import TransactionsForm from '../components/transactions-form.vue';
import TransactionsTable from '../components/transactions-table.vue';
import { transactionsFilters } from '../filters/filters';

@Component({
  components: {
    DashboardContentLayout,
    Modal,
    AppDataTable,
    TransactionsTable,
    TransactionsForm,
  },
})
export default class TransactionsPage extends Vue {
  @Ref('dataTable') readonly refDataTable!: AppDataTable;

  @Prop({ type: Object, default: () => ({}) }) readonly defaultFilter!: ITransactionsFilter;

  @Prop({ type: Boolean, default: true }) readonly isFullPage!: boolean;

  @Prop({ type: Boolean, default: true }) readonly isTitleVisible!: boolean;

  protected tableData: ITransactionsRecord[] = [];

  protected currencyList: ICurrency[] = [];

  protected formData: ITransactionRecordComputed | null = null;

  protected isLoading: boolean = false;

  protected isModalShow: boolean = false;

  protected transactionsFilters: ITableFilter[] = transactionsFilters;

  protected get filters(): ITableFilter[] {
    return this.transactionsFilters.map((el: ITableFilter): ITableFilter => {
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

    this.currencyList = response?.records || [];
  }

  protected async fetchData(params: ITransactionsOptions): Promise<IGetTransactionsApiResponse> {
    this.isLoading = true;

    const { response, error } = await TransactionsRequests.getRecords({
      ...params,
      filter: { ...this.defaultFilter, ...params.filter },
      sort: { createdAt: 'desc' },
    });
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return { response, error };
    }

    return { response, error };
  }

  protected openModal(data: ITransactionsRecord): void {
    this.formData = data;
    this.isModalShow = true;
  }

  protected openDetailsHandler(data: ITransactionRecordComputed) {
    this.$router.push({
      name: 'front-office-transaction-details',
      params: {
        ...this.$route.params,
        transactionId: data.id,
      },
      query: this.$route.query,
    });
  }
}
</script>
