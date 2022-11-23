<template>
  <div class="entrance-form-container">
    <div class="hidden md:block form-entrance__logo">
      <img
        src="@/assets/images/logo.svg"
        alt="sdk.finance">
    </div>

    <app-form
      ref="form"
      :loading="isLoading"
      class="form-entrance"
      :model="form"
      :rules="rules"
      @submit.native.prevent="handleAuth">
      <router-link
        v-if="isDemoMode"
        :to="{ name: 'sign-in' }"
        class="back-pointer">
        <i class="icon-arrow-left"/>
        {{ $t('action.back') }}
      </router-link>

      <app-form-item
        prop="login"
        class="form-entrance__field">
        <app-input
          v-model.trim="form.login"
          :disabled="isOtpSend"
          name="email"
          autocomplete="on"
          label="form.label.login"
          placeholder="placeholder.input.login"/>
      </app-form-item>

      <app-form-item
        v-if="!isOtpSend"
        prop="password"
        class="form-entrance__field">
        <app-input
          v-model.trim="form.password"
          show-password
          name="password"
          autocomplete="on"
          label="form.label.password"
          placeholder="placeholder.input.password"/>
      </app-form-item>

      <app-form-item
        v-else
        prop="otp"
        class="form-entrance__field">
        <app-input
          v-model.trim="form.otp"
          show-password
          name="otp"
          autocomplete="on"
          label="form.label.otp_code"
          placeholder="placeholder.input.otp_code"/>
      </app-form-item>

      <button
        v-if="isOtpSend"
        type="button"
        class="entrance__link"
        @click="resendOtp">
        {{ $t('action.resend_otp') }}
      </button>

      <router-link
        v-else
        :to="{ name: 'recover-password' }"
        class="entrance__link mb-16">
        {{ $t('action.forgot_password') }}
      </router-link>

      <app-button
        type="primary"
        native-type="submit"
        class="btn-main">
        {{ $t('action.sign_in') }}
      </app-button>
    </app-form>

    <p class="entrance-form__footer ">
      {{ $t('pages.entrance.dont_have_account') }}

      <router-link :to="{ name: 'registration'}">
        {{ $t('action.sign_up') }}
      </router-link>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import { ACCOUNTS, ROLES } from '@/constants';
import { EmailOrPhoneValidationRule, SimpleRequiredValidationRule } from '@/rules/validation';
import { AuthRequests } from '@/services/requests';
import { UserData } from '@/store/modules';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification, successNotification } from '@/utils';

const ACCOUNTS_PRODUCTION = ACCOUNTS.filter((account) => (
  ['Individual', 'Merchant', 'Administrator', 'Accountant', 'Compliance manager'].includes(account.label)));

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
    AppSelect,
  },
})
export default class SignInManual extends Vue {

  @Ref('form') readonly appForm!: AppForm;

  protected userDataModule = getModule(UserData, this.$store);

  protected form: IPlainObject = {
    login: '',
    password: '',
    otp: '',
  };

  protected rules: IPlainObject = {
    login: EmailOrPhoneValidationRule(true),
    password: SimpleRequiredValidationRule(),
  };

  protected get accounts(): IPlainObject {
    return process.env.NODE_ENV === 'production' ? ACCOUNTS_PRODUCTION : ACCOUNTS;
  }

  protected get role(): string {
    return this.userDataModule.role;
  }

  protected get isDemoMode(): boolean {
    return process.env.VUE_APP_DEMO_MODE === 'true';
  }

  protected isOtpSend: boolean = false;

  protected currentYear: number = new Date().getFullYear();

  protected isLoading: boolean = false;

  protected created(): void {
    this.form.login = (this.$route.query.login && String(this.$route.query.login)) || '';
  }

  protected async handleAuth(): Promise<void> {
    const isValid: boolean = await this.appForm.validate();

    if (!isValid) return;

    const { login, password, otp } = this.form;

    this.isLoading = true;
    const { response, error } = this.isOtpSend
      ? await this.userDataModule.loginConfirm({ login, otp })
      : await this.userDataModule.login({ login, password });
    this.isLoading = false;

    if (error) {
      if (error.code === 'exception.confirmation_code.not_found') {
        errorNotification('notification.otp_incorrect');
        return;
      }

      errorNotification(error);
      return;
    }

    if (response.action === 'OTP_SENT') {
      successNotification('notification.otp_send');
      this.isOtpSend = true;
      return;
    }

    const routeName = this.role === ROLES.individual ? 'user-dashboard' : 'dashboard';

    await this.$router.push({ name: routeName });
  }

  protected async resendOtp(): Promise<void> {
    const isValid = await this.appForm.validateField('login');
    if (!isValid) {
      return;
    }

    this.isLoading = true;
    const { error } = await AuthRequests.authorizationResendOtpCode(this.form.login);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }
    successNotification('notification.otp_send');
  }

}
</script>
