<template>
  <app-step-controller
    is-close-visible
    back-name="user-withdrawal-operations"
    :total-steps="1"
    class="withdrawal-bank">
    <template #default="{ goToBackPage }">
      <app-form-wrapper class="withdrawal-bank__form-wrapper">
        <template #title>
          {{ $t('pages.user_dashboard.payments.withdrawal_via_bank_transfer_title') }}
        </template>
        <div class="withdrawal-bank__subtitle">
          {{ $t('pages.user_dashboard.payments.withdrawal_via_bank_transfer_subtitle') }}
        </div>
        <app-form
          ref="appFormRef"
          :model="form"
          :rules="rules"
          :loading="isLoading"
          @submit.native.prevent="handleFormSubmit">
          <app-form-item prop="coinSerial">
            <account-select
              v-model="form.accountFrom"
              label="form.label.account_from" />
          </app-form-item>
          <app-form-item prop="bankAccountId">
            <app-select
              v-model="form.bankAccountId"
              :options="selectedWalletBankAccountWithDisplayName"
              :disabled="isBankAccountSelectDisabled"
              option-value="id"
              option-label="displayName"
              label="form.label.bank_account_id"
              placeholder="form.label.bank_account_id" />
          </app-form-item>
          <app-form-item prop="description">
            <app-input
              v-model="form.description"
              type="textarea"
              placeholder="form.label.add_note"
              label="form.label.add_note" />
          </app-form-item>
          <app-form-item prop="amount">
            <app-input
              v-model="form.amount"
              placeholder="form.label.amount"
              label="form.label.amount" />
          </app-form-item>

          <template v-if="calculatedCommission !== null">
            <operation-commission
              class="withdrawal-bank__commission"
              :rows="2">
              <template #label-1>
                {{ $t('form.label.recipient_gets') }}
              </template>
              <template #value-1>
                {{ `${calculatedCommission.recipientAmountPush} ${calculatedCommission.currency.code}` }}
              </template>
              <template #label-2>
                {{ $t('form.label.fee') }}
              </template>
              <template #value-2>
                {{ `${calculatedCommission.commissionAmountPush} ${calculatedCommission.currency.code}` }}
              </template>
            </operation-commission>
          </template>

          <app-button
            :disabled="isSubmitButtonDisabled"
            native-type="submit"
            type="secondary">
            {{ $t('action.create_withdrawal_request') }}
          </app-button>
        </app-form>
      </app-form-wrapper>

      <app-modal
        ref="appModalRef"
        is-centred
        is-full-width
        @closed="goToBackPage">
        <template #default="{ onSubmit }">
          <app-info-modal
            :title="infoModalData.title"
            :subtitle="infoModalData.subtitle"
            :type="InfoModalTypes.success"
            confirm-text="action.done"
            :is-cancel-visible="false"
            @confirm="
              onSubmit();
              goToBackPage();
            " />
        </template>
      </app-modal>
    </template>
  </app-step-controller>
</template>

<script lang="ts">
import type {
  IBankAccountRecord,
  IBankWithdrawalCommissionResponse,
  ICoin,
  ICreateWithdrawalRequestPayload,
  IWalletRecord,
} from '@sdk5/shared/requests';
import { BankAccountsRequests, BankWithdrawalsRequests, WalletsRequests } from '@sdk5/shared/requests';
import { errorNotification } from '@sdk5/shared/utils';
import { SimpleRequiredValidationRule } from '@sdk5/shared/validation';
import {
  AppButton,
  AppForm,
  AppFormItem,
  AppFormWrapper,
  AppInfoModal,
  AppInput,
  AppModal,
  AppSelect,
  AppStepController,
  InfoModalTypes,
} from '@sdk5/ui-kit-front-office';
import { debounce } from 'lodash';
import { Component, Ref, Vue, Watch } from 'vue-property-decorator';

import AccountSelect from '../user-dashboard/components/account-select.vue';
import OperationCommission from '../user-dashboard/components/operation-commission.vue';
import PaymentOperationsLayout from '../user-dashboard/layouts/payment-operations-layout.vue';

const COMPONENTS = {
  AppStepController,
  AppFormWrapper,
  AppForm,
  PaymentOperationsLayout,
  AppSelect,
  AppInput,
  AccountSelect,
  AppFormItem,
  AppButton,
  OperationCommission,
  AppModal,
  AppInfoModal,
} as const;

@Component({
  name: 'withdrawal-via-bank',
  components: COMPONENTS,
})
export default class WithdrawalVieBank extends Vue {
  static components: typeof COMPONENTS;

  @Ref('appFormRef') readonly appFormRef!: AppForm;

  @Ref('appModalRef') readonly appModalRef!: AppModal;

  protected readonly InfoModalTypes = InfoModalTypes;

  protected readonly calculateWithdrawalCommissionDebounced = debounce(this.calculateWithdrawalCommission, 900);

  protected isLoading = false;

  protected infoModalData = {
    title: '',
    subtitle: '',
  };

  protected accountFrom: ICoin | null = null;

  protected form: Pick<Partial<ICreateWithdrawalRequestPayload>, 'amount' | 'bankAccountId' | 'customInformation' | 'description'> & {
    accountFrom?: ICoin;
  } = {
    accountFrom: undefined,
    amount: undefined,
    bankAccountId: undefined,
    customInformation: undefined,
    description: undefined,
  };

  protected rules: Record<keyof typeof this.form, unknown> = {
    amount: SimpleRequiredValidationRule(),
    accountFrom: SimpleRequiredValidationRule(),
    bankAccountId: null,
    customInformation: null,
    description: null,
  };

  protected bankAccounts: IBankAccountRecord[] = [];

  protected userCoins: IWalletRecord[] = [];

  protected calculatedCommission: IBankWithdrawalCommissionResponse | null = null;

  protected get isBankAccountSelectDisabled() {
    return !this.form.accountFrom?.serial;
  }

  protected get isSubmitButtonDisabled() {
    return this.isLoading || this.calculatedCommission === null;
  }

  protected get selectedWalletBankAccounts() {
    return this.bankAccounts.filter((account) => this.form.accountFrom?.serial && this.form.accountFrom?.serial === account.coinSerial);
  }

  protected get selectedWalletBankAccountWithDisplayName() {
    return this.selectedWalletBankAccounts.map((account) => ({
      ...account,
      displayName: `${account.details.name} (${account.details.iban})`,
    }));
  }

  protected get formCommissionFields() {
    const { amount, accountFrom } = this.form;
    return {
      amount,
      coinSerial: accountFrom?.serial,
    };
  }

  protected setInfoModalData(options: typeof this.infoModalData) {
    this.infoModalData = {
      ...options,
    };
  }

  protected clearInfoModalData() {
    this.infoModalData = {
      title: '',
      subtitle: '',
    };
  }

  protected findUserCoinBySerial(serial: string) {
    return this.userCoins.find((coin) => coin.serial === serial);
  }

  protected async openInfoModal(modalData: typeof this.infoModalData) {
    this.setInfoModalData(modalData);
    await this.appModalRef.open();
    this.clearInfoModalData();
  }

  protected async fetchUserCoins() {
    const { response, error } = await WalletsRequests.getWallets();

    if (error !== null) {
      errorNotification(error);
      return;
    }

    this.userCoins = response?.coins ?? [];
  }

  protected async fetchBankAccounts() {
    const { response, error } = await BankAccountsRequests.getMyBankAccounts();

    if (error !== null) {
      errorNotification(error);
      return;
    }

    this.bankAccounts = response?.records ?? [];
  }

  protected async fetchInitialData() {
    this.isLoading = true;
    await Promise.all([this.fetchUserCoins(), this.fetchBankAccounts()]);
    this.isLoading = false;
  }

  protected async calculateWithdrawalCommission(payload: Pick<ICreateWithdrawalRequestPayload, 'amount' | 'coinSerial'>) {
    const { amount, coinSerial } = payload;
    this.isLoading = true;
    const { response, error } = await BankWithdrawalsRequests.calculateCommission(coinSerial, amount);
    this.isLoading = false;

    if (error !== null) {
      errorNotification(error);
      return;
    }

    this.calculatedCommission = response;
  }

  protected async createWithdrawalRequest(payload: ICreateWithdrawalRequestPayload) {
    this.isLoading = true;
    const { error } = await BankWithdrawalsRequests.createWithdrawalRequest(payload);
    this.isLoading = false;

    if (error !== null) {
      errorNotification(error);
      return;
    }

    const { amount, coinSerial } = payload;

    const userCoin = this.findUserCoinBySerial(coinSerial);

    this.openInfoModal({
      subtitle: this.$t('pages.user_dashboard.payments.withdrawal_success_subtitle').toString(),
      title: this.$t('pages.user_dashboard.payments.withdrawal_success_title', {
        accountName: userCoin?.name ?? '',
        currency: userCoin?.currency?.symbol ?? '',
        amount,
      }).toString(),
    });
  }

  protected async handleFormSubmit() {
    if (!(await this.appFormRef.validate())) {
      return;
    }

    const {
      accountFrom: { serial: coinSerial },
      amount,
      bankAccountId,
      customInformation,
      description,
    } = this.form as Required<typeof this.form>;

    const payload: ICreateWithdrawalRequestPayload = {
      amount,
      coinSerial,
      bankAccountId,
      customInformation,
      description,
    };

    this.createWithdrawalRequest(payload);
  }

  @Watch('formCommissionFields', { deep: true })
  protected formCommissionFieldsChangeHandler(formCommissionFields: typeof this.formCommissionFields) {
    const { amount, coinSerial } = formCommissionFields;
    const amountNumber = parseInt(`${amount}`, 10);

    if (!Number.isNaN(amountNumber) && coinSerial) {
      this.calculateWithdrawalCommissionDebounced({ amount: amountNumber, coinSerial });
    }
  }

  created() {
    this.fetchInitialData();
  }
}
</script>

<style lang="scss">
.withdrawal-bank {
  &__subtitle {
    @apply text-gray-500 text-xl mb-32 font-medium;
  }

  &__form-wrapper {
    @apply max-w-540 ml-auto mr-auto;
  }

  &__commission {
    @apply mb-36;
  }
}

@media print {
  .app-form-wrapper__title,
  .withdrawal-bank__subtitle,
  .app-select,
  .app-step-controller__close,
  .app-step-controller__back {
    display: none !important;
  }
}
</style>
