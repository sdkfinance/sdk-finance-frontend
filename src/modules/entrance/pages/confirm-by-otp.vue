<template>
  <div class="entrance-form-container">
    <div class="hidden md:block form-entrance__logo">
      <img
        src="@/assets/images/logo.svg"
        alt="sdk.finance">
    </div>
    <p
      v-if="!!routerQueryLogin"
      class="text-base mb-24">
      {{ $t('pages.entrance.confirm_otp.successfully_registered', { login: routerQueryLogin }) }}
    </p>

    <app-form
      ref="form"
      :loading="isLoading"
      class="form-entrance form-entrance--confirm"
      :model="form"
      :rules="rules"
      @submit.native.prevent="handleForm">
      <router-link
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
          :disabled="!!routerQueryLogin"
          name="email"
          autocomplete="on"
          label="form.label.email_of_phone"
          placeholder="placeholder.input.login"/>
      </app-form-item>

      <app-form-item
        prop="otp"
        class="form-entrance__field">
        <app-input
          v-model.trim="form.otp"
          name="otp"
          autocomplete="new-password"
          label="form.label.code"
          placeholder="placeholder.input.code"/>
      </app-form-item>
      <p
        v-if="!!routerQueryLogin"
        class="entrance-form__footer text-right mb-24">
        {{ $t('pages.entrance.confirm_otp.dont_have_code') }}
        <button
          class="text-blue-600 button-as-text"
          type="button"
          @click.prevent="resendConfirm">
          {{ $t('pages.entrance.confirm_otp.resend') }}
        </button>
      </p>

      <app-form-item
        prop="password"
        class="form-entrance__field">
        <app-input
          v-model.trim="form.password"
          show-password
          name="new-pass"
          autocomplete="new-password"
          label="form.label.new_password"
          placeholder="placeholder.input.new_password"/>
      </app-form-item>
      <app-input-hint
        class="mb-24"/>

      <app-button
        type="primary"
        native-type="submit"
        class="btn-main">
        {{ $t('action.confirm') }}
      </app-button>

      <p class="entrance-form__footer entrance-form__footer--confirm entrance-form__footer--center">
        {{ $t('pages.entrance.confirm_otp.return_to') }}
        <router-link
          :to="{ name: 'sign-in' }"
          class="text-blue-600">
          {{ $t('pages.entrance.sign_in') }}
        </router-link>
      </p>
    </app-form>
  </div>
</template>

<script lang="ts">
import { LocaleMessage } from 'vue-i18n';
import {
  Component, Ref,
  Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppInputHint from '@/components/ui-kit/app-input-hint.vue';
import { EmailOrPhoneValidationRule, PasswordValidationRule, SimpleRequiredValidationRule } from '@/rules/validation';
import { AuthRequests } from '@/services/requests';
import { IConfirmUserByOtp } from '@/services/requests/auth/Auth.types';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification, successNotification } from '@/utils';

@Component({
  components: {
    AppInputHint,
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
  },
})
export default class ConfirmByOtp extends Vue {

  @Ref('form') readonly appForm!: AppForm;

  protected isMerchantAccount: boolean = false;

  protected isLoading: boolean = false;

  protected form: IConfirmUserByOtp = {
    login: '',
    otp: '',
    password: '',
  };

  protected rules: IPlainObject = {
    login: EmailOrPhoneValidationRule(true),
    password: PasswordValidationRule(),
    otp: SimpleRequiredValidationRule(),
  };

  protected get accountCreateTypeText(): LocaleMessage {
    return this.isMerchantAccount
      ? this.$t('pages.entrance.registration.need_merchant_account')
      : this.$t('pages.entrance.registration.need_individual_account');
  }

  protected get routerQueryLogin(): string {
    return (this.$route.query.login && String(this.$route.query.login)) || '';
  }

  created() {
    this.form.login = this.routerQueryLogin;
  }

  protected async handleForm(): Promise<void> {
    const isValid: boolean = await this.appForm.validate();
    if (!isValid) return;

    this.isLoading = true;
    const { error } = await AuthRequests.registrationConfirm(this.form);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    await this.$router.push({ name: 'sign-in', query: { login: this.form.login } });
  }

  protected async resendConfirm(): Promise<void> {
    this.isLoading = true;
    const { error } = await AuthRequests.resendOtpCode(this.form.login);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
  }

}
</script>

<style lang="scss">
.form-entrance--confirm {
  .text--pointer {
    padding-left: 0;
  }
}
</style>
