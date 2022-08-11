<template>
  <app-form
    ref="form"
    class="max-w-510"
    :loading="isLoading"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      prop="email">
      <app-input
        v-model="form.email"
        :disabled="isEmailConfirmed"
        placeholder="form.label.email_address"
        label="form.label.email_address"/>
    </app-form-item>
    <app-form-item
      prop="phoneNumber">
      <app-input
        v-model="form.phoneNumber"
        :disabled="isPhoneConfirmed"
        placeholder="form.label.phone_number"
        label="form.label.phone_number"/>
    </app-form-item>
    <app-form-item
      prop="otp">
      <app-input
        v-if="currentStep === formSteps.sendOtp"
        v-model="form.otp"
        placeholder="form.label.otp_code"
        label="form.label.otp_code"/>
    </app-form-item>
    <app-button
      v-if="!isContactsConfirmed"
      type="primary"
      native-type="submit"
      full-width>
      {{ $t('action.update') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import {
  Component, Ref, Vue,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { PhoneValidator } from '@/rules/validation';
import {
  successNotification, errorNotification,
} from '@/utils';
import { IUserLogin } from '@/services/requests/profiles/UserProfile.types';
import { Profile } from '@/store/modules';
import AppDatePicker from '@/components/ui-framework/app-date-picker.vue';
import { ProfileRequests } from '@/services/requests';

export interface IUserLoginDetails {
  phoneNumber?: string;
  email?: string;
  otp?: string;
}

const FORM_STEPS: { [key: string]: string } = {
  sendLogin: 'sendLogin',
  sendOtp: 'sendOtp',
};

@Component({
  components: {
    AppDatePicker,
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
  },
})
export default class ProfileLoginDetails extends Vue {

  @Ref('form') readonly appForm!: AppForm

  protected profileModule = getModule(Profile, this.$store);

  protected setForm(personContacts: IUserLoginDetails): IUserLoginDetails {
    const { phoneNumber, email } = personContacts || {};

    return {
      phoneNumber: phoneNumber || '',
      email: email || '',
      otp: '',
    };
  }

  protected form: IUserLoginDetails = this.setForm(this.personContacts);

  protected formSteps = FORM_STEPS;

  protected isLoading: boolean = false;

  protected currentStep: string = FORM_STEPS.sendLogin;

  protected rules = {
    email: [{ type: 'email', message: this.$t('validation.invalid_email') }],
    phoneNumber: PhoneValidator(false),
  };

  protected get personContacts(): IUserLogin {
    return this.profileModule.personContacts;
  }

  protected get isEmailConfirmed(): boolean {
    const { emailVerified } = this.profileModule.personContacts;
    return emailVerified!;
  }

  protected get isPhoneConfirmed(): boolean {
    const { phoneVerified } = this.profileModule.personContacts;
    return phoneVerified!;
  }

  protected get isContactsConfirmed(): boolean {
    return this.isEmailConfirmed && this.isPhoneConfirmed;
  }

  protected async handleForm(): Promise<void> {
    const isValid: boolean = await this.appForm.validate();

    const login: string = this.personContacts.email ? this.form.phoneNumber || this.form.email! : this.form.email!;

    if (!isValid) return;

    if (this.currentStep === FORM_STEPS.sendLogin) {
      this.isLoading = true;
      const { error } = await ProfileRequests.updateMyLogin(login);
      this.isLoading = false;

      if (error) {
        errorNotification(error);
        return;
      }

      this.currentStep = FORM_STEPS.sendOtp;
      successNotification('notification.otp_send');
      return;
    }

    this.isLoading = true;
    const { response, error } = await ProfileRequests.confirmUpdateMyLogin({ login, otp: this.form.otp! });
    this.isLoading = false;

    if (response) {
      this.currentStep = FORM_STEPS.sendLogin;
    }

    if (error) {
      errorNotification(error);
    }
  }

}
</script>
