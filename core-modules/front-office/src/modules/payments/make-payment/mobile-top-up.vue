<template>
  <app-step-controller
    :total-steps="2"
    back-name="user-make-payment-operations"
    is-close-visible>
    <template #default="{ currentStep, nextStep }">
      <app-form-wrapper class="max-w-540 ml-auto mr-auto">
        <template #title>
          {{ $t('pages.user_dashboard.payments.mobile_top_up_title') }}
        </template>
        <transition-group name="page">
          <app-form
            v-show="currentStep === 1"
            ref="form"
            key="form"
            :loading="isLoading"
            :model="form"
            :rules="rules"
            @submit.native.prevent="handleForm(nextStep)">
            <app-form-item prop="from">
              <account-select
                v-model="form.from"
                label="form.label.from_account" />
            </app-form-item>

            <app-form-item prop="to">
              <app-custom-select
                v-model="form.to"
                label="form.label.name_or_phone_number"
                placeholder="form.label.phone_number"
                input-placeholder="form.label.phone_number"
                options-title="form.label.my_phone_numbers">
                <template #options="{ setValueManual }">
                  <app-custom-select-option
                    :color="profileContacts.contactColor"
                    :title="profileContacts.contactPhone"
                    subtitle="Ukraine"
                    :custom-initials="profileContacts.countryCode"
                    :is-action-available="false"
                    @click="selectTemplate(profileContacts.contactPhone, setValueManual)" />
                  <app-custom-select-option
                    :color="profileContacts.loginColor"
                    :title="profileContacts.loginPhone"
                    subtitle="Ukraine"
                    :custom-initials="profileContacts.countryCode"
                    :is-action-available="false"
                    @click="selectTemplate(profileContacts.loginPhone || '', setValueManual)" />
                </template>
              </app-custom-select>
            </app-form-item>

            <app-form-item prop="amount">
              <app-input
                v-model.trim="form.amount"
                name="amount"
                size="large"
                autocomplete="off"
                label="form.label.payment_amount"
                placeholder="placeholder.input.input_amount" />
            </app-form-item>

            <operation-commission
              class="mb-36"
              :rows="1">
              <template #label-1>
                {{ $t('form.label.fee') }}
              </template>
              <template #value-1>
                {{ isCommissionCalculated ? '0' : emptyChar }}
                {{ getProp(commission, 'paymentToolDetails.currency') }}
              </template>
            </operation-commission>

            <app-button
              class="submit-button"
              native-type="submit">
              {{ $t('action.next') }}
            </app-button>
          </app-form>
          <div
            v-show="currentStep === 2"
            key="details">
            <mobile-transfer-details :data="commission" />
            <app-button
              class="submit-button"
              native-type="button"
              @click="onMakePayment">
              {{ $t('action.make_payment') }}
            </app-button>
          </div>
        </transition-group>
      </app-form-wrapper>
      <app-modal
        ref="successModal"
        is-centred
        is-full-width>
        <template #default="{ onSubmit }">
          <app-info-modal
            title="pages.user_dashboard.payments.payment_success_title"
            subtitle="pages.user_dashboard.payments.payment_success_info"
            :type="infoModalTypes.success"
            :is-cancel-visible="false"
            @confirm="onSubmit" />
        </template>
      </app-modal>
    </template>
  </app-step-controller>
</template>

<script lang="ts">
import config from '@sdk5/shared/config';
import type { ICoin, IPaymentToolDetails, ITransferCalculateResponse } from '@sdk5/shared/requests';
import { Profile } from '@sdk5/shared/store';
import { getProp } from '@sdk5/shared/utils';
import { OnChangeRequiredValidationRule, SimpleNumberValidationRule } from '@sdk5/shared/validation';
import {
  AppButton,
  AppCustomSelect,
  AppCustomSelectOption,
  AppForm,
  AppFormItem,
  AppFormWrapper,
  AppInfoModal,
  AppInput,
  AppModal,
  AppSelectCustomOption,
  AppStepController,
  categoryColors,
  InfoModalTypes,
} from '@sdk5/ui-kit-front-office';
import { debounce } from 'lodash';
import { Component, Ref, Vue, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import AccountSelect from '../../user-dashboard/components/account-select.vue';
import OperationCommission from '../../user-dashboard/components/operation-commission.vue';
import MobileTransferDetails from './components/mobile-transfer-details.vue';

const COMPONENTS = {
  OperationCommission,
  MobileTransferDetails,
  AccountSelect,
  AppCustomSelectOption,
  AppCustomSelect,
  AppButton,
  AppStepController,
  AppForm,
  AppInput,
  AppFormItem,
  AppFormWrapper,
  AppSelectCustomOption,
  AppInfoModal,
  AppModal,
} as const;

@Component({
  name: 'mobile-top-up',
  components: COMPONENTS,
})
export default class MobileTopUp extends Vue {
  static components: typeof COMPONENTS;

  @Ref('form') readonly appForm!: AppForm;

  @Ref('successModal') readonly successModal!: AppModal;

  protected isLoading: boolean = false;

  protected infoModalTypes = InfoModalTypes;

  protected commission = {} as ITransferCalculateResponse;

  protected profileModule = getModule(Profile, this.$store);

  readonly emptyChar: string = config.emptyChar;

  protected getProp = getProp;

  protected form = {
    from: {} as ICoin,
    to: '',
    amount: '' as string | number,
  };

  protected rules: Record<keyof typeof this.form, unknown> = {
    from: OnChangeRequiredValidationRule(),
    to: SimpleNumberValidationRule(),
    amount: SimpleNumberValidationRule(),
  };

  protected get isCommissionCalculated(): boolean {
    return !!this.commission?.paymentToolDetails;
  }

  protected get profileContacts() {
    return {
      countryCode: this.profileModule.personContacts?.countryCode,
      contactColor: categoryColors[0],
      loginColor: categoryColors[3],
      contactPhone: this.profileModule.personContacts?.phoneNumber,
      loginPhone: this.profileModule.personInfo?.phoneNumber,
    };
  }

  @Watch('form', { deep: true })
  protected onFormChanged(): void {
    this.commission = {} as ITransferCalculateResponse;
    this.debouncedCommissionCalculation();
  }

  protected async handleForm(onNextStep: Function): Promise<void> {
    const isValid: boolean = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    if (this.isCommissionCalculated) {
      onNextStep();
      return;
    }

    await this.onCalculateCommission();
  }

  protected debouncedCommissionCalculation = debounce(this.onCalculateCommission, 500);

  protected async onCalculateCommission(): Promise<void> {
    if (!this.form.amount) {
      return;
    }

    const isValid: boolean = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    this.isLoading = true;
    await this.fakeLoader();
    this.isLoading = false;

    const {
      amount,
      from: {
        serial,
        currency: { code, symbol },
      },
      to,
    } = this.form;

    this.commission = {
      transactionAmount: Number(amount),
      paymentToolDetails: {
        currency: code,
        srcValue: serial,
        destValue: to,
        symbol,
      } as IPaymentToolDetails,
    } as ITransferCalculateResponse;
  }

  protected fakeLoader(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }

  protected async onMakePayment(): Promise<void> {
    await this.successModal.open();
    await this.$router.push({ name: 'user-make-payment-operations' });
  }

  protected selectTemplate(phone: string, setValueManual: Function): void {
    this.form.to = phone;
    setValueManual(phone);
  }
}
</script>
