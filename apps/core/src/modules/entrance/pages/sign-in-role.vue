<template>
  <div class="entrance-form-container sign-in-role">
    <div class="hidden md:block form-entrance__logo">
      <img
        src="@/assets/images/logo.svg"
        alt="sdk.finance" />
    </div>

    <app-form
      :loading="isLoading"
      class="form-entrance"
      :model="form"
      :rules="{}"
      @submit.native.prevent="handleAuth">
      <app-select
        v-model="currentAccount"
        clearable
        full-width
        class="el-form-item"
        label="form.label.role"
        placeholder="placeholder.select.choose_role"
        value-key="login"
        :options="accounts"
        option-label="label"
        @change="onAccountChange" />

      <app-form-item
        v-if="isOtpSend"
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

      <app-button
        type="primary"
        native-type="submit"
        class="btn-main"
        full-width>
        {{ $t('action.sign_in') }}
      </app-button>
    </app-form>

    <router-link
      :to="{ name: 'sign-in-manual' }"
      class="text-blue-600 link-manual">
      {{ $t('pages.entrance.sign_in_manual') }}
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { useDashboardNameByRole, useGetVuexModule, useIsUaWebview } from '@sdk5/shared/composables';
import { ACCOUNTS, WEB_VIEW_ACCOUNTS } from '@sdk5/shared/constants';
import { UserData } from '@sdk5/shared/store';
import type { IPlainObject } from '@sdk5/shared/types';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { AppButton, AppForm, AppFormItem, AppInput, AppSelect } from '@sdk5/ui-kit-entrance';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router/composables';

import { useOpenDashboardRoute } from '../composables/useOpenDashboardRoute';

const AVAILABLE_ACCOUNTS = ACCOUNTS.filter((account) => {
  return (
    (account.module === 'front-office' && import.meta.env.VUE_APP_FRONT_OFFICE_ROUTES !== 'false') ||
    (account.module === 'back-office' && import.meta.env.VUE_APP_BACK_OFFICE_ROUTES !== 'false')
  );
});

const ACCOUNTS_PRODUCTION = AVAILABLE_ACCOUNTS.filter((account) =>
  ['Individual', 'Merchant', 'Administrator', 'Accountant', 'Compliance manager'].includes(account.label),
);

const userDataModule = useGetVuexModule(UserData);
const { isWebview } = useIsUaWebview();
const { getDashboardName } = useDashboardNameByRole();
const { openDashboardRoute } = useOpenDashboardRoute();

const route = useRoute();

const isLoading = ref(false);
const isOtpSend = ref(false);
const currentAccount = ref({} as IPlainObject);
const form = ref({
  login: '',
  password: '',
  otp: '',
});

const role = computed(() => userDataModule.role);
const accounts = computed(() => {
  if (isWebview) {
    return WEB_VIEW_ACCOUNTS;
  }

  return import.meta.env.MODE === 'production' ? ACCOUNTS_PRODUCTION : AVAILABLE_ACCOUNTS;
});

const onAccountChange = (option: IPlainObject) => {
  form.value.login = option.login;
  form.value.password = option.password;
};
const handleAuth = async () => {
  const { login, password, otp } = form.value;

  isLoading.value = true;
  const { response, error } = isOtpSend.value ? await userDataModule.loginConfirm({ login, otp }) : await userDataModule.login({ login, password });
  isLoading.value = false;

  if (error !== null) {
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

  openDashboardRoute(getDashboardName(role.value));
};

onMounted(() => {
  form.value.login = (route.query.login && String(route.query.login)) || '';
});
</script>

<style lang="scss">
.sign-in-role {
  .link-manual {
    @apply text-base underline;
  }
}
</style>
