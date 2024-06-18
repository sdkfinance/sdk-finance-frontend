<template>
  <div
    v-loading="requestPending"
    class="confirm-document-upload-form">
    <div class="confirm-document-upload-form__text">
      {{ $t(description || '') }}
    </div>
    <app-input
      v-if="isManualIdentifierConfirming"
      class="confirm-tax-id-form__input mb-30"
      :value="manualIdentifier || ''"
      :disabled="true"
      label="form.label.tax_id"
      placeholder="placeholder.input.tax_id" />
    <div
      v-else-if="uploadingFileSrc"
      class="confirm-document-upload-form__img">
      <img
        :src="uploadingFileSrc"
        alt="Confirm document" />
    </div>
    <div class="confirm-document-upload-form__actions">
      <app-button
        :disabled="requestPending"
        size="big"
        type="primary"
        full-width
        @click="confirmButtonClickHandler">
        {{ $t('action.confirm') }}
      </app-button>
      <app-button
        :disabled="requestPending"
        size="big"
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
import { loadProtectedImage } from '@sdk5/shared/utils';
import { AppButton, AppInput } from '@sdk5/ui-kit-front-office';
import { useToggle } from '@vueuse/core';
import { computed, onBeforeUnmount, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    fileUrl?: string | null;
    manualIdentifier?: string | null;
    description?: string | null;
  }>(),
  {
    fileUrl: null,
    manualIdentifier: null,
    description: 'pages.user_profile_kyc.confirm_document_upload_modal.text',
  },
);

const emit = defineEmits<{
  (event: 'cancel'): void;
  (event: 'confirm'): void;
}>();

const uploadingFileSrc = ref(null as string | null);
const [requestPending, toggleRequestPendingState] = useToggle(false);

const cancelButtonClickHandler = () => emit('cancel');
const confirmButtonClickHandler = () => emit('confirm');

const isManualIdentifierConfirming = computed(() => {
  return !props.fileUrl && !!props.manualIdentifier;
});

watch(
  () => props.fileUrl,
  async (url) => {
    if (isManualIdentifierConfirming.value || !url) {
      return;
    }

    if (uploadingFileSrc.value !== null) {
      URL.revokeObjectURL(uploadingFileSrc.value);
    }

    toggleRequestPendingState();
    uploadingFileSrc.value = await loadProtectedImage(url);
    toggleRequestPendingState();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (uploadingFileSrc.value !== null) {
    URL.revokeObjectURL(uploadingFileSrc.value);
  }
});
</script>

<style lang="scss">
.confirm-document-upload-form {
  &__text {
    @apply text-lg font-medium text-gray-500 mb-[1.5rem];
  }

  &__img {
    @apply mb-[2rem] w-full rounded-[8px] overflow-hidden;
  }

  &__actions {
    @apply flex flex-col gap-y-[1rem];

    .app-button {
      @apply ml-0;
    }
  }
}
</style>
