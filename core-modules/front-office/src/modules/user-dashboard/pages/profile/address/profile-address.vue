<template>
  <app-form
    ref="appFormRef"
    :model="formData"
    :loading="isLoaderVisible"
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
    <app-form-item prop="region">
      <app-input
        v-model="formData.region"
        placeholder="placeholder.input.input_region"
        label="form.label.region" />
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
import { useGetCurrentUserProfileApi, useUpdateCurrentUserAddressApi } from '@sdk5/shared/composables';
import { COUNTRIES, PROFILE_ADDRESS_TYPE } from '@sdk5/shared/constants';
import type { TUpdateUserAddressPayload } from '@sdk5/shared/requests';
import { AppButton, AppForm, AppFormItem, AppInput, AppSelect } from '@sdk5/ui-kit-front-office';
import type { Ref } from 'vue';
import { computed, ref, watch } from 'vue';

const { userPersonalAddress, invalidateCurrentUserCache, isFetching: isCurrentUserProfileFetching } = useGetCurrentUserProfileApi();
const { mutateAsync: processUpdateUserAddress, isPending: isUpdateCurrentUserAddressPending } = useUpdateCurrentUserAddressApi();

const appFormRef = ref(null) as unknown as Ref<InstanceType<typeof AppForm>>;

const formData = ref<Partial<TUpdateUserAddressPayload['address']>>({
  city: undefined,
  country: undefined,
  houseNumber: undefined,
  street: undefined,
  zipCode: undefined,
  region: undefined,
  addressType: PROFILE_ADDRESS_TYPE.personal,
});

const isLoaderVisible = computed(() => isCurrentUserProfileFetching.value || isUpdateCurrentUserAddressPending.value);
const profileAddressData = computed(() => userPersonalAddress.value);
const isSubmitButtonDisabled = computed(() => isLoaderVisible.value);

const formSubmitHandler = async () => {
  if (!(await appFormRef.value.validate())) {
    return;
  }

  const { error } = await processUpdateUserAddress({ address: formData.value } as TUpdateUserAddressPayload);

  if (!error) {
    invalidateCurrentUserCache();
  }
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
      region: addressData?.region,
      addressType: addressData?.addressType,
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
