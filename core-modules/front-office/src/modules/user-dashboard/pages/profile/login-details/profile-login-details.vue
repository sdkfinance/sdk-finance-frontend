<template>
  <app-form
    ref="form"
    class="max-w-510"
    :loading="isLoading"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item prop="email">
      <app-input
        v-model="form.email"
        :disabled="isEmailConfirmed"
        placeholder="form.label.email_address"
        label="form.label.email_address" />
    </app-form-item>
    <app-form-item prop="phoneNumber">
      <app-input
        v-model="form.phoneNumber"
        :disabled="isPhoneConfirmed"
        placeholder="form.label.phone_number"
        label="form.label.phone_number" />
    </app-form-item>
    <app-form-item prop="otp">
      <app-input
        v-if="currentStep === formSteps.sendOtp"
        v-model="form.otp"
        placeholder="form.label.otp_code"
        label="form.label.otp_code" />
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
import type { IUserLogin } from '@sdk5/shared/requests';
import { ProfileRequests } from '@sdk5/shared/requests';
import { Profile } from '@sdk5/shared/store';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { PhoneValidator } from '@sdk5/shared/validation';
import { AppButton, AppDatePicker, AppForm, AppFormItem, AppInput } from '@sdk5/ui-kit-front-office';
import { Component, Ref, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import type { IUserLoginDetails } from './types';

const FORM_STEPS: { [key: string]: string } = {
  sendLogin: 'sendLogin',
  sendOtp: 'sendOtp',
};

@Component({
  name: 'profile-login-details',
  components: {
    AppDatePicker,
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
  },
})
export default class ProfileLoginDetails extends Vue {
  @Ref('form') readonly appForm!: AppForm;

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

  protected async fetchProfile() {
    this.isLoading = true;
    await this.profileModule.getProfile();
    this.isLoading = false;
  }

  protected async handleForm(): Promise<void> {
    const isValid: boolean = await this.appForm.validate();

    const login: string = this.personContacts.email ? this.form.phoneNumber || this.form.email! : this.form.email!;

    if (!isValid) {
      return;
    }

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
      this.form = this.setForm(response.profile.contact);
      this.currentStep = FORM_STEPS.sendLogin;
      await this.fetchProfile();
      successNotification();
    }

    if (error) {
      errorNotification(error);
    }
  }
}
</script>
