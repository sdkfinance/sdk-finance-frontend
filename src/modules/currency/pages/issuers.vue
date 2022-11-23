<template>
  <dashboard-content-layout is-secondary>
    <template #title>
      {{ $t('pages.currency.title') }}
    </template>
    <template #actions>
      <app-button
        size="small"
        @click="openCreateModal">
        {{ $t('action.add_new') }}
      </app-button>
    </template>
    <app-tab-links
      secondary
      :tabs="tabs"/>
    <issuers-table
      :data="tableData"
      :is-loading="isLoading"/>
    <modal
      v-model="isCreateIssuerModalVisible"
      title="pages.issuers.view_modal_title"
      width="380px">
      <create-issuer-form
        :currency-list="currencyList"
        :is-loading-currency="isLoadingCurrency"
        @created="onCreatedIssuer"/>
    </modal>
  </dashboard-content-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Modal from '@/components/modal.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppTabLinks from '@/components/ui-kit/app-tab-links.vue';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import { CURRENCIES_CHILDREN } from '@/modules/currency/routes';
import { CurrencyRequests, IssuersRequests } from '@/services/requests';
import { ICurrency } from '@/services/requests/currencies/Currency.types';
import { IIssuer } from '@/services/requests/issuers/Issuers.types';
import { errorNotification } from '@/utils';

import CreateIssuerForm from '../components/create-issuer-form.vue';
import IssuersTable from '../components/issuers-table.vue';

@Component({
  components: {
    AppTabLinks,
    DashboardContentLayout,
    AppButton,
    IssuersTable,
    CreateIssuerForm,
    Modal,
  },
})
export default class IssuersPage extends Vue {

  protected tableData: IIssuer[] = [];

  protected isLoading: boolean = false;

  protected isLoadingCurrency: boolean = false;

  protected isCreateIssuerModalVisible: boolean = false;

  protected currencyList: ICurrency[] = [];

  protected tabs = CURRENCIES_CHILDREN;

  protected async fetchIssuers(): Promise<void> {

    this.isLoading = true;
    const { response, error } = await IssuersRequests.getIssuers();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.tableData = response?.records || [];
  }

  protected async fetchCurrency(): Promise<void> {

    this.isLoadingCurrency = true;
    const { response, error } = await CurrencyRequests.getCurrencies();
    this.isLoadingCurrency = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.currencyList = response?.currencies || [];
  }

  protected async openCreateModal(): Promise<void> {
    this.isCreateIssuerModalVisible = true;
    if (this.currencyList.length) return;
    await this.fetchCurrency();
  }

  protected onCreatedIssuer(): void {
    this.isCreateIssuerModalVisible = false;
    this.fetchIssuers();
  }

  protected created(): void {
    this.fetchIssuers();
  }

}
</script>
