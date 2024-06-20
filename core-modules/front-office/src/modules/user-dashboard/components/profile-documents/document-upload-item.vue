<template>
  <div class="document-upload-item">
    <div
      v-if="profileDocument.asPlainText"
      class="document-upload-item__headline">
      <span>{{ documentTypeString }}</span>
      <app-switch
        v-model="manualInput"
        :disabled="isManualInputSwitchDisabled"
        is-label-after
        :label="switchToManualLabel" />
    </div>
    <app-upload
      v-if="!manualInput"
      ref="appUploaderRef"
      :is-loading="isLoaderVisible"
      :action="config.action"
      :disabled="isLoaderVisible || !isUploadAvailable"
      :tip="config.tip"
      :file-url="profileDocumentCloned.fileUrl"
      :file-type="profileDocumentCloned.type"
      :label="uploaderLabel"
      :on-success="onSuccessHandler"
      clear-files-on-success />

    <app-form
      v-else
      ref="formRef"
      :loading="isLoaderVisible"
      class="w-full"
      :model="formData"
      :rules="rules"
      @submit.native.prevent="manualInputFormSubmitHandler">
      <app-form-item :prop="profileDocument.type">
        <app-input
          v-model="formData[profileDocument.type]"
          :disabled="isManualInputDisabled"
          :name="profileDocument.type"
          :label="documentTypeString"
          :placeholder="manualInputPlaceholder" />
      </app-form-item>
    </app-form>

    <div
      v-if="isUseMediaDeviceAvailable"
      class="document-upload-item__media-device media-device-section">
      <div class="media-device-section__title">
        {{ $t('pages.user_dashboard.profile.upload_documents.access_camera.title') }}
      </div>
      <div class="media-device-section__subtitle">
        {{ $t('pages.user_dashboard.profile.upload_documents.access_camera.subtitle') }}
      </div>
      <div class="media-device-section__action">
        <app-button
          native-type="button"
          type="primary"
          size="big"
          full-width
          @click="useMediaDeviceButtonClickHandler">
          {{ $t('action.use_my_camera') }}
        </app-button>
      </div>
    </div>

    <app-button
      v-if="isConfirmButtonVisible"
      class="confirm-button"
      native-type="button"
      type="primary"
      size="big"
      full-width
      @click="confirmButtonClickHandler">
      {{ $t('action.confirm') }}
    </app-button>

    <modal
      ref="confirmDocumentUploadModalRef"
      v-model="confirmDocumentUploadModalVisible"
      :title="confirmDocumentModalTitle">
      <template #default="{ reject, confirm }">
        <confirm-document-upload-form
          :file-url="confirmDocumentModalFileUrl"
          :manual-identifier="confirmDocumentModalIdentifier"
          :description="confirmDocumentModalDescription"
          @cancel="reject"
          @confirm="confirm" />
      </template>
    </modal>
    <media-device-modal
      v-if="mediaDeviceModalVisible"
      @submit="mediaDeviceModalSubmitHandler"
      @cancel="mediaDeviceModalCancelHandler" />
  </div>
</template>

<script setup lang="ts">
import type { IProfileDocument, IUploadConfig, IUploadMediaResponse, TProfileDocumentStatus, TProfileDocumentType } from '@sdk5/shared';
import { PROFILE_FILE_TYPES } from '@sdk5/shared';
import { blobToFile, objectUrlToBlob } from '@sdk5/shared';
import {
  apiConfig,
  errorNotification,
  PROFILE_DOCUMENT_STATUS,
  ProfileDocumentsRequests,
  SimpleRequiredValidationRule,
  successNotification,
  useChangeDocumentStatusBusinessUserApi,
  useI18n,
  useUploadMediaApi,
} from '@sdk5/shared';
import { AppButton, AppForm, AppFormItem, AppInput, AppSwitch, AppUpload, Modal } from '@sdk5/ui-kit-front-office';
import { useCloned, useDevicesList, usePermission, useToggle } from '@vueuse/core';
import type { Ref } from 'vue';
import { computed, ref, watch } from 'vue';

import type { TProfileDocumentItem } from '../../types';
import ConfirmDocumentUploadForm from './confirm-document-upload-form.vue';
import MediaDeviceModal from './media-device-modal.vue';

const props = defineProps<{
  profileDocument: TProfileDocumentItem;
  requestPending?: boolean;
}>();
const emit = defineEmits<{
  (event: 'refetch-documents'): void;
}>();

const AVAILABLE_DOCUMENT_UPLOAD_STATUSES: TProfileDocumentStatus[] = [PROFILE_DOCUMENT_STATUS.pending, PROFILE_DOCUMENT_STATUS.outdated];
const config: Partial<IUploadConfig> = {
  action: `${apiConfig.baseURL}/media-files`,
};

const { t } = useI18n();

const { isSupported: isMediaDevicesSupported } = useDevicesList();
const { state: cameraPermissionState } = usePermission('camera', { controls: true });

const { mutateAsync: processUploadMedia, isPending: isUploadMediaPending } = useUploadMediaApi();
const { mutateAsync: processUpdateDocumentStatus, isPending: isUpdateDocumentStatusPending } = useChangeDocumentStatusBusinessUserApi();

const { cloned: profileDocumentCloned } = useCloned(() => props.profileDocument, { immediate: true });

const appUploaderRef = ref(null) as unknown as Ref<InstanceType<typeof AppUpload>>;
const confirmDocumentUploadModalRef = ref(null) as unknown as Ref<InstanceType<typeof Modal>>;

const [mediaDeviceModalVisible, toggleMediaDeviceModalVisibility] = useToggle(false);
const [isRequestPending, toggleRequestPending] = useToggle(false);
const [confirmDocumentUploadModalVisible] = useToggle(false);

const manualInput = ref(false);
const confirmDocumentModalIdentifier = ref(undefined as string | undefined);
const confirmDocumentModalFileUrl = ref(undefined as string | undefined);
const confirmDocumentModalDescription = ref(undefined as string | undefined);
const confirmDocumentModalTitle = ref('');
const formData = ref({} as Record<string, string | undefined>);

const isLoaderVisible = computed(
  () => props.requestPending || isRequestPending.value || isUpdateDocumentStatusPending.value || isUploadMediaPending.value,
);
const isDocumentPending = computed(() => props.profileDocument.status === PROFILE_DOCUMENT_STATUS.pending);
const isUploadAvailable = computed(() => !props.profileDocument.status || AVAILABLE_DOCUMENT_UPLOAD_STATUSES.includes(props.profileDocument.status));
const isManualInputSwitchDisabled = computed(() => {
  if (!props.profileDocument.status) {
    return false;
  }

  return !AVAILABLE_DOCUMENT_UPLOAD_STATUSES.includes(props.profileDocument.status);
});
const isManualInputDisabled = computed(
  () => props.profileDocument?.status && !AVAILABLE_DOCUMENT_UPLOAD_STATUSES.includes(props.profileDocument.status),
);
const isConfirmButtonVisible = computed(() => {
  if (!manualInput.value) {
    return isDocumentPending.value;
  }

  return !isManualInputDisabled.value;
});
const documentTypeString = computed(() => t(`entity.doc.type.${props.profileDocument.type}`).toString());
const switchToManualLabel = computed(() => t('form.label.input_manually_by_type', { type: documentTypeString.value }).toString());
const manualInputPlaceholder = computed(() => t('placeholder.input.input_number_by_type', { type: documentTypeString.value }).toString());
const uploaderLabel = computed(() => {
  if (!props.profileDocument.asPlainText) {
    return props.profileDocument?.label ?? documentTypeString.value;
  }

  return undefined;
});
const rules = computed(() => ({
  [props.profileDocument.type]: SimpleRequiredValidationRule(),
}));
const isUseMediaDeviceAvailable = computed(
  () =>
    isUploadAvailable.value &&
    isMediaDevicesSupported.value &&
    cameraPermissionState.value !== 'denied' &&
    props.profileDocument.type === PROFILE_FILE_TYPES.selfie,
);

const uploaderSuccessMessage = () => {
  appUploaderRef.value?.showSuccessMessage(
    t('notification.document_type_uploaded', {
      documentType: documentTypeString.value,
    }).toString(),
  );
};
const openConfirmUploadModal = async (payload: { fileUrl?: string; manualIdentifier?: string }) => {
  const { fileUrl, manualIdentifier } = payload;

  if (!fileUrl && !manualIdentifier) {
    return false;
  }

  confirmDocumentModalFileUrl.value = fileUrl;
  confirmDocumentModalIdentifier.value = manualIdentifier;

  let modalTitle: string | undefined;
  let modalDescription: string | undefined;

  if (props.profileDocument.type === PROFILE_FILE_TYPES.selfie) {
    modalTitle = 'pages.user_profile_kyc.confirm_document_upload_modal.selfie_title';
    modalDescription = 'pages.user_profile_kyc.confirm_document_upload_modal.selfie_text';
  } else if (manualInput.value) {
    modalTitle = t('pages.user_profile_kyc.confirm_document_upload_modal.title_by_type', {
      type: documentTypeString.value,
    }).toString();
    modalDescription = t('pages.user_profile_kyc.confirm_document_upload_modal.manual_text_by_type', { type: documentTypeString.value }).toString();
  } else {
    modalTitle = 'pages.user_profile_kyc.confirm_document_upload_modal.title';
    modalDescription = undefined;
  }

  confirmDocumentModalTitle.value = modalTitle;
  confirmDocumentModalDescription.value = modalDescription;
  return confirmDocumentUploadModalRef.value.openModal();
};
const changeDocumentStatus = async (documentId: string, documentType?: TProfileDocumentType) => {
  const { error } = await processUpdateDocumentStatus({ documentId, status: PROFILE_DOCUMENT_STATUS.in_verification });

  if (error !== null) {
    return;
  }

  if (documentType && !manualInput.value) {
    uploaderSuccessMessage(documentType);
  } else {
    successNotification();
  }

  emit('refetch-documents');
};
const saveIdentifierManually = async () => {
  const identifier = formData.value[props.profileDocument.type];

  if (!identifier) {
    return null;
  }

  toggleRequestPending();
  const { error, response } = await ProfileDocumentsRequests.updateProfileIdentifier({
    type: props.profileDocument.type,
    identifier,
  });
  toggleRequestPending();

  if (error) {
    errorNotification(error);
    return null;
  }

  emit('refetch-documents');

  return response?.document ?? null;
};
const onSuccessHandler = async (response: IUploadMediaResponse, type: TProfileDocumentType) => {
  toggleRequestPending();
  const { error } = await ProfileDocumentsRequests.linkPhotoToProfileDocuments(response.file.id, type);
  toggleRequestPending();

  if (error !== null) {
    errorNotification(error);
    return;
  }

  emit('refetch-documents');
};

const manualInputFormSubmitHandler = () => {};
const saveManualIdentifierHandler = async () => {
  if (!manualInput.value) {
    return;
  }

  let documentData: Partial<Pick<IProfileDocument, 'id' | 'documentIdentifier'>> = {
    id: props.profileDocument.id,
    documentIdentifier: props.profileDocument.documentIdentifier,
  };

  if (!isDocumentPending.value || props.profileDocument.documentIdentifier !== formData.value[props.profileDocument.type]) {
    const manualSavedDocument = await saveIdentifierManually();
    documentData = {
      documentIdentifier: manualSavedDocument?.documentIdentifier,
      id: manualSavedDocument?.id,
    };
  }

  const { id, documentIdentifier } = documentData;

  if (!id || !documentIdentifier) {
    return;
  }

  const isConfirmed = await openConfirmUploadModal({
    manualIdentifier: documentIdentifier,
  });

  if (!isConfirmed) {
    return;
  }

  changeDocumentStatus(id, props.profileDocument.type);
};
const confirmButtonClickHandler = async () => {
  if (manualInput.value) {
    saveManualIdentifierHandler();
    return;
  }

  const isConfirmed = await openConfirmUploadModal({
    fileUrl: props.profileDocument.fileUrl,
  });

  if (!isConfirmed || !props.profileDocument.id) {
    return;
  }

  changeDocumentStatus(props.profileDocument.id, props.profileDocument.type);
};
const useMediaDeviceButtonClickHandler = () => {
  toggleMediaDeviceModalVisibility(true);
};
const mediaDeviceModalCancelHandler = () => {
  toggleMediaDeviceModalVisibility(false);
};
const mediaDeviceModalSubmitHandler = async (objectUrl: string) => {
  toggleMediaDeviceModalVisibility(false);

  if (!objectUrl) {
    return;
  }

  profileDocumentCloned.value.fileUrl = objectUrl;

  const blob = await objectUrlToBlob(objectUrl);

  if (!blob) {
    return;
  }

  const file = blobToFile(blob, 'selfie.jpg');
  const { response } = await processUploadMedia(file);

  if (!response) {
    return;
  }

  onSuccessHandler(response, props.profileDocument.type);
};

watch(
  () => props.profileDocument,
  (profileDocument) => {
    manualInput.value = !!profileDocument.documentIdentifier;
    formData.value = {
      [profileDocument.type]: profileDocument.documentIdentifier,
    };
  },
  { immediate: true },
);
watch(confirmDocumentUploadModalVisible, (visible) => {
  if (!visible) {
    confirmDocumentModalFileUrl.value = undefined;
    confirmDocumentModalDescription.value = undefined;
    confirmDocumentModalTitle.value = '';
  }
});
</script>

<style lang="scss">
.document-upload-item {
  @apply w-full flex flex-col gap-y-[1.25rem] border border-blue-400 rounded-8 p-[1.5rem];

  &__headline {
    @apply text-lg font-semibold flex justify-between;
  }

  .confirm-button {
    @apply m-0 w-full;
  }

  .media-device-section {
    &__title,
    &__subtitle {
      @apply text-md;
    }

    &__title {
      @apply font-semibold text-gray-500 mb-[0.25rem];
    }

    &__subtitle {
      @apply font-medium text-blue-600 mb-[1rem];
    }
  }
}
</style>
