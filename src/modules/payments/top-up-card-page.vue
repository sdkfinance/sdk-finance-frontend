<template>
  <app-step-controller
    class="top-up-card"
    :total-steps="2"
    back-name="user-top-up-operations"
    is-close-visible>
    <template #default="{ currentStep, nextStep, goToBackPage }">
      <app-form-wrapper class="max-w-540 ml-auto mr-auto">
        <template #title>
          {{ $t('pages.user_dashboard.payments.top_up_via_debit_card') }}
        </template>
        <app-step-progress
          class="top-up-card__progress"
          :total-steps="2"
          :current-step="currentStep">
          <template #title-1>
            {{ $t('pages.user_dashboard.payments.card_details') }}
          </template>
          <template #title-2>
            {{ $t('pages.user_dashboard.payments.amount') }}
          </template>
        </app-step-progress>
        <app-form
          ref="form"
          :loading="isLoading"
          :model="form"
          :rules="rules"
          @submit.native.prevent>
          <transition-group name="page">
            <div
              v-if="currentStep === 1"
              key="cardForm">
              <div class="top-up-card__subtitle">
                {{ $t('pages.user_dashboard.payments.enter_card_details') }}
              </div>
              <div class="grid gap-16 grid-flow-col auto-cols-max mb-16">
                <app-form-item prop="cardNumber">
                  <app-input-card-number
                    v-model="form.cardNumber"
                    style="width: 260px"/>
                </app-form-item>
                <app-form-item prop="expDate">
                  <app-input
                    v-model="form.expDate"
                    v-mask="'##/##'"
                    style="width: 110px"
                    label="form.label.expiry_date"/>
                </app-form-item>
                <app-form-item prop="cvv">
                  <app-input
                    v-model="form.cvv"
                    v-mask="'###'"
                    type="password"
                    style="width: 110px"
                    label="form.label.cvv"/>
                </app-form-item>
              </div>
            </div>
            <div
              v-else-if="currentStep === 2"
              key="accountForm">
              <div class="top-up-card__subtitle">
                {{ $t('pages.user_dashboard.payments.select_account') }}
              </div>
              <app-form-item prop="account">
                <account-select
                  v-model="form.account"
                  label="form.label.account"/>
              </app-form-item>
              <app-form-item prop="amount">
                <app-input
                  v-model="form.amount"
                  label="form.label.transaction_amount"/>
              </app-form-item>
              <div class="top-up-card__fee">
                <div class="top-up-card__fee-icon">
                  i
                </div>
                {{ $t('other.no_fee') }}
              </div>
            </div>
          </transition-group>
          <app-button
            native-type="button"
            @click="handlerForm(nextStep, currentStep)">
            {{ $t('action.next') }}
          </app-button>
        </app-form>
      </app-form-wrapper>
      <app-modal
        ref="successModal"
        is-centred
        is-full-width
        @closed="goToBackPage">
        <template #default="{onSubmit}">
          <app-info-modal
            :title="$t('pages.user_dashboard.payments.success_top_up', {
              accountName: form.account.name,
              currency: form.account.issuer.symbol,
              amount: form.amount,
            })"
            subtitle="pages.user_dashboard.payments.success_top_up_subtitle"
            :type="infoModalTypes.success"
            confirm-text="action.done"
            :is-cancel-visible="false"
            @confirm="onSubmit(); goToBackPage()"/>
        </template>
      </app-modal>
    </template>
  </app-step-controller>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import { mask } from 'vue-the-mask';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppInputCardNumber from '@/components/ui-kit/app-input-card-number.vue';
import AppStepController from '@/components/ui-kit/app-step-controller.vue';
import AppStepProgress from '@/components/ui-kit/app-step-progress.vue';
import AppFormWrapper from '@/components/ui-kit/modals/app-form-wrapper.vue';
import AppInfoModal, { InfoModalTypes } from '@/components/ui-kit/modals/app-info-modal.vue';
import AppModal from '@/components/ui-kit/modals/app-modal.vue';
import AccountSelect from '@/modules/user-dashboard/components/account-select.vue';
import {
  CardNumberValidator,
  ExpDateValidator,
  MixMaxValidation,
  OnChangeRequiredValidationRule,
  SimpleNumberValidationRule,
} from '@/rules/validation';
import { GateRequests } from '@/services/requests';
import { IGateCreateTransactionBody, IPaymentProviderRecord } from '@/services/requests/gate/Gate.types';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification } from '@/utils';

@Component({
  components: {
    AppInputCardNumber,
    AppInfoModal,
    AppModal,
    AccountSelect,
    AppFormItem,
    AppForm,
    AppInput,
    AppStepProgress,
    AppButton,
    AppStepController,
    AppFormWrapper,
  },
  directives: {
    mask,
  },
})
export default class TopUpCardPage extends Vue {

  @Ref('form') readonly appForm!: AppForm;

  @Ref('successModal') readonly successModal!: AppModal;

  protected isLoading: boolean = false;

  protected infoModalTypes = InfoModalTypes;

  protected gateMethodList: IPaymentProviderRecord[] = [];

  protected form: IPlainObject = {
    cardNumber: '',
    expDate: '',
    cvv: '',
    account: null,
    amount: '',
  }

  protected rules: IPlainObject = {
    cardNumber: CardNumberValidator(),
    expDate: ExpDateValidator(),
    cvv: MixMaxValidation(3, 3),
    account: OnChangeRequiredValidationRule(),
    amount: SimpleNumberValidationRule(),
  }

  protected get provider(): IPaymentProviderRecord {
    return this.gateMethodList.find(({ gateProvider }) => gateProvider.name === 'SDK.Finance Top up') || {} as IPaymentProviderRecord;
  }

  protected async handlerForm(nextStep: Function, currentStep: number): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    if (currentStep === 1) {
      nextStep();
      return;
    }
    this.isLoading = true;
    const { amount, account: { serial } } = this.form;

    await this.fetchMethods(serial);

    const { gateProvider, way } = this.provider;

    const sendData = {
      amount,
      coin: serial,
      method: { gateProviderId: gateProvider.id, way },
      type: 'TOPUP',
    } as IGateCreateTransactionBody;

    const { response: responseTx, error: errorTx } = await GateRequests.createTransaction(sendData);

    if (errorTx) {
      errorNotification(errorTx);
      this.isLoading = false;
      return;
    }
    const { error } = await GateRequests.submitPayer(responseTx?.transaction.id || '', {
      optionName: 'default',
      fields: [{ name: 'phone', value: '380999999999' }],
    });
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    await this.successModal.open();
  }

  protected async fetchMethods(serial: string): Promise<void> {
    const { response, error } = await GateRequests.getMethods({ serial, txType: 'TOPUP' });

    if (error) {
      errorNotification(error);
      return;
    }

    this.gateMethodList = response?.records || [];
  }

}
</script>

<style lang="scss">
.top-up-card {
  &__subtitle {
    @apply text-gray-500 text-xl mb-32 font-medium;
  }

  &__progress {
    @apply max-w-240 ml-auto mr-auto mb-48;
  }

  &__fee {
    @apply text-blue-600 text-base flex items-center;

    &-icon {
      @apply w-18 h-18 rounded-full flex justify-center items-center ;
      @apply leading-none bg-blue-300 text-blue-accent text-11 font-bold mr-8;
    }
  }
}
</style>
