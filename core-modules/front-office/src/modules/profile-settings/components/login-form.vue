<template>
  <app-form
    ref="appFormRef"
    :loading="isLoaderVisible"
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

<script setup lang="ts">
import { useGetCurrentUserProfileApi } from '@sdk5/shared/composables';
import { ROLES } from '@sdk5/shared/constants';
import { useI18n } from '@sdk5/shared/i18n';
import type { IGetUserInfoResponse, IProfileContactUpdatePayload, IUserInfoResponse, IUserLogin } from '@sdk5/shared/requests';
import { ProfileRequests } from '@sdk5/shared/requests';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { SimpleRequiredValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppForm, AppFormItem, AppInput } from '@sdk5/ui-kit-back-office';
import type { Ref } from 'vue';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router/composables';

import type { IUserLoginDetails } from './types';

const { userRole, isFetching: isCurrentUserProfileFetching } = useGetCurrentUserProfileApi();

const setForm = (userLogin: IUserLogin): IUserLogin => {
  const { phoneNumber, email } = userLogin || {};
  return {
    phoneNumber,
    email,
  };
};

const props = withDefaults(
  defineProps<{
    userLogin: IUserLogin;
    isProfileOwner?: boolean;
    isUpdatedAllowed?: boolean;
  }>(),
  {
    isProfileOwner: false,
    isUpdatedAllowed: true,
  },
);
const emit = defineEmits<{
  (event: 'onUpdated', payload: IUserInfoResponse): void;
  (event: 'updated', payload: IUserInfoResponse): void;
}>();

const FORM_STEPS = {
  sendLogin: 'sendLogin',
  sendOtp: 'sendOtp',
} as const;

const formSteps = FORM_STEPS;

const { t } = useI18n();
const route = useRoute();

const appFormRef = ref(null) as unknown as Ref<InstanceType<typeof AppForm>>;
const currentStep = ref(FORM_STEPS.sendLogin as string);
const isLoading = ref(false);
const form = ref<Partial<IUserLoginDetails>>(setForm(props.userLogin));

const userId = computed(() => route.params.id as string);
const isLoaderVisible = computed(() => isCurrentUserProfileFetching.value || isLoading.value);
const isAdminRole = computed(() => userRole.value === ROLES.administrator);
const rules = computed(() => ({
  email: !props.isProfileOwner && !isAdminRole.value && [{ type: 'email', message: t('validation.invalid_email') }, SimpleRequiredValidationRule()],
  phoneNumber: !props.isProfileOwner && !isAdminRole.value && SimpleRequiredValidationRule(),
}));
const isOtpStep = computed(() => currentStep.value === formSteps.sendOtp);
const isEmailInputDisabled = computed(() => {
  if (isAdminRole.value && !props.userLogin.emailVerified) {
    return false;
  }

  if (props.userLogin.emailVerified) {
    return true;
  }

  return !props.isProfileOwner || isOtpStep.value;
});
const isPhoneInputDisabled = computed(() => {
  if (isAdminRole.value && !props.userLogin.phoneVerified) {
    return false;
  }

  if (props.userLogin.phoneVerified) {
    return true;
  }

  return !props.isProfileOwner || isOtpStep.value;
});
const isContactsConfirmed = computed(() => isEmailInputDisabled.value && isPhoneInputDisabled.value);
const isSubmitButtonVisible = computed(() => (!isContactsConfirmed.value || isOtpStep.value) && props.isUpdatedAllowed);

const onUpdated = (data: IUserInfoResponse) => {
  emit('onUpdated', data);
  emit('updated', data);
};

const onProfileUpdate = (data: IGetUserInfoResponse) => {
  form.value = setForm(data.profile.contact);
  onUpdated(data.profile);
  currentStep.value = FORM_STEPS.sendLogin;
  successNotification();
};

const getUpdateContactPayload = (formData: IUserLoginDetails, currentContactData: IUserLogin): IProfileContactUpdatePayload => {
  const payload: IProfileContactUpdatePayload = {};
  const { email, phoneNumber } = formData;
  const { emailVerified, phoneVerified } = currentContactData;

  if (emailVerified) {
    payload.primaryPhoneNumber = phoneNumber;
  } else if (phoneVerified) {
    payload.email = email;
  }

  return payload;
};

const updateUserLogin = async () => {
  if (props.isProfileOwner) {
    return ProfileRequests.updateMyContactRequest(getUpdateContactPayload(form.value as IUserLoginDetails, props.userLogin));
  }

  return ProfileRequests.updateProfileContact(userId.value, getUpdateContactPayload(form.value as IUserLoginDetails, props.userLogin));
};

const updateCredentials = async () => {
  isLoading.value = true;
  const { error } = await updateUserLogin();
  isLoading.value = false;

  if (error) {
    errorNotification(error);
    form.value = setForm(props.userLogin);
    return;
  }

  currentStep.value = FORM_STEPS.sendOtp;
  successNotification('notification.otp_send');
};

const updateProfileContactWithoutConfirmation = async (login: string) => {
  isLoading.value = true;
  const { response, error } = await ProfileRequests.updateProfileContact(
    userId.value,
    getUpdateContactPayload(form.value as IUserLoginDetails, props.userLogin),
  );
  isLoading.value = false;

  if (error) {
    errorNotification(error);
    return;
  }

  onProfileUpdate(response);
};

const handleForm = async () => {
  if (!props.isUpdatedAllowed) {
    return;
  }

  const isValid = await appFormRef.value.validate();

  if (!isValid) {
    return;
  }

  const login: string = props.userLogin.email ? form.value.phoneNumber || form.value.email! : form.value.email!;

  if (isAdminRole.value) {
    await updateProfileContactWithoutConfirmation(login);
    return;
  }

  if (currentStep.value === FORM_STEPS.sendLogin) {
    await updateCredentials();
    return;
  }

  isLoading.value = true;
  const { response, error } = await ProfileRequests.confirmUpdateMyContactRequest({ login, otp: form.value.otp! });
  isLoading.value = false;

  if (error) {
    errorNotification(error);
    return;
  }

  onProfileUpdate(response);
};

watch(
  () => props.userLogin,
  (value) => {
    if (value) {
      form.value = setForm(value);
    }
  },
  { immediate: true },
);
</script>
