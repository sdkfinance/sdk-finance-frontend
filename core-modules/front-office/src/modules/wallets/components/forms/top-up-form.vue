<template>
  <app-form
    ref="form"
    :loading="isFormLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <template v-if="!isNextStepVisible && !isTopUpFinished">
      <app-form-item prop="senderCoin">
        <app-select
          v-model="form.coin"
          :options="coinsList"
          option-label="name"
          option-value="serial"
          placeholder="placeholder.select.choose_wallet"
          full-width
          label="form.label.wallet"
          @change="onMainChange()" />
      </app-form-item>

      <app-form-item prop="topUpMethod">
        <app-select
          v-model="form.topUpMethod"
          :options="topUpOptions"
          placeholder="placeholder.select.choose_top_up_method"
          option-label="label"
          option-value="value"
          full-width
          label="form.label.top_up_method"
          @change="onTopUpChoose" />
      </app-form-item>

      <app-form-item
        v-if="form.topUpMethod === 'provider'"
        prop="accountMethod">
        <app-select
          v-model="form.accountMethod"
          :options="gateMethodList"
          option-label="gateProvider.gate.name"
          value-key="gateProvider.gate.name"
          placeholder="placeholder.select.choose_provider"
          full-width
          label="form.label.provider_options"
          @change="commission = null" />
      </app-form-item>

      <app-form-item prop="amount">
        <app-input
          v-model="form.amount"
          placeholder="placeholder.input.input_amount"
          label="form.label.amount" />
      </app-form-item>

      <commission-block
        v-if="isCommissionCalculated"
        :commission="commission" />
    </template>

    <dynamic-form
      v-if="isNextStepVisible && !isTopUpFinished"
      ref="dynamicProviderForm"
      :fields="dynamicProviderForm.fields" />

    <buttons-group
      v-if="!isTopUpFinished"
      is-vertical
      offset-top="10">
      <app-button
        v-if="isNextStepVisible"
        type="primary"
        full-width
        native-type="button"
        @click.native.prevent="prevStep">
        {{ $t('action.back') }}
      </app-button>

      <app-button
        v-if="isNextAvailable"
        type="primary"
        full-width
        native-type="button"
        @click.native.prevent="nextStep">
        {{ $t('action.next') }}
      </app-button>

      <app-button
        v-else
        type="primary"
        native-type="submit"
        full-width>
        {{ $t('action.top_up') }}
      </app-button>
    </buttons-group>

    <template v-if="isTopUpFinished">
      <commission-block :commission="commission" />
    </template>
  </app-form>
</template>

<script lang="ts">
// @ts-nocheck
import type { ITopUpOption } from '@sdk5/shared/constants';
import { TOP_UP_METHODS } from '@sdk5/shared/constants';
import type { ICoin, IGateSubmitPayerBody, IPaymentProviderRecord, ITopUpForm } from '@sdk5/shared/requests';
import { GateRequests, TopUpRequests } from '@sdk5/shared/requests';
import type { IDynamicField, IPlainObject } from '@sdk5/shared/types';
import { errorNotification } from '@sdk5/shared/utils';
import { OnChangeRequiredValidationRule, SimpleNumberRangeValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppButtonsGroup, AppForm, AppFormItem, AppInput, AppSelect } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator';

import DynamicForm from '../../../../components/dynamic-form.vue';
import type { IWithdrawalCommissionBlock } from '../../types/Withdrawal.types';
import CommissionBlock from './withdrawal-form/commission-block.vue';

const COMPONENTS = {
  CommissionBlock,
  AppForm,
  AppFormItem,
  AppInput,
  AppSelect,
  AppButton,
  ButtonsGroup: AppButtonsGroup,
  DynamicForm,
} as const;

@Component({
  name: 'top-up-form',
  components: COMPONENTS,
})
export default class TopUpForm extends Vue {
  static components: typeof COMPONENTS;

  @Ref('form') readonly appForm!: AppForm;

  @Ref('dynamicProviderForm') readonly appDynamicProviderForm!: DynamicForm;

  @Prop({ type: Array as PropType<ICoin[]>, default: () => [] }) readonly coinsList!: ICoin[];

  @Prop({ type: Boolean, default: false }) readonly isLoadingData!: boolean;

  $props!: {
    coinsList?: ICoin[];
    isLoadingData?: boolean;
  };

  protected isLoading: boolean = false;

  protected isNextStepVisible: boolean = false;

  protected isTopUpFinished: boolean = false;

  protected dynamicProviderForm: { txId: string; fields: IDynamicField[]; optionName: string } | null = null;

  protected commission: IWithdrawalCommissionBlock | null = null;

  protected gateMethodList: IPaymentProviderRecord[] = [];

  protected form: ITopUpForm = {
    accountMethod: null,
    coin: '',
    amount: null,
    txType: 'TOPUP',
    topUpMethod: null,
  };

  protected topUpOptions: ITopUpOption[] = TOP_UP_METHODS;

  protected rules: IPlainObject = {
    coin: OnChangeRequiredValidationRule(),
    accountMethod: OnChangeRequiredValidationRule(),
    topUpMethod: OnChangeRequiredValidationRule(),
    amount: SimpleNumberRangeValidationRule(),
  };

  protected get isFormLoading() {
    return this.isLoadingData || this.isLoading;
  }

  protected get isCommissionCalculated() {
    return !!this.commission?.amountToSend;
  }

  protected get hasDynamicForm() {
    return !!this.dynamicProviderForm?.fields?.length;
  }

  protected get isNextAvailable() {
    if (this.isCommissionCalculated && import.meta.env.VUE_APP_DEMO_MODE) {
      return false;
    }

    return !this.isCommissionCalculated || (!this.isNextStepVisible && !this.hasDynamicForm);
  }

  @Emit('submit')
  protected onSubmit(): boolean {
    return true;
  }

  protected checkError(error: any): boolean {
    if (error) {
      errorNotification(error);
    }

    return !!error;
  }

  protected nextStep(): void {
    if (!this.isCommissionCalculated) {
      this.calculateCommission();
      return;
    }

    this.handleForm();
  }

  protected prevStep() {
    this.isNextStepVisible = false;
    this.onMainChange();
  }

  protected async onMainChange(): Promise<void> {
    await this.$nextTick();

    this.commission = null;
    this.dynamicProviderForm = null;
    this.form.accountMethod = null;
    await this.fetchMethods();
  }

  protected async fetchMethods(): Promise<void> {
    this.gateMethodList = [];
    this.isLoading = true;

    await this.$nextTick();

    const { txType, coin: serial } = this.form;

    const { response, error } = await GateRequests.getMethods({ serial, txType });
    this.isLoading = false;

    if (error) {
      errorNotification(error);
    }

    this.gateMethodList = response?.records || [];
  }

  protected async onDynamicFormSubmit(): Promise<void> {
    const { isValid, fields } = await this.appDynamicProviderForm.validate();
    const { txId, optionName } = this.dynamicProviderForm || {};

    if (!isValid || !txId || !optionName) {
      return;
    }

    await this.submitPayer(txId, { optionName, fields });
  }

  protected async submitPayer(txId: string, data: IGateSubmitPayerBody): Promise<void> {
    const { response, error } = await GateRequests.submitPayer(txId, data);

    if (this.checkError(error) || !response) {
      return;
    }

    this.isTopUpFinished = true;
    this.onSubmit();
  }

  protected async formSubmit(): Promise<void> {
    const { amount, coin, accountMethod, txType: type } = this.form;

    if (!accountMethod || !amount || !coin || !type) {
      return;
    }

    const { gateProvider, way } = accountMethod;
    const sendData = {
      amount,
      coin,
      method: { gateProviderId: gateProvider.id, way },
      type,
    };

    const { response: responseTx, error: errorTx } = await GateRequests.createTransaction(sendData);

    if (this.checkError(errorTx) || !responseTx) {
      return;
    }

    const txId = responseTx.transaction.id;

    const { response: responsePayer, error: errorPayer } = await GateRequests.getPayerFields(txId);

    if (this.checkError(errorPayer) || !responsePayer) {
      return;
    }

    const [{ fields, name: optionName }] = responsePayer.options;

    if (!fields.length) {
      await this.submitPayer(txId, { fields: [], optionName });
      return;
    }

    if (fields.length === 1 && fields[0].name === 'phone' && import.meta.env.VUE_APP_DEMO_MODE) {
      await this.submitPayer(txId, {
        optionName,
        fields: {
          phone: '380999999999',
        },
      });
      return;
    }

    this.dynamicProviderForm = {
      txId,
      fields,
      optionName,
    };
    this.isNextStepVisible = true;
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    this.isLoading = true;

    if (this.hasDynamicForm) {
      await this.onDynamicFormSubmit();
    } else {
      await this.formSubmit();
    }

    this.isLoading = false;
  }

  protected submitMethods: { [key: string]: Function } = {
    provider: GateRequests.calculateCommission,
    bank: TopUpRequests.calculateTopUpCommission,
  };

  protected async calculateCommission(): Promise<void> {
    const { accountMethod, coin: serial, amount, txType, topUpMethod } = this.form;
    const isProvider = topUpMethod === 'provider';

    const isValid = await this.appForm.validate();

    if (!isValid || !serial || !amount || !txType || !topUpMethod) {
      return;
    }

    if (isProvider && !accountMethod) {
      return;
    }

    let payload;

    if (isProvider) {
      payload = {
        serial,
        amount,
        txType,
        gateProviderId: (accountMethod as any).gateProvider.id,
      };
    } else {
      payload = {
        amount: Number(amount),
        coin: serial,
      };
    }

    this.isLoading = true;
    const { response, error } = await this.submitMethods[topUpMethod](payload);
    this.isLoading = false;

    if (this.checkError(error) || !response) {
      return;
    }

    const {
      amountToSend,
      commissionAmount,
      currency: { code: currency },
    } = response;
    this.commission = { amountToSend, commissionAmount, currency };
  }

  protected onTopUpChoose(): void {
    this.commission = null;
    this.form.accountMethod = null;
  }
}
</script>
