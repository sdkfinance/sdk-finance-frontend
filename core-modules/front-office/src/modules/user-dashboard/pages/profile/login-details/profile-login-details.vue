<template>
  <app-form
    ref="appFormRef"
    class="max-w-510"
    :loading="isLoaderVisible"
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
        v-if="currentStep === FORM_STEPS.sendOtp"
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

<script setup lang="ts">
import type { IProfileContactUpdatePayload, IUserLogin } from '@sdk5/shared';
import { useGetCurrentUserProfileApi, useI18n } from '@sdk5/shared';
import { ProfileRequests } from '@sdk5/shared/requests';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { PhoneValidator } from '@sdk5/shared/validation';
import { AppButton, AppForm, AppFormItem, AppInput } from '@sdk5/ui-kit-front-office';
import type { Ref } from 'vue';
import { computed, ref, watch } from 'vue';

import type { IUserLoginDetails } from './types';

const FORM_STEPS = {
  sendLogin: 'sendLogin',
  sendOtp: 'sendOtp',
} as const;

const { t } = useI18n();

const { userContact, isFetching: isCurrentUserProfileFetching, invalidateCurrentUserCache } = useGetCurrentUserProfileApi();

const appFormRef = ref(null) as unknown as Ref<InstanceType<typeof AppForm>>;

const currentStep = ref(FORM_STEPS.sendLogin as string);
const form = ref<Partial<IUserLoginDetails>>({});
const isLoading = ref(false);

const isLoaderVisible = computed(() => isCurrentUserProfileFetching.value || isLoading.value);
const rules = computed(() => ({
  email: [
    {
      type: 'email',
      message: t('validation.invalid_email').toString(),
    },
  ],
  phoneNumber: PhoneValidator(false),
}));
const isEmailConfirmed = computed(() => !!userContact.value?.emailVerified);
const isPhoneConfirmed = computed(() => !!userContact.value?.phoneVerified);
const isContactsConfirmed = computed(() => isEmailConfirmed.value && isPhoneConfirmed.value);

const setForm = (personContacts: IUserLogin): IUserLoginDetails => {
  const { phoneNumber, email } = personContacts || {};

  return {
    phoneNumber: phoneNumber,
    email: email,
    otp: '',
  };
};
const handleForm = async () => {
  if (!(await appFormRef.value.validate())) {
    return;
  }

  const { phoneNumber, email } = form.value as IUserLoginDetails;

  const updateContactPayload: IProfileContactUpdatePayload = {};

  if (isEmailConfirmed.value) {
    updateContactPayload.primaryPhoneNumber = phoneNumber;
  } else if (isPhoneConfirmed.value) {
    updateContactPayload.email = email;
  }

  if (currentStep.value === FORM_STEPS.sendLogin) {
    isLoading.value = true;
    const { error } = await ProfileRequests.updateMyContactRequest(updateContactPayload);
    isLoading.value = false;

    if (error) {
      errorNotification(error);
      return;
    }

    currentStep.value = FORM_STEPS.sendOtp;
    successNotification('notification.otp_send');
    return;
  }

  isLoading.value = true;
  const confirmUpdateContactRequestLogin = updateContactPayload.primaryPhoneNumber ?? updateContactPayload.email;

  if (!confirmUpdateContactRequestLogin) {
    throw new Error('Confirm update contact request login is not defined');
  }

  const { response, error } = await ProfileRequests.confirmUpdateMyContactRequest({
    login: confirmUpdateContactRequestLogin,
    otp: form.value.otp!,
  });
  isLoading.value = false;

  if (response) {
    currentStep.value = FORM_STEPS.sendLogin;
    form.value = setForm(response.profile.contact);
    currentStep.value = FORM_STEPS.sendLogin;
    await invalidateCurrentUserCache();
    successNotification();
  }

  if (error) {
    errorNotification(error);
  }
};

watch(
  userContact,
  (contactData?: IUserLogin) => {
    if (contactData) {
      form.value = setForm(contactData);
    }
  },
  { immediate: true },
);
</script>
