<template>
  <div class="entrance-form-container">
    <div
      v-if="ENV_VARIABLES.brandLogoLUrl"
      class="hidden md:block form-entrance__logo">
      <img
        :src="ENV_VARIABLES.brandLogoLUrl"
        alt="sdk.finance" />
    </div>

    <app-form
      ref="form"
      :loading="isLoading"
      class="form-entrance"
      :model="form"
      :rules="rules"
      @submit.native.prevent="handleAuth">
      <router-link
        :to="{ name: 'sign-in' }"
        class="back-pointer">
        <i class="icon-chevron-left" />
        {{ $t('action.back') }}
      </router-link>

      <recovery-success
        v-if="isSuccess"
        :login="form.login"
        :is-confirm="isConfirmPage" />
      <template v-else>
        <app-form-item
          prop="login"
          class="form-entrance__field">
          <app-input
            v-model.trim="form.login"
            :disabled="isHasLogin"
            name="email"
            autocomplete="on"
            label="form.label.email_or_phone"
            placeholder="placeholder.input.login" />
        </app-form-item>
        <app-form-item
          v-if="isConfirmPage"
          prop="otp"
          class="form-entrance__field">
          <app-input
            v-model.trim="form.otp"
            :disabled="isHasCode"
            name="code"
            autocomplete="new-password"
            label="form.label.code"
            placeholder="placeholder.input.code" />
        </app-form-item>
        <app-form-item
          v-if="isConfirmPage"
          prop="newUserPassword"
          class="form-entrance__field">
          <app-input
            v-model.trim="form.newUserPassword"
            show-password
            name="new-password"
            autocomplete="new-password"
            label="form.label.new_password"
            placeholder="placeholder.input.new_password" />
        </app-form-item>
        <app-input-hint
          v-if="isConfirmPage"
          class="mb-24" />
        <app-button
          type="primary"
          native-type="submit"
          class="btn-main form-entrance__submit">
          {{ isConfirmPage ? $t('action.confirm') : $t('action.recover') }}
        </app-button>
        <div class="entrance-form__footer entrance__info entrance__info--center mt-24 mb-0">
          {{ $t('pages.entrance.recovery.return_to_the') }}
          <router-link
            :to="{ name: 'sign-in' }"
            class="entrance__link">
            {{ $t('action.sign_in') }}
          </router-link>
        </div>
      </template>
    </app-form>
  </div>
</template>

<script lang="ts">
import { ENV_VARIABLES } from '@sdk5/shared';
import type { IPasswordRecoveryConfirmBody } from '@sdk5/shared/requests';
import { AuthRequests } from '@sdk5/shared/requests';
import type { IPlainObject } from '@sdk5/shared/types';
import { errorNotification } from '@sdk5/shared/utils';
import { EmailOrPhoneValidationRule, PasswordValidationRule, SimpleRequiredValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppForm, AppFormItem, AppInput, AppInputHint } from '@sdk5/ui-kit-entrance';
import { defineComponent } from 'vue';

import RecoverySuccess from '@/modules/entrance/components/recover-password/recovery-success.vue';

export default defineComponent({
  components: {
    AppInputHint,
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
    RecoverySuccess,
  },
  data() {
    const rules: IPlainObject = {
      login: EmailOrPhoneValidationRule(true),
      newUserPassword: PasswordValidationRule(),
      otp: SimpleRequiredValidationRule(),
    };
    const form: IPasswordRecoveryConfirmBody = {
      login: '',
      newUserPassword: '',
      otp: '',
    };
    const isLoading: boolean = false;
    const isHasCode: boolean = false;
    const isHasLogin: boolean = false;
    const isSuccess: boolean = false;

    return {
      isSuccess,
      isHasLogin,
      isHasCode,
      isLoading,
      form,
      rules,
    };
  },
  computed: {
    ENV_VARIABLES() {
      return ENV_VARIABLES;
    },
    isConfirmPage() {
      const { login, otp } = this.$route.query;
      return !!login || !!otp;
    },
    appForm: {
      cache: false,
      get() {
        return this.$refs.form as unknown as typeof AppForm;
      },
      set() {},
    },
  },
  watch: {
    '$route.query': [{ immediate: true, handler: 'onQueryChange' }],
  },
  methods: {
    async handleAuth(): Promise<void> {
      const isValid: boolean = await this.appForm.validate();

      if (!isValid) {
        return;
      }

      const { login } = this.form;

      const submitMethod = this.isConfirmPage
        ? AuthRequests.passwordRecoveryConfirm.bind(this, this.form)
        : AuthRequests.passwordRecovery.bind(this, login);

      this.isLoading = true;
      const { error } = await submitMethod();
      this.isLoading = false;

      if (error) {
        errorNotification(error);
        return;
      }

      this.isSuccess = true;
    },
    onQueryChange(query: IPlainObject = {}) {
      this.isSuccess = false;
      const { login: loginRaw, otp: otpRaw } = query;
      try {
        const [login, otp] = atob(otpRaw).split('|');
        this.form.login = login;
        this.form.otp = otp;
        this.isHasLogin = true;
        this.isHasCode = true;
      } catch (error) {
        if (loginRaw) {
          this.form.login = loginRaw;
          this.isHasLogin = true;
        }
      }
    },
  },
});
</script>
