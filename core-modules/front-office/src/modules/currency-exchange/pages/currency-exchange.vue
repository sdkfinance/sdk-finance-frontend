<template>
  <section
    v-loading="isLoading"
    class="main-section">
    <main-head>
      <template #title>
        {{ $t('pages.currency_exchange.title') }}
      </template>
    </main-head>

    <currency-tabs
      v-if="currencyList.length"
      :tabs="currencyList" />

    <currency-exchange-table
      :data="tableData"
      :is-loading="isTableDataLoading"
      @open-edit-modal="openEditModal" />

    <modal
      v-model="isEditModalVisible"
      title="pages.currency_exchange.edit_modal_title">
      <currency-exchange-edit-form
        :modal-data="modalData"
        @exchange-rate-changed="onExchangeRateChanged" />
    </modal>
  </section>
</template>

<script lang="ts">
import type { ICurrency, ICurrencyShort, IExchangeRatesRecord, IExchangeRatesViewBody } from '@sdk5/shared/requests';
import { CurrencyRequests, ExchangeRatesRequests } from '@sdk5/shared/requests';
import { errorNotification } from '@sdk5/shared/utils';
import { MainHead, Modal } from '@sdk5/ui-kit-front-office';
import { Component, Vue, Watch } from 'vue-property-decorator';

import CurrencyExchangeEditForm from '../components/currency-exchange-edit-form.vue';
import CurrencyExchangeTable from '../components/currency-exchange-table.vue';
import CurrencyTabs from '../components/currency-tabs.vue';

const COMPONENTS = {
  CurrencyExchangeTable,
  CurrencyExchangeEditForm,
  CurrencyTabs,
  MainHead,
  Modal,
} as const;

@Component({
  name: 'currency-exchange',
  components: COMPONENTS,
})
export default class CurrencyExchange extends Vue {
  static components: typeof COMPONENTS;

  @Watch('$route.query')
  protected async onRouteQueryChange(): Promise<void> {
    await this.fetchAllExchangeRates();
  }

  protected isLoading: boolean = false;

  protected isTableDataLoading: boolean = false;

  protected tableData: IExchangeRatesRecord[] = [];

  protected currencyList: ICurrency[] = [];

  protected isEditModalVisible: boolean = false;

  protected modalData = {} as IExchangeRatesRecord;

  protected get currentCurrency(): ICurrency {
    const {
      query: { currency },
    } = this.$route;

    const [currencyCurrency] = this.currencyList.filter((item) => item.snPrefix === currency);

    return currencyCurrency;
  }

  protected async fetchCurrencies(): Promise<void> {
    this.isLoading = true;
    const { response, error } = await CurrencyRequests.getCurrencies();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.currencyList = response?.records || [];
  }

  protected async redirectToFirstCurrency(): Promise<void> {
    const {
      query: { currency },
    } = this.$route;

    if (!currency && !!this.currencyList[0]) {
      await this.$router.push({ path: '/dashboard/currency-exchange', query: { currency: this.currencyList[0].snPrefix } });
    }
  }

  protected async fetchExchangeRate(currency: ICurrency): Promise<IExchangeRatesRecord[] | IExchangeRatesRecord> {
    const { id } = this.currentCurrency;

    const ratePayload: IExchangeRatesViewBody = {
      inCurrencyId: String(id),
      outCurrencyId: String(currency?.id),
    };

    const { response, error } = await ExchangeRatesRequests.getRate(ratePayload);

    if (error) {
      errorNotification(error);
      return [];
    }

    return response?.records?.length === 0 ? this.setDefaultExchangeRate(ratePayload) : response?.records || {};
  }

  protected setDefaultExchangeRate(ratePayload: IExchangeRatesViewBody) {
    const { outCurrencyId } = ratePayload;

    const outCurrency = this.currencyList.find((item) => item.id === outCurrencyId);

    if (!outCurrency) {
      return {} as IExchangeRatesRecord;
    }

    return {
      rate: null,
      inCurrency: {
        id: this.currentCurrency.id,
        code: this.currentCurrency.code,
        sn: this.currentCurrency.snPrefix,
        symbol: this.currentCurrency.symbol,
      },
      outCurrency: {
        id: outCurrency.id,
        code: outCurrency.code,
        sn: outCurrency.snPrefix,
        symbol: outCurrency.symbol,
      } as ICurrencyShort,
    } as unknown as IExchangeRatesRecord;
  }

  protected openEditModal(row: IExchangeRatesRecord): void {
    this.modalData = row;
    this.isEditModalVisible = true;
  }

  protected async fetchAllExchangeRates(): Promise<void> {
    this.isTableDataLoading = true;
    const fetchExchangePromiseList: ReturnType<typeof this.fetchExchangeRate>[] = [];

    this.currencyList.forEach((currency) => {
      if (currency.id === this.currentCurrency.id) {
        return;
      }

      fetchExchangePromiseList.push(this.fetchExchangeRate(currency));
    });

    const resp = await Promise.all(fetchExchangePromiseList);

    this.tableData = resp.flat(1);
    this.isTableDataLoading = false;
  }

  protected async onExchangeRateChanged(): Promise<void> {
    this.isTableDataLoading = true;

    await this.fetchAllExchangeRates();

    this.isEditModalVisible = false;
    this.isTableDataLoading = false;
  }

  async created() {
    await this.fetchCurrencies();
    await this.redirectToFirstCurrency();
    await this.fetchAllExchangeRates();
  }
}
</script>
