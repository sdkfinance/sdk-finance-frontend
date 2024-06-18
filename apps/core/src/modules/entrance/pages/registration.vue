<template>
  <div class="entrance-form-container">
    <div class="hidden md:block form-entrance__logo">
      <img
        src="@/assets/images/logo.svg"
        alt="sdk.finance" />
    </div>

    <app-form
      ref="appFormRef"
      :loading="isLoading"
      class="form-entrance form-entrance--registration"
      :model="form"
      :rules="rules"
      @submit.native.prevent="handleForm">
      <router-link
        :to="{ name: 'entrance' }"
        class="back-pointer">
        <i class="icon-chevron-left" />
        {{ $t('action.back') }}
      </router-link>

      <app-form-item
        prop="login"
        class="form-entrance__field">
        <app-input
          v-model.trim="form.login"
          name="email"
          autocomplete="on"
          label="form.label.login"
          placeholder="placeholder.input.login" />
      </app-form-item>

      <div
        v-if="!isWebview"
        class="text-right">
        <button
          class="button-role button-as-text"
          @click.prevent="toggleMerchantAccount">
          {{ $t(accountCreateTypeText) }}
        </button>
      </div>

      <div
        v-if="isMerchantAccount"
        class="legal-type">
        <p>{{ $t('pages.entrance.registration.legal_type') }}:</p>

        <app-radio
          v-model="form.legalType"
          :options="merchantLegalTypes"
          class="type-options" />
      </div>

      <app-button
        type="primary"
        native-type="submit"
        class="btn-main"
        full-width>
        {{ $t('action.sign_up') }}
      </app-button>

      <p class="entrance-form__footer text-right mt-10">
        {{ $t('pages.entrance.registration.have_otp') }}
        <router-link
          class="text-blue-600"
          :to="{ name: 'confirm-by-otp' }">
          {{ $t('pages.entrance.registration.confirm_by_otp') }}
        </router-link>
      </p>
    </app-form>

    <p class="entrance-form__footer">
      {{ $t('pages.entrance.registration.go_to') }}
      <router-link :to="{ name: 'sign-in' }">
        {{ $t('pages.entrance.sign_in') }}
      </router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useIsUaWebview } from '@sdk5/shared/composables';
import type { IRegisterUser } from '@sdk5/shared/requests';
import { AuthRequests } from '@sdk5/shared/requests';
import type { IOption, IPlainObject } from '@sdk5/shared/types';
import { errorNotification } from '@sdk5/shared/utils';
import { EmailOrPhoneValidationRule, SimpleRequiredValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppForm, AppFormItem, AppInput, AppRadio } from '@sdk5/ui-kit-entrance';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router/composables';

const router = useRouter();
const { isWebview } = useIsUaWebview();

const rules: IPlainObject = {
  login: EmailOrPhoneValidationRule(true),
  role: SimpleRequiredValidationRule(),
};
const merchantLegalTypes: IOption[] = [
  {
    label: 'pages.entrance.registration.individual',
    value: 'individual',
  },
  {
    label: 'pages.entrance.registration.corporation',
    value: 'corporation',
  },
];
const appFormRef = ref(null as unknown as InstanceType<typeof AppForm>);
const isLoading = ref(false);
const isMerchantAccount = ref(false);
const form = ref<IRegisterUser>({
  login: '',
  role: 'individual',
  legalType: 'individual',
});

const accountCreateTypeText = computed(() =>
  isMerchantAccount.value ? 'pages.entrance.registration.need_individual_account' : 'pages.entrance.registration.need_merchant_account',
);

const toggleMerchantAccount = () => {
  form.value.role = isMerchantAccount.value ? 'individual' : 'merchant';
  isMerchantAccount.value = !isMerchantAccount.value;
};

const handleForm = async () => {
  const isValid: boolean = await appFormRef.value.validate();

  if (!isValid) {
    return;
  }

  const sendData = { ...form.value };

  if (sendData.role === 'individual') {
    delete sendData.legalType;
  }

  isLoading.value = true;
  const { error } = await AuthRequests.registerUser(sendData);
  isLoading.value = false;

  if (error) {
    errorNotification(error);
    return;
  }

  router.push({ name: 'confirm-by-otp', query: { login: form.value.login } });
};
</script>

<style lang="scss">
.form-entrance--registration {
  .button-role {
    @apply text-right text-base text-blue-600 cursor-pointer mb-20 border-none;

    &:hover {
      @apply text-blue-accent;
    }
  }

  .legal-type {
    @apply text-left;

    .type-options {
      @apply flex flex-col mb-20;
    }
  }
}
</style>
