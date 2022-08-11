<template>
  <contracts-layout
    v-loading="isLoading"
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

    <app-form
      v-for="(commission, idx) in commissionData"
      :ref="`form-${idx}`"
      :key="commission.id"
      class="mb-36"
      :model="commission"
      :rules="rules">
      <app-info-block
        :data="commission"
        @edit="editCommissionRule"/>
      <system-details-table
        :commission-data="commission.conditions"
        @delete="onConditionDelete($event, commission.id)"
        @add="onConditionAdd(commission.id)"
        @save="onConditionSave($event, commission.id, `form-${idx}`)"/>
    </app-form>

    <modal
      v-model="isCreateCommissionModalShow"
      title="pages.contracts.modal.create_commission_rule"
      width="380px">
      <commission-rule-form
        @submitted="refreshData"/>
    </modal>

    <modal
      v-model="isUpdateCommissionModalShow"
      title="pages.contracts.modal.edit_commission_rule"
      width="380px">
      <commission-rule-form
        :is-update="true"
        :form-data="commissionFormData"
        @delete="onDeleteRule"
        @submitted="refreshData"/>
    </modal>

    <confirm-modal
      ref="confirmDeleteRuleModal"
      :loading="isLoading"
      title="placeholder.confirm_title"/>
  </contracts-layout>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import ContractsLayout from '@/modules/contracts-old/layouts/contacts-layout.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import SystemDetailsTable from '@/modules/contracts-old/pages/details/components/system/system-details-table.vue';
import { IPlainObject } from '@/types/interfaces';
import { OnChangeRequiredValidationRule, SimpleRequiredValidationRule } from '@/rules/validation';
import AppForm from '@/components/ui-framework/app-form.vue';
import { ContractsRequests } from '@/services/requests';
import { errorNotification, successNotification } from '@/utils';
import AppInfoBlock from '@/modules/contracts-old/components/app-info-block.vue';
import Modal from '@/components/modal.vue';
import CommissionRuleForm from '@/modules/contracts-old/pages/details/components/system/commission-rule-form.vue';
import {
  ICommissionRule,
  ICommissionRuleCondition,
  ICommissionRuleConditionPayload,
} from '@/services/requests/contracts/Commissions.types';
import { getContractChildrenRoutesByLevel } from '@/modules/contracts-old/utils/getContractChildrenRoutesByLevel';
import ConfirmModal from '@/components/confirm-modal.vue';

@Component({
  components: {
    ConfirmModal,
    CommissionRuleForm,
    AppInfoBlock,
    ContractsLayout,
    AppButton,
    SystemDetailsTable,
    AppForm,
    Modal,
  },
})
export default class SystemDetailsRules extends Vue {

  @Ref('form') readonly appForm!: AppForm;

  @Ref('confirmDeleteRuleModal') readonly confirmDeleteRuleModal!: ConfirmModal;

  protected links = getContractChildrenRoutesByLevel(this.$route, 3)

  protected profileName: string = '';

  protected isLoading: boolean = false;

  protected isUpdateCommissionModalShow: boolean = false;

  protected isCreateCommissionModalShow: boolean = false;

  protected commissionFormData: ICommissionRule = {} as ICommissionRule;

  protected commissionData: ICommissionRule[] = [];

  protected get contractId(): string {
    return this.$route.params.contractId;
  }

  protected get profileId(): string {
    return this.$route.params.profileId;
  }

  protected get rules(): IPlainObject {
    return {
      conditions: (data: ICommissionRuleCondition) => ({
        beginAmount: SimpleRequiredValidationRule(),
        endAmount: SimpleRequiredValidationRule(),
        value: {
          type: OnChangeRequiredValidationRule(),
          valueFixed: !['zero', 'percent'].includes(data.value.type) ? SimpleRequiredValidationRule() : null,
          valuePercent: !['zero', 'fixed'].includes(data.value.type) ? SimpleRequiredValidationRule() : null,
        },
      }),
    };
  }

  protected created(): void {
    this.fetchCommissionProfile();
    this.fetchCommissionRules();
  }

  protected refreshData(): void {
    this.isCreateCommissionModalShow = false;
    this.isUpdateCommissionModalShow = false;
    this.fetchCommissionRules();
  }

  protected async fetchCommissionRules(): Promise<void> {
    this.isLoading = true;
    const today = new Date();
    const { response, error } = await ContractsRequests.getCommissionRules(this.contractId, this.profileId, {
      date: today,
      filterCriteria: 'FROM_DATE',
    });
    this.isLoading = false;

    if (error) {
      errorNotification(error);
    }

    this.commissionData = response?.records || [];
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

  protected editCommissionRule(data: ICommissionRule): void {
    this.commissionFormData = data;
    this.isUpdateCommissionModalShow = true;
  }

  protected async onConditionUpdate(contractId: string, profileId: string, ruleId: string, conditionId: string,
    payload: ICommissionRuleConditionPayload): Promise<void> {
    const { error } = await ContractsRequests.updateCondition(contractId, profileId, ruleId, conditionId, payload);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    await this.fetchCommissionRules();
  }

  protected async onConditionCreate(contractId: string, profileId: string, ruleId: string,
    payload: ICommissionRuleConditionPayload): Promise<void> {
    const { error } = await ContractsRequests.createCondition(contractId, profileId, ruleId, payload);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    await this.fetchCommissionRules();
  }

  protected async onConditionSave(row: ICommissionRuleCondition, ruleId: string, formName: string): Promise<void> {
    const [form] = this.$refs[formName] as AppForm[];
    const isValid = await form.validate();

    if (!isValid) {
      return;
    }

    const {
      beginAmount,
      endAmount,
      value: {
        valuePercent,
        valueFixed,
        type,
      },
    } = row;

    const payload: ICommissionRuleConditionPayload = {
      beginAmount: Number(beginAmount),
      endAmount: Number(endAmount),
      commission: {
        type,
        valuePercent,
        valueFixed,
      },
    };

    if (type === 'zero') {
      payload.commission.valuePercent = null;
      payload.commission.valueFixed = null;
    } else if (type === 'fixed') {
      payload.commission.valuePercent = null;
    } else if (type === 'percent') {
      payload.commission.valueFixed = null;
    }

    if (row.id) {
      await this.onConditionUpdate(this.contractId, this.profileId, ruleId, row.id, payload);
      return;
    }

    await this.onConditionCreate(this.contractId, this.profileId, ruleId, payload);
  }

  protected async onConditionDelete(row: ICommissionRuleCondition, ruleId: string): Promise<void> {
    if (!row.id) {
      this.commissionData = this.commissionData.map((commission) => {
        if (commission.id === ruleId) {
          commission.conditions = commission.conditions.filter((condition) => condition !== row);
        }
        return commission;
      });
      return;
    }

    const { error } = await ContractsRequests.deleteCondition(this.contractId, this.profileId, ruleId, row.id);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    await this.fetchCommissionRules();
  }

  protected onConditionAdd(ruleId: string): void {
    const rule = this.commissionData.find(({ id }: ICommissionRule) => id === ruleId);

    if (!rule) {
      return;
    }

    const emptyCondition = {
      beginAmount: '',
      endAmount: '',
      id: null,
      value: {
        type: 'zero',
        valueFixed: null,
        valuePercent: null,
      },
    };

    rule.conditions.push(emptyCondition);
  }

  protected onAddRule(): void {
    this.isCreateCommissionModalShow = true;
  }

  protected async onDeleteRule(data: ICommissionRule): Promise<void> {
    const isDelete = await this.confirmDeleteRuleModal.open();
    if (!isDelete) {
      return;
    }

    const ruleId = data.id;
    this.isLoading = true;
    const { error } = await ContractsRequests.deleteCommissionRule(this.contractId, this.profileId, ruleId);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.isUpdateCommissionModalShow = false;
    await this.fetchCommissionRules();

  }

}
</script>
