<template>
  <contracts-layout
    :links="links"
    :is-back-visible="true"
    :is-contract="true">
    <template #action>
      <app-button
        size="small"
        @click="openCreateModal">
        {{ $t('action.add_provider') }}
      </app-button>
    </template>
    <provider-commission-table
      :data="tableData"
      :is-loading="isLoading"/>
    <modal
      v-model="isModalShow"
      :title="$t('pages.contracts.modal.add_new_provider')"
      width="380px">
      <create-commission-form
        :currency-list="catalogsData.currencyList"
        :providers-list="catalogsData.providerAccountsList"
        :is-loading-data="isLoadingModalData"
        @created="onCreated"/>
    </modal>
  </contracts-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import AppDataTable from '@/components/data-table/app-data-table.vue';
import Modal from '@/components/modal.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import ContractsLayout from '@/modules/contracts-old/layouts/contacts-layout.vue';
import { getContractChildrenRoutesByLevel } from '@/modules/contracts-old/utils/getContractChildrenRoutesByLevel';
import { ContractsRequests } from '@/services/requests';
import {
  IProviderRecord, IProviderTableRecord,
} from '@/services/requests/contracts/Commissions.types';
import { CatalogModule } from '@/store/modules/dynamic';
import { errorNotification } from '@/utils';

import CreateCommissionForm from './components/create-commission-form.vue';
import ProviderCommissionTable from './components/provider-commission-table.vue';

@Component({
  components: {
    ContractsLayout,
    Modal,
    AppButton,
    AppDataTable,
    CreateCommissionForm,
    ProviderCommissionTable,
  },
})
export default class ContractsProviderCommissionPage extends Vue {

  protected links = getContractChildrenRoutesByLevel(this.$route, 2)

  protected tableData: IProviderTableRecord[] = [];

  protected isLoading: boolean = true;

  protected isLoadingModalData: boolean = false;

  protected isModalShow: boolean = false;

  protected get catalogsData() {
    const { currencyList, providerAccountsList } = CatalogModule;
    return { currencyList, providerAccountsList };
  }

  protected get contractId() {
    return this.$route.params.contractId;
  }

  protected async fetchData(): Promise<void> {
    if (!this.contractId) return;

    this.isLoading = true;

    const { response, error } = await ContractsRequests.getGateCommissionProfiles(this.contractId);

    if (error) {
      errorNotification(error);
      this.isLoading = false;
      return;
    }
    const records = response?.records || [];

    await this.createTableData(records);
    this.isLoading = false;
  }

  protected async openCreateModal(): Promise<void> {
    this.isModalShow = true;
    if (this.catalogsData.currencyList?.length) return;

    this.isLoadingModalData = true;
    await CatalogModule.fetchCurrency();
    this.isLoadingModalData = false;
  }

  protected onCreated(): void {
    this.isModalShow = false;
    this.fetchData();
  }

  protected async createTableData(records: IProviderRecord[]): Promise<void> {
    this.tableData = records.map((record: IProviderRecord): IProviderTableRecord => ({
      id: record.id,
      provider: this.catalogsData.providerAccountsList.find(({ id }) => id === record.gateProviderId)?.name || '',
      currency: record?.providerCurrency?.code,
    }));
  }

  async created() {
    await CatalogModule.fetchProvidersAccounts();
    await this.fetchData();
  }

}
</script>
