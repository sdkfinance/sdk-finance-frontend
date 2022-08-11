<template>
  <contracts-layout
    :links="links"
    :is-back-visible="true"
    :default-title="profileName"
    :is-details="true">
    <template #action>
      <app-button
        size="small"
        @click="onAddRule">
        {{ $t('action.add_rule') }}
      </app-button>
    </template>

    <limits-table
      :data="tableDataLimits"
      :is-loading="isLoading"
      @on-edit="updateLimitsModalShow"/>

    <modal
      v-model="isCreateLimitsModalShow"
      title="pages.contracts.modal.create_new_limit_profile"
      width="380px">
      <limits-form
        :is-show-tx-type="false"
        @submit="onLimitsSubmit"/>
    </modal>

    <modal
      v-model="isUpdateLimitsModalShow"
      title="pages.contracts.modal.edit_limit_profile"
      width="380px">
      <limits-form
        :is-update="true"
        :is-show-tx-type="false"
        :form-data="limitsFormData"
        @submit="onLimitsSubmit"/>
    </modal>
  </contracts-layout>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import ContractsLayout from '@/modules/contracts-old/layouts/contacts-layout.vue';
import TabLinks from '@/components/ui-kit/app-tab-links.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import { ContractsRequests } from '@/services/requests';
import { errorNotification, successNotification } from '@/utils';
import Modal from '@/components/modal.vue';
import { ILimitBody, ILimitsRecord } from '@/services/requests/contracts/Commissions.types';
import LimitsTable from '@/modules/contracts-old/pages/details/components/system/limits-table.vue';
import LimitsForm from '@/modules/contracts-old/pages/details/components/limits-form.vue';
import { getContractChildrenRoutesByLevel } from '@/modules/contracts-old/utils/getContractChildrenRoutesByLevel';

@Component({
  components: {
    LimitsTable,
    ContractsLayout,
    TabLinks,
    AppButton,
    Modal,
    LimitsForm,
  },
})
export default class SystemDetailsLimits extends Vue {

  @Ref('form') readonly appForm!: AppForm;

  protected links = getContractChildrenRoutesByLevel(this.$route, 3)

  protected profileName: string = '';

  protected isLoading: boolean = false;

  protected tableDataLimits: ILimitsRecord[] = [];

  protected isCreateLimitsModalShow: boolean = false;

  protected isUpdateLimitsModalShow: boolean = false;

  protected limitsFormData: ILimitBody = {} as ILimitBody;

  protected get contractId(): string {
    return this.$route.params.contractId;
  }

  protected get profileId(): string {
    return this.$route.params.profileId;
  }

  protected async fetchCommissionLimits(): Promise<void> {
    this.isLoading = true;
    const { response, error } = await ContractsRequests.getCommissionLimits(this.contractId, this.profileId);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }
    this.tableDataLimits = response?.records || [];
  }

  protected updateLimitsModalShow(data: ILimitBody): void {
    this.isUpdateLimitsModalShow = true;
    this.limitsFormData = data;
  }

  protected async fetchCommissionProfile(): Promise<void> {
    const { response, error } = await ContractsRequests.getCommission(this.contractId, this.profileId);

    if (error) {
      errorNotification(error);
      return;
    }
    const { profile } = response || {};
    if (!profile) return;

    this.profileName = this.$t(`entity.transaction.type.${profile.flow.processType}`).toString();
    this.$route.params.profileName = this.profileName;
  }

  protected async onLimitsSubmit({ isUpdate, form }: { isUpdate: boolean; form: ILimitBody }) {
    const { contractId, profileId } = this;
    const create = () => {
      delete form.txType;
      delete form.productId;
      return ContractsRequests.createCommissionLimits(contractId, profileId, form);
    };

    const update = () => {
      const { active, value, id } = form as Required<ILimitBody>;
      return ContractsRequests.updateCommissionLimits(contractId, profileId, id, { active, value });
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
    await this.fetchCommissionLimits();
  }

  protected created(): void {
    this.fetchCommissionProfile();
    this.fetchCommissionLimits();
  }

  protected onAddRule(): void {
    this.isCreateLimitsModalShow = true;
  }

}
</script>
