<template>
  <div
    v-loading="isLoaderVisible"
    class="app-upload-front-office"
    :class="{ 'app-upload-front-office--full': isWidthFull }">
    <label
      v-if="label"
      class="app-input__label">
      {{ $t(label) }}
    </label>
    <div
      v-if="successMessage"
      class="app-upload-front-office__success-text">
      {{ successMessage }}
    </div>

    <el-upload
      v-else
      ref="uploadRef"
      :drag="drag"
      :auto-upload="autoUpload"
      :multiple="multiple"
      :action="action"
      :disabled="disabled"
      :limit="limit"
      :headers="requestHeaders"
      :accept="accept"
      :on-change="onChangeHandler"
      :on-success="onSuccessHandler"
      :on-preview="onPreview"
      :before-remove="onBeforeRemove"
      :on-exceed="onExceedFile"
      :on-error="onErrorHandler"
      :before-upload="beforeUpload">
      <img
        v-if="file"
        :src="file"
        class="max-h-300 h-300 w-full m-auto object-contain p-20"
        :class="{ 'cursor-not-allowed': disabled }"
        alt="" />

      <template v-else>
        <i class="icon-dragndrop app-upload-front-office__icon" />

        <div class="app-upload-front-office__text">
          <slot name="text">
            <span class="text-blue-accent">{{ $t('action.click') }}</span>
            {{ $t('pages.user_profile.labels.to_browse_or_drop') }}
          </slot>
        </div>
        <div
          v-if="tip"
          class="app-upload-front-office__tip mb-40">
          {{ $t(tipData.message, tipData.params) }}
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script lang="ts">
import apiConfigInstance from '@sdk5/shared/api';
import type { TProfileDocumentType } from '@sdk5/shared/constants';
import type { IUploadMediaFileResponse } from '@sdk5/shared/requests';
import type { IPlainObject, IServerError } from '@sdk5/shared/types';
import { errorNotification, loadProtectedImage } from '@sdk5/shared/utils';
import { refAutoReset, usePrevious, useToggle } from '@vueuse/core';
import { Upload } from 'element-ui';
import type { PropType, Ref } from 'vue';
import { computed, defineComponent, onBeforeUnmount, ref, watch } from 'vue';

const { getAuthHeader } = apiConfigInstance;
const DEFAULT_SUPPORTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif', 'application/pdf'];

type TUploadedFile = {
  name: string;
  percentage: number;
  raw: File;
  response: IPlainObject;
  size: number;
  status: number;
  uid: string;
};

const SUCCESS_MESSAGE_TIMEOUT = 5000;

export default defineComponent({
  name: 'AppUpload',
  components: {
    'el-upload': Upload,
  },
  props: {
    tip: { type: [String, Object], default: '' },
    action: { type: String, default: '' },
    accept: { type: String, default: DEFAULT_SUPPORTED_FILE_TYPES.join(',') },
    isLoading: { type: Boolean, default: false },
    autoUpload: { type: Boolean, default: true },
    drag: { type: Boolean, default: true },
    label: { type: String, default: '' },
    multiple: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    isWidthFull: { type: Boolean, default: true },
    limit: { type: Number, default: 1 },
    onPreview: { type: Function, default: () => ({}) },
    onBeforeRemove: { type: Function, default: () => ({}) },
    onSuccess: {
      type: Function as PropType<(response: IUploadMediaFileResponse, fileType: TProfileDocumentType, rawFile: File) => void>,
      default: () => ({}),
    },
    fileType: { type: String as PropType<TProfileDocumentType>, default: '' },
    fileUrl: { type: String, default: '' },
    beforeUpload: { type: Function, default: undefined },
    clearFilesOnSuccess: { type: Boolean, default: false },
  },
  setup(props) {
    const [requestPending, toggleRequestPendingState] = useToggle(false);
    const uploadRef = ref(null) as unknown as Ref<InstanceType<typeof Upload>>;
    const file = ref(null as string | null);
    const successMessage = refAutoReset('', SUCCESS_MESSAGE_TIMEOUT);
    const prevFile = usePrevious(file);

    const isLoaderVisible = computed(() => props.isLoading || requestPending.value);
    const requestHeaders = computed(() => getAuthHeader());
    const tipData = computed(() => (typeof props.tip !== 'string' ? props.tip : { message: props.tip, params: {} }));

    const setPrevFile = () => {
      file.value = prevFile.value ?? null;
    };
    const clearFiles = () => {
      uploadRef.value.clearFiles();
    };
    const onSuccessHandler = (response: IUploadMediaFileResponse, uploadedFile: TUploadedFile, fileList: TUploadedFile[]) => {
      props.onSuccess(response, props.fileType, uploadedFile.raw);

      if (props.clearFilesOnSuccess) {
        clearFiles();
      }
    };
    const onChangeHandler = (inputFIle: IPlainObject) => {
      const reader = new FileReader();
      reader.readAsDataURL(inputFIle.raw);
      reader.onload = () => {
        file.value = String(reader.result);
      };
      reader.onerror = () => {
        errorNotification('entity.error.FILE_UPLOAD');
      };
    };
    const onExceedFile = () => {
      errorNotification('validation.upload_image_with_restrictions', { size: 5, extensions: 'PNG, JPEG' });
    };
    const onErrorHandler = (error: Error) => {
      if (!(error instanceof Error) || !error.message) {
        return;
      }

      const serverError = JSON.parse(error.message) as IServerError;
      errorNotification(serverError);
    };
    const submitUpload = () => {
      uploadRef.value.submit();
    };
    const setFile = async (newFile: string) => {
      if (!newFile) {
        return;
      }

      if (file.value !== null) {
        URL.revokeObjectURL(file.value);
      }

      toggleRequestPendingState();
      file.value = await loadProtectedImage(newFile);
      toggleRequestPendingState();
    };

    const showSuccessMessage = (message: string) => {
      successMessage.value = message;
    };

    watch(() => props.fileUrl, setFile, { immediate: true });
    watch(
      file,
      () => {
        if (!props.fileUrl) {
          file.value = null;
        }
      },
      { immediate: true },
    );

    onBeforeUnmount(() => {
      if (file.value) {
        URL.revokeObjectURL(file.value);
      }
    });

    return {
      setPrevFile,
      onSuccessHandler,
      onChangeHandler,
      onExceedFile,
      onErrorHandler,
      submitUpload,
      setFile,
      showSuccessMessage,
      uploadRef,
      prevFile,
      file,
      requestHeaders,
      tipData,
      successMessage,
      isLoaderVisible,
    };
  },
});
</script>

<style lang="scss">
.app-upload-front-office {
  &--full .el-upload,
  &--full .el-upload-dragger {
    @apply w-full;
  }

  .app-input__label {
    @apply mb-[1rem] text-xl;
  }

  .el-upload-dragger {
    @apply border border-dashed border-blue-600 flex flex-col gap-y-[1.5rem] items-center justify-center min-h-[13.375rem];
    @apply h-auto #{!important};
  }

  &__label {
    @apply font-semibold mb-8 text-black inline-block;
  }

  &__text,
  &__tip {
    @apply text-blue-600;
  }

  &__text {
    @apply text-lg max-w-[11.375rem] italic;
  }

  &__tip {
    @apply mt-10 text-sm;
  }

  &__icon {
    @apply text-blue-600 text-xl mb-0 leading-none;
  }

  &__success-text {
    @apply text-lg font-normal text-gray-500;
  }
}
</style>
