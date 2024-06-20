<template>
  <div
    v-loading="isLoaderVisible"
    class="profile-photo-form">
    <div class="profile-photo-form__container">
      <app-upload
        ref="appUploadRef"
        :label="uploaderLabel"
        :auto-upload="false"
        clear-files-on-success
        file-preview-no-padding
        :disabled="isUploaderDisabled"
        :action="config.action"
        :file-object-url="profilePhotoObjectUrl"
        :on-success="successUploadHandler"
        @file-change="fileChangeHandler" />
    </div>

    <div class="profile-photo-form__actions">
      <app-button
        native-type="button"
        type="secondary"
        size="big"
        full-width
        :disabled="isSubmitButtonDisabled"
        @click="submitButtonClickHandler">
        {{ $t(submitButtonText) }}
      </app-button>
      <app-button
        v-if="changePhotoState"
        native-type="button"
        type="secondary"
        outlined
        full-width
        @click="cancelButtonClickHandler">
        {{ $t('action.cancel') }}
      </app-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IUploadConfig, IUploadMediaFileResponse, TUserProfileAdditional } from '@sdk5/shared';
import { useUpdateCurrentProfileAdditionalApi } from '@sdk5/shared';
import { apiConfig } from '@sdk5/shared/api';
import { useGetCurrentUserProfileApi, useLoadProtectedMediaFromResourcesApi } from '@sdk5/shared/composables';
import { AppButton, AppUpload } from '@sdk5/ui-kit-front-office';
import { useToggle } from '@vueuse/core';
import type { Ref } from 'vue';
import { computed, ref, watch } from 'vue';

const config: Partial<IUploadConfig> = {
  action: `${apiConfig.baseURL}/media-files/resources`,
};

const {
  isFetching: isCurrentUserProfileFetching,
  userProfilePhotoReference,
  userProfileAdditional,
  invalidateCurrentUserCache,
  userProfilePhotoResourceName,
} = useGetCurrentUserProfileApi();

const userProfilePhotoResourceNameLocal = ref(undefined as string | undefined);
const { isFetching: isMediaFetching, imageString: profilePhotoObjectUrl } = useLoadProtectedMediaFromResourcesApi(userProfilePhotoResourceNameLocal);
const { mutateAsync: processUpdateProfileAdditional, isPending: isUpdateProfileAdditionalPending } = useUpdateCurrentProfileAdditionalApi();

const appUploadRef = ref(null) as unknown as Ref<InstanceType<typeof AppUpload>>;

const uploadedFile = ref(null as string | null);
const [changePhotoState, toggleChangePhotoState] = useToggle(false);

const isLoaderVisible = computed(() => isCurrentUserProfileFetching.value || isUpdateProfileAdditionalPending.value || isMediaFetching.value);
const isPhotoAlreadyExists = computed(() => !!userProfilePhotoReference.value);
const submitButtonText = computed(() => {
  return isPhotoAlreadyExists.value && !changePhotoState.value ? 'action.change_profile_photo' : 'action.update_profile_photo';
});
const uploaderLabel = computed(() => (changePhotoState.value ? 'action.change_profile_photo' : 'form.label.profile_photo'));
const isSubmitButtonDisabled = computed(() => {
  if (!isPhotoAlreadyExists.value || changePhotoState.value) {
    return !uploadedFile.value;
  }

  return false;
});
const isUploaderDisabled = computed(() => isLoaderVisible.value || (isPhotoAlreadyExists.value && !changePhotoState.value));

const fileChangeHandler = (file: string | null) => {
  uploadedFile.value = file;
};
const successUploadHandler = async (response: IUploadMediaFileResponse) => {
  userProfilePhotoResourceNameLocal.value = undefined;
  toggleChangePhotoState(false);
  await processUpdateProfileAdditional({
    additional: {
      ...((userProfileAdditional.value || {}) as TUserProfileAdditional),
      referenceToProfilePhoto: response.file.url,
    },
  });

  invalidateCurrentUserCache();
};
const submitButtonClickHandler = () => {
  if (isPhotoAlreadyExists.value && !changePhotoState.value) {
    toggleChangePhotoState(true);
    return;
  }

  appUploadRef.value.submitUpload();
};
const cancelButtonClickHandler = () => {
  toggleChangePhotoState(false);
};

watch(changePhotoState, (changePhotoStateActive) => {
  appUploadRef.value.clearFiles();
  userProfilePhotoResourceNameLocal.value = changePhotoStateActive ? undefined : userProfilePhotoResourceName.value;
});
watch(
  userProfilePhotoResourceName,
  (photoUrl) => {
    userProfilePhotoResourceNameLocal.value = photoUrl;
  },
  { immediate: true },
);
</script>

<style lang="scss">
.profile-photo-form {
  @apply max-w-[18.875rem] flex flex-col gap-y-[2rem];

  &__container {
    @apply p-[1.5rem] rounded-[8px] border border-solid border-blue-400;
  }

  &__actions {
    @apply flex flex-col gap-[1rem];

    .app-button {
      @apply ml-0;
    }
  }
}
</style>
