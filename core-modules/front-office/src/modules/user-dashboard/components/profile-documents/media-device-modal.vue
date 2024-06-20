<template>
  <app-modal
    ref="appModalRef"
    :class="modalClassNames"
    is-full-width
    :is-close-visible="false">
    <div class="media-device-modal__body">
      <template v-if="isCameraPermissionGranted">
        <app-form-wrapper>
          <template #title>
            {{ $t(modalTitle) }}
          </template>
        </app-form-wrapper>
        <div class="media-device-modal__form media-device-form">
          <div class="media-device-form__video-container">
            <video
              ref="videoElementRef"
              class="media-device-form__video"
              muted
              autoplay />
          </div>
          <div class="media-device-form__actions">
            <app-button
              native-type="button"
              type="secondary"
              size="big"
              outlined
              full-width
              @click="cancelButtonClickHandler">
              {{ $t('action.cancel') }}
            </app-button>
            <app-button
              native-type="button"
              type="primary"
              size="big"
              full-width
              @click="submitButtonClickHandler">
              {{ $t(submitButtonText) }}
            </app-button>
          </div>
        </div>
      </template>
      <div
        v-else
        class="media-device-modal__prompt">
        {{ $t('pages.user_dashboard.profile.upload_documents.access_camera.prompt') }}
      </div>
    </div>
  </app-modal>
</template>

<script setup lang="ts">
import { errorNotification } from '@sdk5/shared';
import { AppButton, AppFormWrapper, AppModal } from '@sdk5/ui-kit-front-office';
import { useDevicesList, usePermission, useUserMedia } from '@vueuse/core';
import classNames from 'classnames';
import type { Ref } from 'vue';
import { onBeforeUnmount } from 'vue';
import { computed, onMounted, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modalTitle?: string;
    submitButtonText?: string;
    mirrorImage?: boolean;
  }>(),
  {
    modalTitle: 'action.take_selfie',
    submitButtonText: 'action.take_selfie',
    mirrorImage: true,
  },
);
const emit = defineEmits<{
  (event: 'cancel'): void;
  (event: 'submit', payload: string): void;
}>();

const cameraPermissionState = usePermission('camera');
const { videoInputs: cameras } = useDevicesList();
const currentCameraId = computed(() => cameras.value.at(0)?.deviceId);
const {
  stream,
  stop: stropStream,
  start: startStream,
} = useUserMedia({
  constraints: {
    video: {
      deviceId: currentCameraId.value,
      aspectRatio: 16 / 9,
      width: { ideal: 4096 },
      height: { ideal: 2160, min: 464 },
      facingMode: 'user',
    },
  },
});

const appModalRef = ref(null) as unknown as Ref<InstanceType<typeof AppModal>>;
const videoElementRef = ref(null) as unknown as Ref<HTMLVideoElement>;

const isCameraPermissionGranted = computed(() => cameraPermissionState.value === 'granted');
const isCameraPermissionDenied = computed(() => cameraPermissionState.value === 'denied');
const modalClassNames = computed(() => classNames('media-device-modal', [props.mirrorImage && 'media-device-modal--mirror-image']));

const openModal = () => {
  appModalRef.value.open();
};
const cancelButtonClickHandler = () => {
  emit('cancel');
};
const submitButtonClickHandler = () => {
  if (!videoElementRef.value) {
    return;
  }

  const canvas = document.createElement('canvas');
  const { width, height } = videoElementRef.value.getBoundingClientRect();
  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);

  const context = canvas.getContext('2d');

  if (!context) {
    document.body.removeChild(canvas);
    return;
  }

  if (props.mirrorImage) {
    // Flip the context horizontally by translating and scaling (mirroring)
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
  }

  try {
    context.drawImage(videoElementRef.value, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/jpg');
    emit('submit', dataURL);
  } catch (error) {
    if (error instanceof Error) {
      errorNotification(error.message);
    }
  }

  document.body.removeChild(canvas);
};

onMounted(() => {
  openModal();
  startStream();
});
onBeforeUnmount(() => {
  stropStream();
});

watch(stream, (streamObject) => {
  if (videoElementRef.value && streamObject) {
    videoElementRef.value.srcObject = streamObject;
  }
});
watch(isCameraPermissionDenied, (permissionDenied) => {
  if (permissionDenied) {
    errorNotification('notification.camera_permission_denied');
    emit('cancel');
  }
});
</script>

<style lang="scss">
.media-device-modal {
  &--mirror-image {
    .media-device-form {
      &__video {
        @apply -scale-x-100;
      }
    }
  }

  &__prompt {
    @apply h-full flex flex-col justify-center items-center text-xl font-semibold text-gray-500;
  }

  &__body {
    @apply max-w-[53.25rem] mx-auto h-full;
  }

  .media-device-form {
    @apply p-[1.5rem] border border-solid border-blue-400 rounded-8 flex flex-col gap-y-[1.5rem];

    &__video-container {
      @apply border border-dashed border-blue-600 rounded-8  overflow-hidden;
    }

    &__video {
      @apply w-full h-full;

      object-fit: initial;
    }

    &__actions {
      @apply flex items-center gap-x-[1.5rem];

      .app-button {
        @apply ml-0;
      }
    }
  }
}
</style>
