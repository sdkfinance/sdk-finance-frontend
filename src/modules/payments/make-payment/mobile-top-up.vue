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
                label="form.label.from_account"/>
            </app-form-item>

            <app-form-item prop="to">
              <app-custom-select
                v-model="form.to"
                label="form.label.name_or_phone_number"
                placeholder="form.label.phone_number"
                input-placeholder="form.label.phone_number"
                options-title="form.label.my_phone_numbers">
                <template #options="{setValueManual}">
                  <app-custom-select-option
                    :color="profileContacts.contactColor"
                    :title="profileContacts.contactPhone"
                    subtitle="Ukraine"
                    :custom-initials="profileContacts.countryCode"
                    :is-action-available="false"
                    @click="selectTemplate(profileContacts.contactPhone, setValueManual)"/>
                  <app-custom-select-option
                    :color="profileContacts.loginColor"
                    :title="profileContacts.loginPhone"
                    subtitle="Ukraine"
                    :custom-initials="profileContacts.countryCode"
                    :is-action-available="false"
                    @click="selectTemplate(profileContacts.loginPhone, setValueManual)"/>
                </template>
              </app-custom-select>
            </app-form-item>

            <app-form-item
              prop="amount">
              <app-input
                v-model.trim="form.amount"
                name="amount"
                size="big"
                autocomplete="off"
                label="form.label.payment_amount"
                placeholder="placeholder.input.input_amount"/>
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
            <mobile-transfer-details :data="commission"/>
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
        <template #default="{onSubmit}">
          <app-info-modal
            title="pages.user_dashboard.payments.payment_success_title"
            subtitle="pages.user_dashboard.payments.payment_success_info"
            :type="infoModalTypes.success"
            :is-cancel-visible="false"
            @confirm="onSubmit"/>
        </template>
      </app-modal>
    </template>
  </app-step-controller>
</template>

<script lang="ts">
import {
  Vue, Component, Ref, Watch,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { debounce } from 'lodash';
import AppStepController from '@/components/ui-kit/app-step-controller.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppFormWrapper from '@/components/ui-kit/modals/app-form-wrapper.vue';
import AppSelectCustomOption from '@/components/ui-framework/app-select/app-select-custom-option.vue';
import AppInfoModal, { InfoModalTypes } from '@/components/ui-kit/modals/app-info-modal.vue';
import AppModal from '@/components/ui-kit/modals/app-modal.vue';
import { IPlainObject } from '@/types/interfaces';
import AppCustomSelect from '@/components/ui-kit/app-custom-select/app-custom-select.vue';
import AppCustomSelectOption from '@/components/ui-kit/app-custom-select/app-custom-select-option.vue';
import { OnChangeRequiredValidationRule, SimpleNumberValidationRule } from '@/rules/validation';
import AccountSelect from '@/modules/user-dashboard/components/account-select.vue';
import MobileTransferDetails
  from '@/modules/payments/make-payment/components/mobile-transfer-details.vue';
import { Profile } from '@/store/modules';
import OperationCommission from '@/modules/user-dashboard/components/operation-commission.vue';
import { categoryColors } from '@/components/ui-kit/colors';
import config from '@/config';
import { getProp } from '@/utils';

@Component({
  components: {
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
  },
})
export default class MobileTopUp extends Vue {

    @Ref('form') readonly appForm!: AppForm;

    @Ref('successModal') readonly successModal!: AppModal;

    protected isLoading: boolean = false;

    protected infoModalTypes = InfoModalTypes;

    protected commission: IPlainObject = {};

    protected profileModule = getModule(Profile, this.$store);

    readonly emptyChar: string = config.emptyChar;

    protected getProp = getProp;

    protected form: IPlainObject = {
      from: '',
      to: '',
      amount: '',
    }

    protected rules: IPlainObject = {
      from: OnChangeRequiredValidationRule(),
      to: SimpleNumberValidationRule(),
      amount: SimpleNumberValidationRule(),
    };

    protected get isCommissionCalculated(): boolean {
      return !!this.commission?.paymentToolDetails;
    }

    protected get profileContacts(): IPlainObject {
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
      this.commission = {};
      this.debouncedCommissionCalculation();
    }

    protected async handleForm(onNextStep: Function): Promise<void> {
      const isValid: boolean = await this.appForm.validate();

      if (!isValid) return;

      if (this.isCommissionCalculated) {
        onNextStep();
        return;
      }
      await this.onCalculateCommission();
    }

    protected debouncedCommissionCalculation = debounce(this.onCalculateCommission, 500)

    protected async onCalculateCommission(): Promise<void> {
      if (!this.form.amount) {
        return;
      }
      const isValid: boolean = await this.appForm.validate();

      if (!isValid) return;

      this.isLoading = true;
      await this.fakeLoader();
      this.isLoading = false;

      const { amount, from: { serial, issuer: { currency, symbol } }, to } = this.form;

      this.commission = {
        transactionAmount: amount,
        paymentToolDetails: {
          currency,
          srcValue: serial,
          destValue: to,
          symbol,
        },
      };
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
