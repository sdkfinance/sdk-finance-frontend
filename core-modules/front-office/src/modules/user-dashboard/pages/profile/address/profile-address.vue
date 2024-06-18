<template>
  <app-form
    ref="appFormRef"
    :model="formData"
    :loading="requestPending"
    class="profile-address"
    @submit.native.prevent="formSubmitHandler">
    <app-form-item prop="country">
      <app-select
        v-model="formData.country"
        :options="COUNTRIES"
        option-label="name"
        option-value="code"
        placeholder="placeholder.select.select"
        full-width
        label="form.label.country" />
    </app-form-item>
    <app-form-item prop="city">
      <app-input
        v-model="formData.city"
        placeholder="placeholder.input.input_city"
        label="form.label.city" />
    </app-form-item>
    <app-form-item prop="street">
      <app-input
        v-model="formData.street"
        placeholder="placeholder.input.input_street"
        label="form.label.street" />
    </app-form-item>
    <app-form-item prop="houseNumber">
      <app-input
        v-model="formData.houseNumber"
        placeholder="placeholder.input.input_house_number"
        label="form.label.house_number" />
    </app-form-item>
    <app-form-item prop="zipCode">
      <app-input
        v-model="formData.zipCode"
        placeholder="placeholder.input.input_zip_code"
        label="form.label.zip_code" />
    </app-form-item>

    <div class="profile-address__actions">
      <app-button
        native-type="submit"
        type="primary"
        size="big"
        :disabled="isSubmitButtonDisabled"
        full-width>
        {{ $t('action.update') }}
      </app-button>
    </div>
  </app-form>
</template>

<script setup lang="ts">
import { useGetVuexModule } from '@sdk5/shared/composables';
import { COUNTRIES } from '@sdk5/shared/constants';
import type { IUserAddress, TUpdateUserAddressPayload } from '@sdk5/shared/requests';
import { ProfileRequests } from '@sdk5/shared/requests';
import { Profile } from '@sdk5/shared/store';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { AppButton, AppForm, AppFormItem, AppInput, AppSelect } from '@sdk5/ui-kit-front-office';
import { useToggle } from '@vueuse/core';
import type { Ref } from 'vue';
import { computed, ref, watch } from 'vue';

const profileModule = useGetVuexModule(Profile);

const appFormRef = ref(null) as unknown as Ref<InstanceType<typeof AppForm>>;

const [requestPending, toggleRequestPending] = useToggle(false);
const formData = ref<Partial<IUserAddress>>({
  city: undefined,
  country: undefined,
  houseNumber: undefined,
  street: undefined,
  zipCode: undefined,
});

const profileAddressData = computed(() => profileModule.profileData?.address);
const isSubmitButtonDisabled = computed(() => requestPending.value);

const processUpdateUserAddress = async (payload: TUpdateUserAddressPayload) => {
  toggleRequestPending();
  const { error } = await ProfileRequests.updateMyAddress(payload);
  toggleRequestPending();

  if (error !== null) {
    errorNotification(error);
    return;
  }

  successNotification();
};
const formSubmitHandler = async () => {
  if (!(await appFormRef.value.validate())) {
    return;
  }

  processUpdateUserAddress({ address: formData.value });
};

watch(
  profileAddressData,
  (addressData) => {
    formData.value = {
      zipCode: addressData?.zipCode,
      street: addressData?.street,
      houseNumber: addressData?.houseNumber,
      country: addressData?.country,
      city: addressData?.city,
    };
  },
  { immediate: true },
);
</script>

<style lang="scss">
.profile-address {
  @apply max-w-[510px];
}
</style>
