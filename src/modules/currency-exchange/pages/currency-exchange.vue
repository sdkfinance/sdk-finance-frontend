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
      v-if="issuerList.length"
      :tabs="issuerList"/>

    <currency-exchange-table
      :issuer-list="issuerList"
      :data="tableData"
      :is-loading="isTableDataLoading"
      @open-edit-modal="openEditModal"/>

    <modal
      v-model="isEditModalVisible"
      title="pages.currency_exchange.edit_modal_title">
      <currency-exchange-edit-form
        :modal-data="modalData"
        @exchange-rate-changed="onExchangeRateChanged"/>
    </modal>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import MainHead from '@/components/main-head.vue';
import Modal from '@/components/modal.vue';
import CurrencyExchangeEditForm from '@/modules/currency-exchange/components/currency-exchange-edit-form.vue';
import CurrencyExchangeTable from '@/modules/currency-exchange/components/currency-exchange-table.vue';
import CurrencyTabs from '@/modules/currency-exchange/components/currency-tabs.vue';
import { ExchangeRatesRequests, IssuersRequests } from '@/services/requests';
import { IExchangeRatesRecord, IExchangeRatesViewBody } from '@/services/requests/exchange-rates/ExchangeRates.types';
import { IIssuer } from '@/services/requests/issuers/Issuers.types';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification } from '@/utils';

@Component({
  components: {
    CurrencyExchangeTable,
    CurrencyExchangeEditForm,
    CurrencyTabs,
    MainHead,
    Modal,
  },
})

export default class CurrencyExchange extends Vue {

  @Watch('$route.query')
  protected async onRouteQueryChange(): Promise<void> {
    await this.fetchAllExchangeRates();
  }

  protected isLoading: boolean = false;

  protected isTableDataLoading: boolean = false;

  protected tableData: IExchangeRatesRecord[] = [];

  protected issuerList: IIssuer[] = [];

  protected isEditModalVisible: boolean = false;

  protected modalData: IExchangeRatesRecord[] = [];

  protected get currentIssuer(): IIssuer {
    const { query: { currency } } = this.$route;

    const [issuer] = this.issuerList.filter((item) => item.sn === currency);

    return issuer;
  }

  protected async fetchIssuers(): Promise<void> {
    this.isLoading = true;
    const { response, error } = await IssuersRequests.getIssuers();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.issuerList = response?.records || [];
  }

  protected async redirectToFirstIssuer(): Promise<void> {
    const { query: { currency } } = this.$route;

    if (!currency) {
      await this.$router.push(
        { path: '/dashboard/currency-exchange', query: { currency: this.issuerList[0].sn } },
      );
    }
  }

  protected async fetchExchangeRate(issuer: IIssuer): Promise<IPlainObject> {
    const { id } = this.currentIssuer;

    const ratePayload = {
      inIssuerId: String(id),
      outIssuerId: String(issuer?.id),
    };

    const { response, error } = await ExchangeRatesRequests.getRate(ratePayload);

    if (error) {
      errorNotification(error);
    }

    return response?.records?.length === 0
      ? this.setDefaultExchangeRate(ratePayload)
      : response?.records || {};
  }

  protected setDefaultExchangeRate(ratePayload: IExchangeRatesViewBody): IPlainObject {
    const { outIssuerId } = ratePayload;

    const outIssuer = this.issuerList.find((item) => item.id === outIssuerId);

    return {
      rate: null,
      inIssuer: {
        id: this.currentIssuer.id,
        currency: this.currentIssuer.currency,
        sn: this.currentIssuer.sn,
      },
      outIssuer: {
        id: outIssuer?.id,
        currency: outIssuer?.currency,
        sn: outIssuer?.sn,
      },
    };

  }

  protected openEditModal(row: IExchangeRatesRecord[]): void {
    this.modalData = row;
    this.isEditModalVisible = true;
  }

  protected async fetchAllExchangeRates(): Promise<void> {
    this.isTableDataLoading = true;
    const fetchExchangePromiseList: any[] = [];

    this.issuerList.forEach(
      (issuer) => {
        if (issuer.id === this.currentIssuer.id) return;
        fetchExchangePromiseList.push(this.fetchExchangeRate(issuer));
      },
    );

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
    await this.fetchIssuers();
    await this.redirectToFirstIssuer();
    await this.fetchAllExchangeRates();
  }

}
</script>
