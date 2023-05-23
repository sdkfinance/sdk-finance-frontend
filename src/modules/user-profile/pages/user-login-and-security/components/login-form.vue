<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      prop="email">
      <app-input
        v-model="form.email"
        :disabled="isEmailInputDisabled"
        placeholder="placeholder.input.input_email"
        label="form.label.email"/>
    </app-form-item>
    <app-form-item
      prop="phoneNumber">
      <app-input
        v-model="form.phoneNumber"
        :disabled="isPhoneInputDisabled"
        placeholder="placeholder.input.input_phone_number"
        label="form.label.phone"/>
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
      type="primary"
      native-type="submit"
      full-width>
      {{ $t('action.update') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import {
  Component, Emit,
  Prop, Ref, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import { SimpleRequiredValidationRule } from '@/rules/validation';
import { ProfileRequests, UserInfoRequests } from '@/services/requests';
import { IUserInfoResponse, IUserLogin } from '@/services/requests/profiles/UserProfile.types';
import { IApiResponse } from '@/types/interfaces';
import { errorNotification, successNotification } from '@/utils';

export interface IUserLoginDetails {
  phoneNumber: string;
  email: string;
  otp: string;
}

const setForm = (userLogin: IUserLogin): IUserLogin => {
  const { phoneNumber, email } = userLogin || {};
  return {
    phoneNumber,
    email,
  };
};

enum FORM_STEPS {
  sendLogin = 'sendLogin',
  sendOtp = 'sendOtp',
}

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
  },
})
export default class UserLoginForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Object, required: true }) private userLogin!: IUserLogin;

  @Prop({ type: Boolean, default: false }) readonly isProfileOwner!: boolean;

  protected form: Partial<IUserLoginDetails> = setForm(this.userLogin);

  protected isLoading: boolean = false;

  protected formSteps = FORM_STEPS;

  protected currentStep: string = FORM_STEPS.sendLogin;

  protected get isEmailInputDisabled(): boolean {
    if (this.userLogin.emailVerified) {
      return true;
    }

    return !this.isProfileOwner || this.currentStep === this.formSteps.sendOtp;
  }

  protected get isPhoneInputDisabled(): boolean {
    if (this.userLogin.phoneVerified) {
      return true;
    }

    return !this.isProfileOwner || this.currentStep === this.formSteps.sendOtp;
  }

  readonly userId: string = this.$route.params.id;

  public rules = {
    email: !this.isProfileOwner && [{ type: 'email', message: this.$t('validation.invalid_email') }, SimpleRequiredValidationRule()],
    phoneNumber: !this.isProfileOwner && SimpleRequiredValidationRule(),
  };

  @Emit()
  onUpdated(data: IUserInfoResponse): IUserInfoResponse {
    return data;
  }

  protected async updateCredentials(): Promise<void> {
    this.isLoading = true;
    const { error } = await this.updateUserLogin();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      this.form = setForm(this.userLogin);
      return;
    }

    this.currentStep = FORM_STEPS.sendOtp;
    successNotification('notification.otp_send');
  }

  protected updateUserLogin(): Promise<IApiResponse<any>> {
    const login: string = this.userLogin.email ? this.form.phoneNumber || this.form.email! : this.form.email!;

    if (this.isProfileOwner) {
      return ProfileRequests.updateMyLogin(login);
    }

    return UserInfoRequests.updateUserLogin(this.userId, login);
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    const login: string = this.userLogin.email ? this.form.phoneNumber || this.form.email! : this.form.email!;

    if (this.currentStep === FORM_STEPS.sendLogin) {
      await this.updateCredentials();
      return;
    }

    this.isLoading = true;
    const { response, error } = await ProfileRequests.confirmUpdateMyLogin({ login, otp: this.form.otp! });
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.form = setForm(response.profile.contact);
    this.onUpdated(response.profile);
    this.currentStep = FORM_STEPS.sendLogin;
    successNotification();
  }

}
</script>
