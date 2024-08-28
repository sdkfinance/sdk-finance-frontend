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
      ref="appFormRef"
      :loading="isLoading"
      class="form-entrance"
      :model="form"
      :rules="rules"
      @submit.native.prevent="handleAuth">
      <router-link
        v-if="isDemoMode"
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
          :disabled="isOtpSend"
          name="email"
          autocomplete="on"
          label="form.label.login"
          placeholder="placeholder.input.login" />
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
          placeholder="placeholder.input.password" />
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
          placeholder="placeholder.input.otp_code" />
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
        class="btn-main"
        full-width>
        {{ $t('action.sign_in') }}
      </app-button>
    </app-form>

    <p class="entrance-form__footer">
      {{ $t('pages.entrance.dont_have_account') }}

      <router-link :to="{ name: 'registration' }">
        {{ $t('action.sign_up') }}
      </router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { UserDataService } from '@sdk5/shared';
import { useDashboardNameByRole, useIsUaWebview } from '@sdk5/shared/composables';
import { ENV_VARIABLES, ROLES } from '@sdk5/shared/constants';
import { AuthRequests } from '@sdk5/shared/requests';
import { checkMobile, errorNotification, successNotification } from '@sdk5/shared/utils';
import { EmailOrPhoneValidationRule, SimpleRequiredValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppForm, AppFormItem, AppInput } from '@sdk5/ui-kit-entrance';
import type { Ref } from 'vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router/composables';

import { useOpenDashboardRoute } from '../composables/useOpenDashboardRoute';

const { getDashboardName } = useDashboardNameByRole();
const { openDashboardRoute } = useOpenDashboardRoute();

const rules = {
  login: EmailOrPhoneValidationRule(true),
  password: SimpleRequiredValidationRule(),
};
const route = useRoute();
const { isWebview } = useIsUaWebview();
const appFormRef = ref(null) as unknown as Ref<InstanceType<typeof AppForm>>;
const isLoading = ref(false);
const isOtpSend = ref(false);
const form = ref({
  login: '',
  password: '',
  otp: '',
});

const isDemoMode = computed(() => import.meta.env.VUE_APP_DEMO_MODE === 'true');

const resendOtp = async () => {
  const isValid = await appFormRef.value.validateField('login');

  if (!isValid) {
    return;
  }

  isLoading.value = true;
  const { error } = await AuthRequests.authorizationResendOtpCode(form.value.login);
  isLoading.value = false;

  if (error) {
    errorNotification(error);
    return;
  }

  successNotification('notification.otp_send');
};

const handleAuth = async () => {
  const isValid: boolean = await appFormRef.value.validate();

  if (!isValid) {
    return;
  }

  const { login, password, otp } = form.value;

  isLoading.value = true;
  const { response, error } = await (isOtpSend.value ? UserDataService.loginConfirm({ login, otp }) : UserDataService.login({ login, password }));
  isLoading.value = false;

  if (error) {
    if (error.code === 'exception.confirmation_code.not_found') {
      errorNotification('notification.otp_incorrect');
      return;
    }

    errorNotification(error);
    return;
  }

  if (response?.action === 'OTP_SENT') {
    successNotification('notification.otp_send');
    isOtpSend.value = true;
    return;
  }

  const role = response?.members?.at(0)?.role;

  if (!role) {
    throw new Error('Role is not defined');
  }

  if ((isWebview || checkMobile()) && role !== ROLES.individual) {
    errorNotification('notification.login_not_allowed_from_mobile');
    return;
  }

  openDashboardRoute(getDashboardName(role));
};

onMounted(() => {
  form.value.login = (route.query.login && String(route.query.login)) || '';
});
</script>
