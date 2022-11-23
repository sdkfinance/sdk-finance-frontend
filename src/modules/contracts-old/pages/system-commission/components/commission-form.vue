<template>
  <app-form
    ref="form"
    :loading="isLoadingForm"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      prop="operationFlowId">
      <app-select
        v-model="form.operationFlowId"
        :options="operationFlowList"
        :option-label="({ processType })=> $t(`entity.transaction.type.${processType}`)"
        option-value="id"
        placeholder="placeholder.select.select"
        full-width
        label="form.label.operation_flow"/>
    </app-form-item>
    <app-form-item
      prop="issuerId">
      <app-select
        v-model="form.issuerId"
        :options="issuerList"
        full-width
        option-label="currency.name"
        option-value="id"
        placeholder="placeholder.select.select"
        :label="isMultiCurrency ? 'form.label.source_currency' : 'form.label.currency'">
        <template #option="{scope}">
          {{ scope.currency.name }} ({{ scope.currency.code }})
        </template>
      </app-select>
    </app-form-item>

    <app-form-item
      v-if="isMultiCurrency"
      prop="destinationIssuerId">
      <app-select
        v-model="form.destinationIssuerId"
        :options="filteredIssuerList"
        full-width
        option-label="currency.name"
        option-value="id"
        placeholder="placeholder.select.select"
        :label="isMultiCurrency ? 'form.label.destination_currency' : 'form.label.currency'">
        <template #option="{scope}">
          {{ scope.currency.name }} ({{ scope.currency.code }})
        </template>
      </app-select>
    </app-form-item>

    <app-button
      type="primary"
      native-type="submit"
      full-width>
      {{ $t('action.create') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Ref, Vue, Watch,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import { COMMISSION_DIRECTION_ARRAY } from '@/constants';
import { OnChangeRequiredValidationRule } from '@/rules/validation';
import { ContractsRequests } from '@/services/requests';
import { IOperationFlowRecord } from '@/services/requests/catalogs/Catalogs.types';
import {
  ICommissionRecord,
  ICreateSystemCommission,
} from '@/services/requests/contracts/Commissions.types';
import { IIssuer } from '@/services/requests/issuers/Issuers.types';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification, successNotification } from '@/utils';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppSelect,
    AppButton,
  },
})
export default class CommissionForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Array, default: () => ([]) }) private issuerList!: IIssuer[];

  @Prop({ type: Array, default: () => ([]) }) private operationFlowList!: IOperationFlowRecord[];

  @Prop({ type: Boolean, default: false }) private isLoadingData!: boolean;

  @Prop({ type: Object, default: () => ({}) }) readonly formData!: Required<ICommissionRecord>;

  @Watch('form', { deep: true })
  onFormChanged() {
    if (this.form.destinationIssuerId === this.form.issuerId) {
      this.form.destinationIssuerId = '';
    }
  }

  readonly commissionDirectionList = COMMISSION_DIRECTION_ARRAY;

  protected isLoading: boolean = false;

  protected get isLoadingForm() {
    return this.isLoading || this.isLoadingData;
  }

  protected get filteredIssuerList(): IIssuer[] {
    return this.issuerList.filter(({ id }) => id !== this.form.issuerId);
  }

  protected get isMultiCurrency(): boolean {
    return this.operationFlowList.find(({ id }) => id === this.form.operationFlowId)?.isMultiCurrency || false;
  }

  protected form: ICreateSystemCommission = {
    issuerId: '',
    operationFlowId: '',
    destinationIssuerId: '',
    srcParticipantSpecification: {
      type: 'no',
      value: null,
    },
    destParticipantSpecification: {
      type: 'no',
      value: null,
    },
  };

  protected rules: IPlainObject = {
    issuerId: OnChangeRequiredValidationRule(),
    operationFlowId: OnChangeRequiredValidationRule(),
    destinationIssuerId: OnChangeRequiredValidationRule(),
  }

  @Emit('submit')
  protected onSubmit(): boolean {
    return true;
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    const { contractId } = this.$route.params;

    const { issuerId: sourceIssuerId, ...rest } = this.form;

    const payload = { sourceIssuerId, ...rest };

    const { error } = this.isMultiCurrency
      ? await ContractsRequests.createCommissionMultiCurrency(contractId, payload)
      : await ContractsRequests.createCommission(contractId, this.form);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.onSubmit();
  }

}
</script>
