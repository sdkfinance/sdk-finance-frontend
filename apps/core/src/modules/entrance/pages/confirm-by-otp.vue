<template>
  <div class="entrance-form-container">
    <div
      v-if="ENV_VARIABLES.brandLogoLUrl"
      class="hidden md:block form-entrance__logo">
      <img
        :src="ENV_VARIABLES.brandLogoLUrl"
        alt="sdk.finance" />
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
        <i class="icon-chevron-left" />
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
          label="form.label.email_or_phone"
          placeholder="placeholder.input.login" />
      </app-form-item>

      <app-form-item
        prop="otp"
        class="form-entrance__field">
        <app-input
          v-model.trim="form.otp"
          name="otp"
          autocomplete="new-password"
          label="form.label.code"
          placeholder="placeholder.input.code" />
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
          placeholder="placeholder.input.new_password" />
      </app-form-item>
      <app-input-hint class="mb-24" />

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
import { ENV_VARIABLES } from '@sdk5/shared';
import type { IConfirmUserByOtp } from '@sdk5/shared/requests';
import { AuthRequests } from '@sdk5/shared/requests';
import type { IPlainObject } from '@sdk5/shared/types';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { EmailOrPhoneValidationRule, PasswordValidationRule, SimpleRequiredValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppForm, AppFormItem, AppInput, AppInputHint } from '@sdk5/ui-kit-entrance';
import { defineComponent } from 'vue';
import type { LocaleMessage } from 'vue-i18n';

export default defineComponent({
  components: {
    AppInputHint,
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
  },
  data() {
    const rules: IPlainObject = {
      login: EmailOrPhoneValidationRule(true),
      password: PasswordValidationRule(),
      otp: SimpleRequiredValidationRule(),
    };
    const form: IConfirmUserByOtp = {
      login: '',
      otp: '',
      password: '',
    };
    const isLoading: boolean = false;
    const isMerchantAccount: boolean = false;

    return {
      isMerchantAccount,
      isLoading,
      form,
      rules,
    };
  },
  computed: {
    ENV_VARIABLES() {
      return ENV_VARIABLES;
    },
    accountCreateTypeText(): LocaleMessage {
      return this.isMerchantAccount
        ? this.$t('pages.entrance.registration.need_merchant_account')
        : this.$t('pages.entrance.registration.need_individual_account');
    },
    routerQueryLogin(): string {
      return (this.$route.query.login && String(this.$route.query.login)) || '';
    },
    appForm: {
      cache: false,
      get() {
        return this.$refs.form as unknown as typeof AppForm;
      },
      set() {},
    },
  },
  created() {
    this.form.login = this.routerQueryLogin;
  },
  methods: {
    async handleForm(): Promise<void> {
      const isValid: boolean = await this.appForm.validate();

      if (!isValid) {
        return;
      }

      this.isLoading = true;
      const { error } = await AuthRequests.registrationConfirm(this.form);
      this.isLoading = false;

      if (error) {
        errorNotification(error);
        return;
      }

      await this.$router.push({ name: 'sign-in', query: { login: this.form.login } });
    },
    async resendConfirm(): Promise<void> {
      this.isLoading = true;
      const { error } = await AuthRequests.resendOtpCode(this.form.login);
      this.isLoading = false;

      if (error) {
        errorNotification(error);
        return;
      }

      successNotification();
    },
  },
});
</script>

<style lang="scss">
.form-entrance--confirm {
  .text--pointer {
    padding-left: 0;
  }
}
</style>
