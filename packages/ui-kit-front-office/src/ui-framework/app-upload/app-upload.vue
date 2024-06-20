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
      :on-remove="onRemoveFileHandler"
      :on-progress="onProgressHandler"
      :before-upload="beforeUpload">
      <div
        v-if="file"
        :class="['app-upload-front-office__image-container', filePreviewNoPadding && 'app-upload-front-office__image-container--no-padding']">
        <div class="app-upload-front-office__img-container">
          <img
            :src="file"
            :class="['app-upload-front-office__img', disabled && 'app-upload-front-office__img--disabled']"
            alt="" />
        </div>
      </div>

      <template v-else>
        <i class="icon-dragndrop app-upload-front-office__icon" />

        <div class="app-upload-front-office__text">
          <slot name="text">
            <span class="text-primary">{{ $t('action.click') }}</span>
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
import type { IUploadMediaResponse } from '@sdk5/shared/requests';
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
      type: Function as PropType<(response: IUploadMediaResponse, fileType: TProfileDocumentType, rawFile: File) => void>,
      default: () => ({}),
    },
    fileType: { type: String as PropType<TProfileDocumentType>, default: '' },
    fileUrl: { type: String, default: '' },
    beforeUpload: { type: Function, default: undefined },
    clearFilesOnSuccess: { type: Boolean, default: false },
    fileObjectUrl: { type: String as PropType<string | null | undefined>, default: undefined },
    filePreviewNoPadding: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
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
    const onSuccessHandler = (response: IUploadMediaResponse, uploadedFile: TUploadedFile, fileList: TUploadedFile[]) => {
      props.onSuccess(response, props.fileType, uploadedFile.raw);

      if (props.clearFilesOnSuccess) {
        clearFiles();
      }
    };
    const onChangeHandler = (inputFIle: IPlainObject) => {
      if (inputFIle.status === 'success') {
        toggleRequestPendingState(false);
        return;
      }

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
    const setFile = async (newFile?: string | null, skipLoadImage = false) => {
      if (file.value !== null) {
        URL.revokeObjectURL(file.value);
      }

      if (!newFile) {
        file.value = null;
        return;
      }

      if (skipLoadImage) {
        file.value = newFile;
        return;
      }

      toggleRequestPendingState();
      file.value = await loadProtectedImage(newFile);
      toggleRequestPendingState();
    };

    const showSuccessMessage = (message: string) => {
      successMessage.value = message;
    };

    const onRemoveFileHandler = () => {
      file.value = null;
    };

    const onProgressHandler = () => {
      toggleRequestPendingState();
    };

    watch(file, (fileValue) => {
      emit('file-change', fileValue);
    });
    watch(
      () => props.fileUrl,
      (fileUrl) => setFile(fileUrl),
      { immediate: true },
    );
    watch(
      () => props.fileObjectUrl,
      (objectUrl) => setFile(objectUrl, true),
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
      onRemoveFileHandler,
      onProgressHandler,
      uploadRef,
      prevFile,
      file,
      requestHeaders,
      tipData,
      successMessage,
      isLoaderVisible,
      clearFiles,
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
    @apply border border-dashed border-blue-600 flex flex-col gap-y-[1.5rem] items-center justify-center min-h-[13.375rem] h-auto;
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

  .el-upload-list.el-upload-list--text {
    &.el-upload-list {
      .el-progress {
        @apply hidden;
      }

      .el-upload-list__item {
        @apply p-0  bg-transparent hover:bg-transparent;

        &-name {
          @apply font-normal text-gray-500 text-lg pl-0;

          .el-icon-document {
            @apply hidden;
          }
        }

        &-status-label {
          @apply hidden;
        }

        .el-icon-close {
          @apply right-0 top-1/2 transform -translate-y-1/2 text-blue-600 flex opacity-100 text-[1rem];
        }
      }
    }
  }

  &__image-container {
    @apply p-20 overflow-hidden w-full m-auto rounded-[8px];

    &--no-padding {
      @apply p-0;

      .app-upload-front-office__img {
        @apply h-auto;
      }
    }
  }

  &__img {
    @apply object-contain max-h-300 h-300;

    &-container {
      @apply overflow-hidden rounded-[8px];
    }

    &--disabled {
      @apply cursor-not-allowed;
    }
  }
}
</style>
