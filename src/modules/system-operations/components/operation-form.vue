<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <template v-if="!successData">
      <app-form-item prop="method">
        <app-select
          v-model="form.method"
          :options="getMethodList()"
          option-label="label"
          option-value="value"
          placeholder="placeholder.select.select"
          full-width
          :label="$t('form.label.method')"
          @change="onMainChange('fetchCashDesk', ['cashDeskId', 'serial'])"/>
      </app-form-item>

      <app-form-item prop="cashDeskId">
        <app-select
          v-model="form.cashDeskId"
          :options="cashDeskList"
          option-label="name"
          option-value="id"
          placeholder="placeholder.select.select"
          full-width
          :label="$t('form.label.cash_desk')"
          @change="onMainChange('fetchCoins', ['serial'])"/>
      </app-form-item>

      <app-form-item prop="serial">
        <app-select
          v-model="form.serial"
          :options="coinsList"
          option-label="name"
          option-value="serial"
          placeholder="placeholder.select.choose_wallet"
          full-width
          :label="$t('form.label.wallet')"/>
      </app-form-item>

      <app-form-item prop="amount">
        <app-input
          v-model="form.amount"
          placeholder="placeholder.input.input_amount"
          :label="$t('form.label.amount')"/>
      </app-form-item>

      <app-form-item prop="fullName">
        <app-input
          v-model="form.fullName"
          placeholder="placeholder.input.input_full_name"
          :label="$t('form.label.full_name')"/>
      </app-form-item>

      <app-button
        type="primary"
        native-type="submit"
        full-width>
        {{ $t('action.submit') }}
      </app-button>
    </template>
    <template v-else>
      <div class="form__list">
        <p>{{ $t('pages.system_operations.request_success') }}</p>
        <p>
          <strong>{{ $t('pages.system_operations.code_of_your_request') }}:</strong>
          {{ successData.requestIdentifier }}
        </p>
      </div>
      <app-button
        type="primary"
        native-type="button"
        full-width
        @click.native.prevent="resetForm">
        {{ $t('action.ok') }}
      </app-button>
    </template>
  </app-form>
</template>

<script lang="ts">
import {
  Component, Ref, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import { ROLES } from '@/constants';
import {
  IOperationForm,
  TOperationFormFields,
} from '@/modules/system-operations/types/SystemOperations.types';
import {
  MixMaxValidation,
  OnChangeRequiredValidationRule,
  OnlyLetterValidator,
  SimpleNumberValidationRule,
} from '@/rules/validation';
import {
  CollectsRequests,
  GateInvestmentsRequests,
  InputsRequests,
  InvestmentsRequests,
  OrganizationsRequests,
} from '@/services/requests';
import { ICoin } from '@/services/requests/organizations/Coin.types';
import { IGetOrganizationsOptions, IOrganizationRecord } from '@/services/requests/organizations/Organizations.types';
import { ITransactionsRecord } from '@/services/requests/transactions/Transactions.types';
import { UserInstance } from '@/services/UserService';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification } from '@/utils';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppSelect,
    AppButton,
  },
})
export default class OperationForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  protected successData: ITransactionsRecord | null = null;

  protected isLoading: boolean = false;

  protected coinsList: ICoin[] = [];

  protected cashDeskList: IOrganizationRecord[] = [];

  protected submitMethods: { [key: string]: Function } = {
    cash_collect: CollectsRequests.create,
    cash_input: InputsRequests.create,
    investment: InvestmentsRequests.create,
    gate_investment: GateInvestmentsRequests.create,
  }

  protected get isGateInvestment() {
    return this.form.method === 'gate_investment';
  }

  protected form: IOperationForm = {
    method: null,
    cashDeskId: null,
    serial: '',
    amount: null,
    fullName: null,
  };

  protected rules: IPlainObject = {
    method: OnChangeRequiredValidationRule(),
    cashDeskId: OnChangeRequiredValidationRule(),
    serial: OnChangeRequiredValidationRule(),
    amount: SimpleNumberValidationRule(),
    fullName: [...OnlyLetterValidator(true), ...MixMaxValidation(3)],
  };

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    const {
      method, amount, serial, fullName,
    } = this.form;

    if (!method || !amount || !serial || !fullName) return;

    this.isLoading = true;
    const { response, error } = await this.submitMethods[method]({ amount, serial, fullName });
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.appForm.resetFields();
    this.successData = response.process;
  }

  protected async onMainChange(
    fetch: 'fetchCashDesk' | 'fetchCoins' | null = null,
    resetFields: TOperationFormFields[] = [],
  ): Promise<void> {

    await this.$nextTick();

    if (resetFields.length) {
      resetFields.forEach((field) => {
        this.form[field] = null;
      });
      await this.$nextTick();
      this.appForm.clearValidate(resetFields);
    }

    if (fetch) {
      await this[fetch]();
    }

  }

  protected async fetchCashDesk(): Promise<void> {

    const type: string = this.isGateInvestment ? 'gate_provider' : 'cash_desk';

    const options: IGetOrganizationsOptions = {
      filter: { types: [type] },
      pageNumber: 0,
      pageSize: 20,
    };

    this.isLoading = true;
    const { response, error } = await OrganizationsRequests.getOrganizations(options);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.cashDeskList = response?.records || [];
  }

  protected async fetchCoins(): Promise<void> {
    const { cashDeskId } = this.form;
    if (!cashDeskId) return;

    this.isLoading = true;
    const { response, error } = await OrganizationsRequests.getProviderCoins(cashDeskId);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.coinsList = response?.coins || [];
  }

  protected async resetForm() {
    this.successData = null;
  }

  protected getMethodList() {
    const methods = [
      {
        label: 'pages.system_operations.cash_collect',
        value: 'cash_collect',
      },
      {
        label: 'pages.system_operations.cash_input',
        value: 'cash_input',
      },
      {
        label: 'pages.system_operations.investment',
        value: 'investment',
      },
    ];

    if (UserInstance.isRole[ROLES.accountant]) {
      methods.push({
        label: 'pages.system_operations.gate_investment',
        value: 'gate_investment',
      });
    }
    return methods;
  }

}
</script>
