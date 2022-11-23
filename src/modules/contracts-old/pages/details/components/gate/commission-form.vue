<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      v-if="!isUpdate"
      prop="txType">
      <app-select
        v-model="form.txType"
        :options="transactionsTypes"
        option-label="transactionType"
        option-value="transactionType"
        placeholder="placeholder.select.select_type"
        full-width
        label="form.label.transaction_type"/>
    </app-form-item>
    <p><strong>{{ $t('form.label.provider_commission') }}</strong></p>
    <app-form-item
      prop="providerCommission.type">
      <app-select
        v-model="form.providerCommission.type"
        :options="commissionTypesList"
        option-label="label"
        option-value="value"
        placeholder="placeholder.select.select_type"
        full-width
        label="form.label.type"/>
    </app-form-item>
    <app-form-item
      v-if="isProviderFixedVisible"
      prop="providerCommission.valueFixed">
      <app-input
        v-model="form.providerCommission.valueFixed"
        placeholder="placeholder.input.input_value"
        label="form.label.fixed_value"/>
    </app-form-item>
    <app-form-item
      v-if="isProviderPercentVisible"
      prop="providerCommission.valuePercent">
      <app-input
        v-model="form.providerCommission.valuePercent"
        placeholder="placeholder.input.input_value"
        label="form.label.percent_value"/>
    </app-form-item>
    <p><strong>{{ $t('form.label.total_commission') }}</strong></p>
    <app-form-item
      prop="totalCommission.type">
      <app-select
        v-model="form.totalCommission.type"
        :options="commissionTypesList"
        option-label="label"
        option-value="value"
        placeholder="placeholder.select.select_type"
        full-width
        label="form.label.type"/>
    </app-form-item>
    <app-form-item
      v-if="isTotalFixedVisible"
      prop="totalCommission.valueFixed">
      <app-input
        v-model="form.totalCommission.valueFixed"
        placeholder="placeholder.input.input_value"
        label="form.label.fixed_value"/>
    </app-form-item>
    <app-form-item
      v-if="isTotalPercentVisible"
      prop="totalCommission.valuePercent">
      <app-input
        v-model="form.totalCommission.valuePercent"
        placeholder="placeholder.input.input_value"
        label="form.label.percent_value"/>
    </app-form-item>

    <app-form-item prop="active">
      <app-switch
        v-model="form.active"
        label="form.label.active"/>
    </app-form-item>

    <app-button
      full-width>
      {{ isUpdate ? $t('action.update') : $t('action.create') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Ref, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppSwitch from '@/components/ui-framework/app-switch.vue';
import { COMMISSION_TYPES_ARRAY } from '@/constants';
import { amountRulesParams, percentRulesParams } from '@/modules/contracts-old/constants';
import { NumberRangeValidationRule, OnChangeRequiredValidationRule } from '@/rules/validation';
import { ContractsRequests } from '@/services/requests';
import { ICommissionBody } from '@/services/requests/contracts/Commissions.types';
import { IPlainObject } from '@/types/interfaces';
import { cloneDeep, errorNotification, successNotification } from '@/utils';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppSelect,
    AppButton,
    AppSwitch,
  },
})
export default class CommissionForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Boolean, default: false }) readonly isLoading!: boolean;

  @Prop({ type: Boolean, default: false }) readonly isUpdate!: boolean;

  @Prop({ type: Array, required: true }) readonly transactionsTypes!: string[];

  @Prop({ type: Object, default: () => ({}) }) readonly formData!: Required<ICommissionBody>;

  readonly commissionTypesList = COMMISSION_TYPES_ARRAY;

  protected get isProviderPercentVisible() {
    return this.form.providerCommission?.type?.indexOf('percent') !== -1;
  }

  protected get isProviderFixedVisible() {
    return this.form.providerCommission?.type?.indexOf('fixed') !== -1;
  }

  protected get isTotalPercentVisible() {
    return this.form.totalCommission?.type?.indexOf('percent') !== -1;
  }

  protected get isTotalFixedVisible() {
    return this.form.totalCommission?.type?.indexOf('fixed') !== -1;
  }

  protected form: Required<ICommissionBody> = {
    txType: null,
    providerCommission: {
      type: null,
      valuePercent: null,
      valueFixed: null,
    },
    totalCommission: {
      type: null,
      valuePercent: null,
      valueFixed: null,
    },
    active: true,
  };

  protected rules: IPlainObject = {
    txType: OnChangeRequiredValidationRule(),
    providerCommission: {
      type: OnChangeRequiredValidationRule(),
      valuePercent: NumberRangeValidationRule(...percentRulesParams),
      valueFixed: NumberRangeValidationRule(...amountRulesParams),
    },
    totalCommission: {
      type: OnChangeRequiredValidationRule(),
      valuePercent: NumberRangeValidationRule(...percentRulesParams),
      valueFixed: NumberRangeValidationRule(...amountRulesParams),
    },
  }

  @Emit('submit')
  protected onSubmit(): boolean {
    return true;
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    const { contractId, profileId } = this.$route.params;
    this.resetCommissionFields();

    const { error } = await ContractsRequests.createGateCommission(contractId, profileId, this.form);

    if (error) {
      errorNotification(error);

      return;
    }
    successNotification();
    this.onSubmit();
  }

  protected resetCommissionFields() {
    const commissionFields = ['totalCommission', 'providerCommission'] as const;
    const reset = (commission: typeof commissionFields[number]): void => {
      const { type } = this.form[commission];
      if (type === 'zero') {
        this.form[commission].valuePercent = null;
        this.form[commission].valueFixed = null;
      } else if (type === 'fixed') {
        this.form[commission].valuePercent = null;
      } else if (type === 'percent') {
        this.form[commission].valueFixed = null;
      }
    };

    commissionFields.forEach(reset);
  }

  created() {
    if (this.isUpdate) {
      this.form = cloneDeep(this.formData);
    }
  }

}
</script>
