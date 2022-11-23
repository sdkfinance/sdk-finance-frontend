<template>
  <contracts-layout
    :links="links"
    :is-back-visible="true"
    :is-contract="true">
    <template #action>
      <app-button
        size="small"
        @click="openCreateModal">
        {{ $t('action.add_operation') }}
      </app-button>
    </template>
    <system-commission-table
      :data="tableData"
      :is-loading="isLoading"/>
    <modal
      v-model="isModalShow"
      :title="$t('pages.contracts.modal.add_new_operation_to_the_contract')"
      width="380px">
      <commission-form
        :issuer-list="catalogsData.issuerList"
        :operation-flow-list="catalogsData.operationFlowsList"
        :is-loading-data="isLoadingModalData"
        @submit="onCreated"/>
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
  ICommissionRecord,
  ILimitsRecord,
} from '@/services/requests/contracts/Commissions.types';
import { CatalogModule } from '@/store/modules/dynamic';
import { errorNotification } from '@/utils';

import CommissionForm from './components/commission-form.vue';
import SystemCommissionTable from './components/system-commission-table.vue';

@Component({
  components: {
    ContractsLayout,
    Modal,
    AppButton,
    AppDataTable,
    CommissionForm,
    SystemCommissionTable,
  },
})

export default class ContractsSystemCommissionPage extends Vue {

  protected links = getContractChildrenRoutesByLevel(this.$route, 2)

  protected tableData: ICommissionRecord[] = [];

  protected isLoading: boolean = false;

  protected isLoadingModalData: boolean = false;

  protected isModalShow: boolean = false;

  protected get catalogsData() {
    const { issuerList, operationFlowsList } = CatalogModule;
    return { issuerList, operationFlowsList };
  }

  protected get contractId() {
    return this.$route.params.contractId;
  }

  protected async fetchData(): Promise<void> {
    if (!this.contractId) return;

    this.isLoading = true;

    const { response, error } = await ContractsRequests.getCommissionProfiles(this.contractId);

    if (error) {
      errorNotification(error);
      this.isLoading = false;
      return;
    }

    this.tableData = response?.records || [];
    this.isLoading = false;
  }

  protected async fetchCommissionLimits(profileId: string): Promise<ILimitsRecord[]> {
    if (!profileId || !this.contractId) return [];

    const { response, error } = await ContractsRequests.getCommissionLimits(this.contractId, profileId);

    if (error) {
      errorNotification(error);
      return [];
    }
    return response?.records || [];
  }

  protected async openCreateModal(): Promise<void> {
    this.isModalShow = true;
    if (this.catalogsData.issuerList.length) return;

    this.isLoadingModalData = true;
    await Promise.all([
      CatalogModule.fetchIssuers(),
      CatalogModule.fetchOperationFlows(),
    ]);
    this.isLoadingModalData = false;
  }

  protected onCreated(): void {
    this.isModalShow = false;
    this.fetchData();
  }

  async created() {
    await this.fetchData();
  }

}
</script>
