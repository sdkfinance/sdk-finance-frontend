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
        label="form.label.currency">
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
  Component, Prop, Emit, Ref, Vue,
} from 'vue-property-decorator';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { OnChangeRequiredValidationRule } from '@/rules/validation';
import { IPlainObject } from '@/types/interfaces';
import { COMMISSION_DIRECTION_ARRAY } from '@/constants';
import {
  ICommissionRecord,
  ICreateSystemCommission,
} from '@/services/requests/contracts/Commissions.types';
import { ContractsRequests } from '@/services/requests';
import { errorNotification, successNotification } from '@/utils';
import { IIssuer } from '@/services/requests/issuers/Issuers.types';
import { IOperationFlowRecord } from '@/services/requests/catalogs/Catalogs.types';

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

  readonly commissionDirectionList = COMMISSION_DIRECTION_ARRAY;

  protected isLoading: boolean = false;

  protected get isLoadingForm() {
    return this.isLoading || this.isLoadingData;
  }

  protected form: ICreateSystemCommission = {
    issuerId: '',
    operationFlowId: '',
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
  }

  @Emit('submit')
  protected onSubmit(): boolean {
    return true;
  }

  protected create(contractId: string) {
    return ContractsRequests.createCommission(contractId, this.form);
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    const { contractId } = this.$route.params;

    const { error } = await ContractsRequests.createCommission(contractId, this.form);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.onSubmit();
  }

}
</script>
