<template>
  <details-layout :title="profileName">
    <template #commission-action>
      <button
        v-if="isAddCommissionBtnVisible"
        class="dotted"
        @click="isCreateCommissionModalShow=true">
        {{ $t('action.add_new_commission') }}
      </button>
    </template>
    <template #commission-table>
      <commission-table
        class="details-table"
        :data="tableDataCommissions"
        :currency="currency"
        :is-loading="isLoadingCommissions"
        @on-edit="updateCommissionModalShow"/>
    </template>
    <template #limits-action>
      <button
        class="dotted"
        @click="isCreateLimitsModalShow=true">
        {{ $t('action.add_limit_rule') }}
      </button>
    </template>
    <template #limits-table>
      <limits-table
        class="details-table"
        :data="tableDataLimits"
        :is-loading="isLoadingLimits"
        @on-edit="updateLimitsModalShow"/>
    </template>
    <modal
      v-model="isCreateCommissionModalShow"
      :title="$t('pages.contracts.modal.create_commission')"
      width="380px">
      <commission-form
        :transactions-types="transactionsTypes"
        :is-loading="isLoadingProviders"
        @submit="onCommissionSubmit"/>
    </modal>
    <modal
      v-model="isUpdateCommissionModalShow"
      :title="$t('pages.contracts.modal.edit_commission')"
      width="380px">
      <commission-form
        :transactions-types="transactionsTypes"
        :is-update="true"
        :form-data="commissionFormData"
        :is-loading="isLoadingProviders"
        @submit="onCommissionSubmit"/>
    </modal>
    <modal
      v-model="isCreateLimitsModalShow"
      :title="$t('pages.contracts.modal.add_limit_settings')"
      width="380px">
      <limits-form
        :transactions-types="transactionsTypes"
        :is-loading="isLoadingProviders"
        @submit="onLimitsSubmit"/>
    </modal>
    <modal
      v-model="isUpdateLimitsModalShow"
      :title="$t('pages.contracts.modal.edit_limit_settings')"
      width="380px">
      <limits-form
        :transactions-types="transactionsTypes"
        :is-update="true"
        :form-data="limitsFormData"
        :is-loading="isLoadingProviders"
        @submit="onLimitsSubmit"/>
    </modal>
  </details-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DetailsLayout from '@/modules/contracts-old/pages/details/layouts/details-layout.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppDataTable from '@/components/data-table/app-data-table.vue';
import Modal from '@/components/modal.vue';
import { ContractsRequests } from '@/services/requests';
import { errorNotification, successNotification } from '@/utils';
import {
  ICommissionBody,
  ICommissionSettingRecord,
  ILimitBody,
  ILimitsRecord,
} from '@/services/requests/contracts/Commissions.types';
import { CatalogModule } from '@/store/modules/dynamic';
import CommissionTable from './components/gate/commission-table.vue';
import CommissionForm from './components/gate/commission-form.vue';
import LimitsForm from './components/limits-form.vue';
import LimitsTable from './components/gate/limits-table.vue';

@Component({
  components: {
    DetailsLayout,
    Modal,
    AppButton,
    AppDataTable,
    CommissionTable,
    LimitsTable,
    CommissionForm,
    LimitsForm,
  },
})
export default class GateDetails extends Vue {

  protected tableDataCommissions: ICommissionBody[] = [];

  protected tableDataLimits: ILimitsRecord[] = [];

  protected isLoadingProviders: boolean = true;

  protected isLoadingCommissions: boolean = true;

  protected isLoadingLimits: boolean = true;

  protected isLoadingModalData: boolean = false;

  protected isCreateCommissionModalShow: boolean = false;

  protected isUpdateCommissionModalShow: boolean = false;

  protected isCreateLimitsModalShow: boolean = false;

  protected isUpdateLimitsModalShow: boolean = false;

  protected currency: string = '';

  protected profileName: string = '';

  protected commissionFormData: Partial<ICommissionBody> = {};

  protected limitsFormData: Partial<ILimitBody> = {};

  protected get catalogsData() {
    const { providerAccountsList } = CatalogModule;
    return { providerAccountsList };
  }

  protected get contractId() {
    return this.$route.params.contractId;
  }

  protected get profileId() {
    return this.$route.params.profileId;
  }

  protected get transactionsTypes() {
    return this.catalogsData.providerAccountsList.find(({ name }) => this.$route.params.profileName === name)?.supportedTransactions || [];
  }

  protected get isAddCommissionBtnVisible() {
    return !!this.transactionsTypes.filter(({ transactionType }) => !(
      this.tableDataCommissions.find(({ txType }) => transactionType === txType))).length;
  }

  protected fetchData(): void {
    this.fetchGateCommissionSettings();
    this.fetchGateCommissionLimits();
  }

  protected async fetchGateCommissionProfile(): Promise<void> {
    const { response, error } = await ContractsRequests.getGateCommissionProfile(this.contractId, this.profileId);

    if (error) {
      errorNotification(error);
      return;
    }
    const { profile } = response || {};
    if (!profile) return;

    this.currency = profile.providerCurrency.code;
    const profileName = this.catalogsData.providerAccountsList.find(({ id }) => id === profile.gateProviderId)?.name || '';
    if (profileName) {
      this.profileName = profileName;
      this.$route.params.profileName = profileName;
    }
  }

  protected async fetchGateCommissionSettings(): Promise<void> {
    this.isLoadingCommissions = true;
    const { response, error } = await ContractsRequests.getGateCommissionSettings(this.contractId, this.profileId);
    this.isLoadingCommissions = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.tableDataCommissions = response?.records.reduce((acc: ICommissionBody[], item: ICommissionSettingRecord): ICommissionBody[] => {
      const {
        txType, collector, value, active,
      } = item;
      const commissionField = collector === 'TOTAL' ? 'totalCommission' : 'providerCommission';
      const current = acc.find(({ txType: fTxType }) => txType === fTxType);
      if (current) {
        current[commissionField] = value;
        return acc;
      }
      return [...acc, { txType, active, [commissionField]: value }];
    }, []) || [];
  }

  protected async fetchGateCommissionLimits(): Promise<void> {
    this.isLoadingLimits = true;
    const { response, error } = await ContractsRequests.getGateCommissionLimits(this.contractId, this.profileId);
    this.isLoadingLimits = false;

    if (error) {
      errorNotification(error);
      return;
    }
    this.tableDataLimits = response?.records || [];
  }

  async created() {
    await Promise.all([
      CatalogModule.fetchProvidersAccounts(),
      this.fetchData(),
      this.fetchGateCommissionProfile(),
    ]);

    this.isLoadingProviders = false;
  }

  protected updateCommissionModalShow(data: ICommissionBody): void {
    this.isUpdateCommissionModalShow = true;
    this.commissionFormData = data;
  }

  protected onCommissionSubmit() {
    this.isCreateCommissionModalShow = false;
    this.isUpdateCommissionModalShow = false;
    this.fetchGateCommissionSettings();
  }

  protected updateLimitsModalShow(data: ILimitBody): void {
    this.isUpdateLimitsModalShow = true;
    this.limitsFormData = data;
  }

  protected async onLimitsSubmit({ isUpdate, form }: { isUpdate: boolean; form: Required<ILimitBody> }) {
    const { contractId, profileId } = this;
    const create = () => (
      ContractsRequests.createGateCommissionLimits(contractId, profileId, form)
    );

    const update = () => {
      const { active, value, id } = form;
      return ContractsRequests.updateGateCommissionLimits(contractId, profileId, id, { active, value });
    };

    const handlerMethod = isUpdate ? update : create;
    const { error } = await handlerMethod();

    if (error) {
      errorNotification(error);
      return;
    }
    successNotification();

    this.isCreateLimitsModalShow = false;
    this.isUpdateLimitsModalShow = false;
    await this.fetchGateCommissionLimits();
  }

}
</script>
