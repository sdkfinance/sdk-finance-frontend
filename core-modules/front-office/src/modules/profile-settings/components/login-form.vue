<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item prop="email">
      <app-input
        v-model="form.email"
        :disabled="isEmailInputDisabled"
        placeholder="placeholder.input.input_email"
        label="form.label.email" />
    </app-form-item>
    <app-form-item prop="phoneNumber">
      <app-input
        v-model="form.phoneNumber"
        :disabled="isPhoneInputDisabled"
        placeholder="placeholder.input.input_phone_number"
        label="form.label.phone" />
    </app-form-item>
    <app-form-item prop="otp">
      <app-input
        v-if="currentStep === formSteps.sendOtp"
        v-model="form.otp"
        placeholder="form.label.otp_code"
        label="form.label.otp_code" />
    </app-form-item>
    <app-button
      v-if="isSubmitButtonVisible"
      type="primary"
      native-type="submit"
      full-width>
      {{ $t('action.update') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import { ROLES } from '@sdk5/shared/constants';
import type { IGetUserInfoResponse, IUserInfoResponse, IUserLogin } from '@sdk5/shared/requests';
import { ProfileRequests, UserInfoRequests } from '@sdk5/shared/requests';
import { Profile } from '@sdk5/shared/store';
import type { IApiResponse } from '@sdk5/shared/types';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { SimpleRequiredValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppForm, AppFormItem, AppInput } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Ref, Vue, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import type { IUserLoginDetails } from './types';

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
  @Ref('form') readonly appForm!: typeof AppForm;

  @Prop({ type: Object as PropType<IUserLogin>, required: true }) private userLogin!: IUserLogin;

  @Prop({ type: Boolean, default: false }) readonly isProfileOwner!: boolean;

  @Prop({ type: Boolean, default: true }) isUpdatedAllowed!: boolean;

  protected form: Partial<IUserLoginDetails> = setForm(this.userLogin);

  protected isLoading: boolean = false;

  protected formSteps = FORM_STEPS;

  protected currentStep: string = FORM_STEPS.sendLogin;

  protected profileModule = getModule(Profile, this.$store);

  protected get isAdminRole() {
    return this.profileModule.role === ROLES.administrator;
  }

  protected get isOtpStep() {
    return this.currentStep === this.formSteps.sendOtp;
  }

  protected get isEmailInputDisabled(): boolean {
    if (this.isAdminRole && !this.userLogin.emailVerified) {
      return false;
    }

    if (this.userLogin.emailVerified) {
      return true;
    }

    return !this.isProfileOwner || this.isOtpStep;
  }

  protected get isPhoneInputDisabled(): boolean {
    if (this.isAdminRole && !this.userLogin.phoneVerified) {
      return false;
    }

    if (this.userLogin.phoneVerified) {
      return true;
    }

    return !this.isProfileOwner || this.isOtpStep;
  }

  protected get isContactsConfirmed() {
    return this.isEmailInputDisabled && this.isPhoneInputDisabled;
  }

  protected get isSubmitButtonVisible() {
    return (!this.isContactsConfirmed || this.isOtpStep) && this.isUpdatedAllowed;
  }

  readonly userId: string = this.$route.params.id;

  public rules = {
    email: !this.isProfileOwner &&
      !this.isAdminRole && [{ type: 'email', message: this.$t('validation.invalid_email') }, SimpleRequiredValidationRule()],
    phoneNumber: !this.isProfileOwner && !this.isAdminRole && SimpleRequiredValidationRule(),
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

  protected onProfileUpdate(data: IGetUserInfoResponse) {
    this.form = setForm(data.profile.contact);
    this.onUpdated(data.profile);
    this.currentStep = FORM_STEPS.sendLogin;
    successNotification();
  }

  protected async updateProfileContactWithoutConfirmation(login: string) {
    this.isLoading = true;
    const { response, error } = await ProfileRequests.updateProfileContactAdmin(this.userId, { login });
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.onProfileUpdate(response);
  }

  protected async handleForm(): Promise<void> {
    if (!this.isUpdatedAllowed) {
      return;
    }

    const isValid = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    const login: string = this.userLogin.email ? this.form.phoneNumber || this.form.email! : this.form.email!;

    if (this.isAdminRole) {
      await this.updateProfileContactWithoutConfirmation(login);
      return;
    }

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

    this.onProfileUpdate(response);
  }

  @Watch('userLogin', { immediate: true })
  protected userLoginChangeHandler(value?: IUserLogin) {
    if (value) {
      this.form = setForm(value);
    }
  }
}
</script>
