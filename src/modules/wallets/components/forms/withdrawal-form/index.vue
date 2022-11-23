<template>
  <app-form
    ref="form"
    :loading="isFormLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <template v-if="!successData">
      <template v-if="!isNextStepVisible">
        <app-form-item
          prop="senderCoin">
          <app-select
            v-model="form.coin"
            :options="coinsList"
            option-label="name"
            option-value="serial"
            placeholder="placeholder.select.choose_wallet"
            full-width
            label="form.label.wallet"
            @change="onMainChange(false,['method', 'accountMethod', 'cashDeskId'])"/>
        </app-form-item>

        <app-form-item
          prop="method">
          <app-select
            v-model="form.method"
            :options="allowedWithdrawalMethods"
            :disabled="!form.coin"
            option-label="label"
            option-value="value"
            placeholder="placeholder.select.choose_how_to_withdraw_the_funds"
            full-width
            label="form.label.withdrawal_method"
            @change="onMainChange(true,['accountMethod'])"/>
        </app-form-item>

        <app-form-item
          v-if="isProviderMethod"
          prop="accountMethod">
          <app-select
            v-model="form.accountMethod"
            :options="gateMethodList"
            option-label="gateProvider.gate.name"
            value-key="gateProvider.gate.name"
            placeholder="placeholder.select.choose_provider"
            full-width
            label="form.label.provider_options"
            @change="onMainChange"/>
        </app-form-item>

        <app-form-item
          v-if="isCashDeskMethod"
          prop="senderCoin">
          <app-select
            v-model="form.cashDeskId"
            :options="cashDeskList"
            option-label="name"
            option-value="id"
            placeholder="placeholder.select.choose_cash_desk"
            full-width
            label="form.label.cash_desk_options"
            @change="onMainChange"/>
        </app-form-item>

        <app-form-item
          v-if="isCashDeskMethod"
          prop="receiverName">
          <app-input
            v-model="form.receiverName"
            placeholder="placeholder.input.input_name_of_receiver"
            label="form.label.receiver_name"/>
        </app-form-item>

        <app-form-item prop="amount">
          <app-input
            v-model="form.amount"
            placeholder="placeholder.input.input_amount"
            label="form.label.amount"/>
        </app-form-item>

        <commission-block
          v-if="isCommissionCalculated"
          :commission="commission"/>
      </template>

      <template v-if="isBankMethod && isNextStepVisible">
        <app-form-item prop="autofillFromBankAccount">
          <app-switch
            v-model="autofillFromBankAccount"
            label="form.label.autofill_from_bank_account"/>
        </app-form-item>

        <app-form-item
          v-if="autofillFromBankAccount"
          prop="userBankAccount">
          <app-select
            v-model="userBankAccount"
            :options="userBankAccounts"
            option-label="details.iban"
            option-value="id"
            placeholder="placeholder.select.choose_bank_account"
            full-width
            label="form.label.my_bank_accounts_list"
            @change="onUserBankAccountSelected"/>
        </app-form-item>

        <bank-form
          v-model="form"/>
      </template>

      <dynamic-form
        v-if="isProviderMethod && isNextStepVisible"
        ref="dynamicProviderForm"
        :fields="dynamicProviderForm.fields"/>

      <buttons-group
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
          {{ $t('action.create') }}
        </app-button>
      </buttons-group>
    </template>

    <withdrawal-success
      v-else
      :method="form.method"
      :data="successData"/>
  </app-form>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Ref, Vue, Watch,
} from 'vue-property-decorator';

import DynamicForm from '@/components/dynamic-form.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppSwitch from '@/components/ui-framework/app-switch.vue';
import ButtonsGroup from '@/components/ui-kit/app-buttons-group.vue';
import { ROLES } from '@/constants';
import BankForm from '@/modules/wallets/components/forms/withdrawal-form/bank-form.vue';
import CommissionBlock from '@/modules/wallets/components/forms/withdrawal-form/commission-block.vue';
import WithdrawalSuccess from '@/modules/wallets/components/forms/withdrawal-form/withdrawal-success.vue';
import {
  IWithdrawalCommissionBlock,
  IWithdrawalForm,
  IWithdrawalSuccessData,
  TWithdrawalFormResetFields,
} from '@/modules/wallets/types/Withdrawal.types';
import {
  AddressValidator,
  BicValidator,
  IbanValidator,
  MixMaxValidation,
  OnChangeRequiredValidationRule,
  OnlyLetterValidator,
  SimpleNumberRangeValidationRule,
  SimpleNumberValidationRule,
  SimpleRequiredValidationRule,
  SwiftValidator,
} from '@/rules/validation';
import { BankWithdrawalsRequests, CashDeskRequests, ProfileRequests } from '@/services/requests';
import { ICashDeskRecord } from '@/services/requests/cash-desk/CashDesk.types';
import { IGateSubmitPayerBody, IPaymentProviderRecord } from '@/services/requests/gate/Gate.types';
import {
  GateRequests,
} from '@/services/requests/gate/GateRequests';
import { IUserBankAccount, IUserBankAccountRecord } from '@/services/requests/profiles/UserProfile.types';
import { UserInstance } from '@/services/UserService';
import { IDynamicField, IPlainObject } from '@/types/interfaces';
import { errorNotification } from '@/utils';

import { withdrawalMethodsList } from './withdrawalMethods';

@Component({
  components: {
    CommissionBlock,
    AppForm,
    AppFormItem,
    AppInput,
    AppSelect,
    AppButton,
    ButtonsGroup,
    BankForm,
    DynamicForm,
    WithdrawalSuccess,
    AppSwitch,
  },
})
export default class WithdrawalForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Ref('dynamicProviderForm') readonly appDynamicProviderForm!: DynamicForm

  @Prop({ type: Array, default: () => ([]) }) readonly coinsList!: string[];

  @Prop({ type: Boolean, default: false }) readonly isLoadingData!: boolean;

  @Watch('autofillFromBankAccount')
  async handleValue(autofillFromBankAccount: boolean): Promise<void> {
    if (autofillFromBankAccount && !this.userBankAccounts.length) {
      await this.fetchUserBankAccounts();
    }
  }

  protected isLoading: boolean = false;

  protected autofillFromBankAccount: boolean = false;

  protected userBankAccounts: IUserBankAccount[] = [];

  protected userBankAccount: IUserBankAccountRecord | null = null;

  protected isNextStepVisible: boolean = false;

  protected gateMethodList: IPaymentProviderRecord[] = [];

  protected cashDeskList: ICashDeskRecord[] = [];

  protected dynamicProviderForm: { txId: string; fields: IDynamicField[]; optionName: string } | null = null;

  protected commission: IWithdrawalCommissionBlock | null = null;

  protected successData: IWithdrawalSuccessData | null = null;

  protected form: IWithdrawalForm = {
    method: null,
    cashDeskId: null,
    receiverName: null,
    accountMethod: null,
    coin: '',
    name: null,
    amount: null,
    bankAccountNumber: null,
    address: null,
    bic: null,
    fullName: null,
    iban: null,
    swift: null,
    txType: 'REDEEM',
  };

  protected rules: IPlainObject = {
    coin: OnChangeRequiredValidationRule(),
    accountMethod: OnChangeRequiredValidationRule(),
    cashDeskId: OnChangeRequiredValidationRule(),
    bankAccountNumber: SimpleNumberValidationRule(false),
    amount: SimpleNumberRangeValidationRule(),
    receiverName: SimpleRequiredValidationRule(),
    fullName: [...OnlyLetterValidator(true), ...MixMaxValidation(3)],
    iban: IbanValidator(),
    swift: SwiftValidator(),
    bic: BicValidator(true),
    address: AddressValidator(),
  }

  protected async fetchUserBankAccounts(): Promise<void> {
    this.isLoading = true;
    const { response, error } = await ProfileRequests.getUserBankAccounts();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
    }

    this.userBankAccounts = response?.records || [];
  }

  protected onUserBankAccountSelected(userBankAccountId: string): void {
    const selectedUserBank = this.userBankAccounts.find((bank) => bank.id === userBankAccountId);

    const getBankDetailsValue = (property: keyof IUserBankAccountRecord): string | null => selectedUserBank?.details[property] ?? null;

    this.form.address = getBankDetailsValue('address');
    this.form.bankAccountNumber = getBankDetailsValue('bankAccountNumber');
    this.form.fullName = getBankDetailsValue('fullName');
    this.form.bic = getBankDetailsValue('bic');
    this.form.swift = getBankDetailsValue('swift');
    this.form.iban = getBankDetailsValue('iban');
    this.form.name = getBankDetailsValue('name');
  }

  protected get allowedWithdrawalMethods() {
    const isCashDeskHidden = UserInstance.hasAnyRoles([ROLES.merchant]);

    return isCashDeskHidden
      ? withdrawalMethodsList.filter(({ value }) => value !== 'cash_desk')
      : withdrawalMethodsList;
  }

  protected get isFormLoading() {
    return this.isLoadingData || this.isLoading;
  }

  protected get isProviderMethod() {
    return this.form.method === 'provider';
  }

  protected get isBankMethod() {
    return this.form.method === 'bank';
  }

  protected get isCashDeskMethod() {
    return this.form.method === 'cash_desk';
  }

  protected get isCommissionCalculated() {
    return !!this.commission?.amountToSend;
  }

  protected get hasDynamicProviderForm() {
    return !!this.dynamicProviderForm?.fields?.length;
  }

  protected get isNextAvailable() {
    return !this.isCommissionCalculated
        || (this.isBankMethod && !this.isNextStepVisible)
        || (this.isProviderMethod && !this.isNextStepVisible && !this.hasDynamicProviderForm);
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

    if (this.isBankMethod) {
      this.isNextStepVisible = true;
    }

    if (this.isProviderMethod) {
      this.handleForm();
    }

  }

  protected prevStep() {
    this.isNextStepVisible = false;
    this.onMainChange();
  }

  protected async onMainChange(
    needFetchingData: boolean = false,
    resetFields: Array<TWithdrawalFormResetFields> = [],
  ): Promise<void> {
    await this.$nextTick();

    this.commission = null;
    this.dynamicProviderForm = null;

    if (resetFields.length) {
      resetFields.forEach((key: TWithdrawalFormResetFields) => { this.form[key] = null; });
    }

    if (needFetchingData) {
      if (this.isCashDeskMethod) {
        await this.fetchCashDesk();
      } else if (this.isProviderMethod) {
        await this.fetchMethods();
      }
    }
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

  protected async fetchCashDesk(): Promise<void> {
    this.cashDeskList = [];
    this.isLoading = true;

    await this.$nextTick();

    const { coin } = this.form;

    const { response, error } = await CashDeskRequests.getCashDesk(coin);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
    }

    this.cashDeskList = response?.records || [];
  }

  protected async onDynamicProviderFormSubmit(): Promise<void> {
    const { isValid, fields } = await this.appDynamicProviderForm.validate();
    const { txId, optionName } = this.dynamicProviderForm || {};

    if (!isValid || !txId || !optionName) {
      return;
    }

    await this.withdrawalProviderSubmitPayer(txId, { optionName, fields });
  }

  protected async withdrawalProviderSubmitPayer(txId: string, data: IGateSubmitPayerBody): Promise<void> {

    const { response, error } = await GateRequests.submitPayer(txId, data);
    if (this.checkError(error) || !response) return;

    const {
      finalAmount: amount,
      coin: { issuer: { currency }, serial },
      paymentMethod: { gateProvider: { gate } },
    } = response.transaction;

    this.successData = {
      amount, serial, currency, providerName: gate.name,
    };
    this.onSubmit();
  }

  protected async withdrawalProviderSubmit(): Promise<void> {

    const {
      amount, coin, accountMethod, txType: type,
    } = this.form;

    if (!accountMethod || !amount || !coin || !type) return;

    const { gateProvider: { id: gateProviderId }, way } = accountMethod;
    const sendData = {
      amount,
      coin,
      method: { gateProviderId, way },
      type,
    };

    const { response: responseTx, error: errorTx } = await GateRequests.createTransaction(sendData);
    if (this.checkError(errorTx) || !responseTx) return;
    const txId = responseTx.transaction.id;

    const { response: responsePayer, error: errorPayer } = await GateRequests.getPayerFields(txId);
    if (this.checkError(errorPayer) || !responsePayer) return;

    const [{ fields, name: optionName }] = responsePayer.options;
    if (!fields.length) {
      await this.withdrawalProviderSubmitPayer(txId, { fields: [], optionName });
      return;
    }

    this.dynamicProviderForm = {
      txId,
      fields,
      optionName,
    };
    this.isNextStepVisible = true;
  }

  protected async withdrawalBankSubmit(): Promise<void> {
    const {
      amount,
      coin,
      bankAccountNumber,
      address,
      bic,
      fullName,
      iban,
      name,
      swift,
    } = this.form;

    if (!amount || !coin || !fullName) return;

    const sendData = {
      amount,
      coin,
      bankDetails: {
        bankAccountNumber,
        address,
        bic,
        fullName,
        iban,
        name,
        swift,
      },
    };
    const { response, error } = await BankWithdrawalsRequests.create(sendData);

    if (this.checkError(error) || !response) return;

    const {
      cashAmount,
      clientCoin: { issuer: { currency }, serial },
      requestIdentifier,
    } = response.process;

    this.successData = {
      amount: cashAmount, serial, currency, requestIdentifier,
    };
    this.onSubmit();
  }

  protected async withdrawalCashDeskSubmit(): Promise<void> {
    const {
      coin, amount, receiverName, cashDeskId,
    } = this.form;
    if (!coin || !amount || !receiverName || !cashDeskId) return;

    const sendData = { coin, amount, receiverName };
    const { response, error } = await CashDeskRequests.executeWithdrawal(cashDeskId, sendData);

    if (this.checkError(error) || !response) return;

    const {
      cashAmount,
      clientCoin: { issuer: { currency }, serial },
      requestIdentifier,
    } = response.process;

    this.successData = {
      amount: cashAmount, serial, currency, requestIdentifier,
    };
    this.onSubmit();
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;

    if (this.isProviderMethod) {
      if (this.hasDynamicProviderForm) {
        await this.onDynamicProviderFormSubmit();
      } else {
        await this.withdrawalProviderSubmit();
      }
    } else if (this.isBankMethod) {
      await this.withdrawalBankSubmit();
    } else if (this.isCashDeskMethod) {
      await this.withdrawalCashDeskSubmit();
    }

    this.isLoading = false;
  }

  protected async withdrawalProviderCalculate(): Promise<void> {
    const {
      accountMethod, coin: serial, amount, txType,
    } = this.form;

    if (!accountMethod || !serial || !amount || !txType) return;

    const { response, error } = await GateRequests.calculateCommission({
      gateProviderId: accountMethod.gateProvider.id, serial, amount, txType,
    });

    if (this.checkError(error) || !response) return;

    const { amountToSend, commissionAmount, currency: { code: currency } } = response;
    this.commission = { amountToSend, commissionAmount, currency };
  }

  protected async withdrawalBankCalculate(): Promise<void> {
    const { coin, amount } = this.form;
    if (!coin || !amount) return;

    const { response, error } = await BankWithdrawalsRequests.calculateCommission(coin, amount);

    if (this.checkError(error) || !response) return;

    const { commissionAmountPush: commissionAmount, recipientAmountPush: amountToSend, issuer: { currency } } = response;
    this.commission = { amountToSend, commissionAmount, currency };
  }

  protected async withdrawalCashDeskCalculate(): Promise<void> {
    const {
      coin, amount, receiverName, cashDeskId,
    } = this.form;
    if (!coin || !amount || !receiverName || !cashDeskId) return;

    const sendData = { coin, amount, receiverName };
    const { response, error } = await CashDeskRequests.calculateCommission(cashDeskId, sendData);

    if (this.checkError(error) || !response) return;

    const { commissionAmountPush: commissionAmount, recipientAmountPush: amountToSend, issuer: { currency } } = response;
    this.commission = { amountToSend, commissionAmount, currency };
  }

  protected async calculateCommission(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;

    if (this.isProviderMethod) {
      await this.withdrawalProviderCalculate();
    } else if (this.isBankMethod) {
      await this.withdrawalBankCalculate();
    } else if (this.isCashDeskMethod) {
      await this.withdrawalCashDeskCalculate();
    }

    this.isLoading = false;

  }

}
</script>
