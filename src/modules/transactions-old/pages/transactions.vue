<template>
  <component
    :is="isFullPage ? 'dashboard-content-layout': 'div'"
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
        @open-modal="openModal"/>
    </app-data-table>
    <modal
      v-model="isModalShow"
      title="pages.transactions.view_modal_title"
      width="540px">
      <transactions-form
        :form-data="formData"/>
    </modal>
  </component>
</template>

<script lang="ts">
import {
  Component, Ref, Prop, Vue,
} from 'vue-property-decorator';
import AppDataTable from '@/components/data-table/app-data-table.vue';
import Modal from '@/components/modal.vue';
import { TransactionsRequests, CurrencyRequests } from '@/services/requests';
import { errorNotification } from '@/utils';
import {
  ITransactionsRecord,
  ITransactionsOptions,
  ITransactionsFilter,
  IGetTransactionsApiResponse,
} from '@/services/requests/transactions/Transactions.types';
import { ITableFilter } from '@/types/interfaces/TableFilters.interface';
import { ICurrency } from '@/services/requests/currencies/Currency.types';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import TransactionsTable from '../components/transactions-table.vue';
import TransactionsForm from '../components/transactions-form.vue';
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

  @Ref('dataTable') readonly refDataTable!: AppDataTable

  @Prop({ type: Object, default: () => ({}) }) readonly defaultFilter!: ITransactionsFilter;

  @Prop({ type: Boolean, default: true }) readonly isFullPage!: boolean;

  @Prop({ type: Boolean, default: true }) readonly isTitleVisible!: boolean;

  protected tableData: ITransactionsRecord[] = [];

  protected currencyList: ICurrency[] = [];

  protected formData: Partial<ITransactionsRecord> = {};

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

    this.currencyList = response?.currencies || [];

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

}
</script>
