<template>
  <dashboard-content-layout is-secondary>
    <template #title>
      {{ $t('pages.currency.title') }}
    </template>
    <template #actions>
      <app-button
        size="small"
        @click="openCreateCurrencyModal">
        {{ $t('action.add_new') }}
      </app-button>
    </template>
    <app-tab-links
      secondary
      :tabs="tabs"/>
    <currency-table
      :data="tableData"
      :is-loading="isLoading"/>
    <modal
      v-model="isCreateCurrencyModalVisible"
      title="pages.currency.view_modal_title"
      width="380px">
      <create-form @created="onCreatedCurrency"/>
    </modal>
  </dashboard-content-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppButton from '@/components/ui-framework/app-button.vue';
import Modal from '@/components/modal.vue';
import { CurrencyRequests } from '@/services/requests';
import { errorNotification } from '@/utils';
import { ICurrency } from '@/services/requests/currencies/Currency.types';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import AppTabLinks from '@/components/ui-kit/app-tab-links.vue';
import { CURRENCIES_CHILDREN } from '@/modules/currency/routes';
import CreateForm from '../components/create-form.vue';
import CurrencyTable from '../components/currency-table.vue';

@Component({
  components: {
    AppTabLinks,
    DashboardContentLayout,
    AppButton,
    CurrencyTable,
    CreateForm,
    Modal,
  },
})
export default class CurrencyPage extends Vue {

  protected tableData: ICurrency[] = [];

  protected tabs = CURRENCIES_CHILDREN;

  protected isLoading: boolean = false;

  protected isCreateCurrencyModalVisible: boolean = false;

  protected async fetchCurrency(): Promise<void> {

    this.isLoading = true;
    const { response, error } = await CurrencyRequests.getCurrencies();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.tableData = response?.currencies || [];
  }

  protected openCreateCurrencyModal(): void {
    if (process.env.VUE_APP_DEMO_MODE) {
      errorNotification('notification.no_available_on_demo_mode');
      return;
    }

    this.isCreateCurrencyModalVisible = true;
  }

  protected onCreatedCurrency(): void {
    this.isCreateCurrencyModalVisible = false;
    this.fetchCurrency();
  }

  protected created(): void {
    this.fetchCurrency();
  }

}
</script>
