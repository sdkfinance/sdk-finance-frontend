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
      :file-url="profileDocument.fileUrl"
      :file-type="profileDocument.type"
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

    <app-button
      v-if="isConfirmButtonVisible"
      class="confirm-button"
      native-type="button"
      type="primary"
      size="medium"
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
  </div>
</template>

<script setup lang="ts">
import { apiConfig } from '@sdk5/shared/api';
import { useChangeDocumentStatusBusinessUserApi } from '@sdk5/shared/composables';
import type { TProfileDocumentStatus, TProfileDocumentType } from '@sdk5/shared/constants';
import { PROFILE_DOCUMENT_STATUS } from '@sdk5/shared/constants';
import { useI18n } from '@sdk5/shared/i18n';
import type { IProfileDocument, IUploadMediaFileResponse } from '@sdk5/shared/requests';
import { ProfileDocumentsRequests } from '@sdk5/shared/requests';
import type { IUploadConfig } from '@sdk5/shared/types';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { SimpleRequiredValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppForm, AppFormItem, AppInput, AppSwitch, AppUpload, Modal } from '@sdk5/ui-kit-front-office';
import { useToggle } from '@vueuse/core';
import type { Ref } from 'vue';
import { computed, ref, watch } from 'vue';

import type { TProfileDocumentItem } from '../../types';
import ConfirmDocumentUploadForm from './confirm-document-upload-form.vue';

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

const { mutateAsync: processUpdateDocumentStatus, isPending: isUpdateDocumentStatusPending } = useChangeDocumentStatusBusinessUserApi();

const appUploaderRef = ref(null) as unknown as Ref<InstanceType<typeof AppUpload>>;
const confirmDocumentUploadModalRef = ref(null) as unknown as Ref<InstanceType<typeof Modal>>;

const [isRequestPending, toggleRequestPending] = useToggle(false);
const [confirmDocumentUploadModalVisible] = useToggle(false);

const manualInput = ref(false);
const confirmDocumentModalIdentifier = ref(undefined as string | undefined);
const confirmDocumentModalFileUrl = ref(undefined as string | undefined);
const confirmDocumentModalDescription = ref(undefined as string | undefined);
const confirmDocumentModalTitle = ref('');
const formData = ref({} as Record<string, string | undefined>);

const isLoaderVisible = computed(() => props.requestPending || isRequestPending.value || isUpdateDocumentStatusPending.value);
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

const uploaderSuccessMessage = (documentType: TProfileDocumentType) => {
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

  confirmDocumentModalDescription.value = manualInput.value
    ? t('pages.user_profile_kyc.confirm_document_upload_modal.manual_text_by_type', { type: documentTypeString.value }).toString()
    : undefined;
  confirmDocumentModalTitle.value = manualInput.value
    ? t('pages.user_profile_kyc.confirm_document_upload_modal.title_by_type', {
        type: documentTypeString.value,
      }).toString()
    : t('pages.user_profile_kyc.confirm_document_upload_modal.title').toString();

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
const onSuccessHandler = async (response: IUploadMediaFileResponse, type: TProfileDocumentType) => {
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
}
</style>
