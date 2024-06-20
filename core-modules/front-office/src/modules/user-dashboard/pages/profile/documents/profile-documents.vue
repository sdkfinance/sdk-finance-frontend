<template>
  <div
    v-loading="isLoaderVisible"
    class="profile-documents">
    <div class="profile-documents__forms">
      <template v-for="documentItem of profileDocumentsList">
        <document-upload-item
          :key="documentItem.type"
          :profile-document="documentItem"
          :request-pending="isLoaderVisible"
          @refetch-documents="fetchDocuments" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGetProfileDocumentsApi, useViewDocumentTypesApi } from '@sdk5/shared/composables';
import { ProfileDocumentsRequests } from '@sdk5/shared/requests';
import { computed } from 'vue';

import DocumentUploadItem from '../../../components/profile-documents/document-upload-item.vue';
import type { TProfileDocumentItem } from '../../../types';

const { isFetching: isDocumentTypesFetching, requiredDocumentTypes } = useViewDocumentTypesApi();
const { isFetching: isProfileDocumentsFetching, profileDocuments, invalidateDocuments } = useGetProfileDocumentsApi();

const profileDocumentsList = computed<TProfileDocumentItem[]>(() =>
  requiredDocumentTypes.value.map((documentType) => {
    const { type, asPlainText } = documentType;
    const existProfileDocumentByType = profileDocuments.value.find((profileDocument) => profileDocument.type === type);

    return {
      type,
      asPlainText,
      label: existProfileDocumentByType?.label,
      status: existProfileDocumentByType?.status,
      id: existProfileDocumentByType?.id,
      documentIdentifier: existProfileDocumentByType?.documentIdentifier,
      fileUrl: existProfileDocumentByType?.file
        ? ProfileDocumentsRequests.getSingleProfileDocumentUrl(existProfileDocumentByType?.file?.id)
        : undefined,
    } satisfies TProfileDocumentItem;
  }),
);
const isLoaderVisible = computed(() => isDocumentTypesFetching.value || isProfileDocumentsFetching.value);

const fetchDocuments = () => {
  invalidateDocuments();
};
</script>

<style lang="scss">
.profile-documents {
  @apply max-w-[16.75rem] min-w-full;

  .modal__close {
    @apply w-10;
  }

  &__forms {
    @apply w-full grid grid-cols-2 grid-rows-[auto] gap-[1.5rem] mb-[1.5rem];

    @media only screen and (max-width: 767px) {
      @apply flex-wrap;
    }
  }

  &__form-item {
    @apply w-full flex flex-col gap-y-[1.25rem] border border-blue-400 rounded-8 p-[1.5rem];
  }

  &__form-item-headline {
    @apply text-lg font-semibold flex justify-between;
  }

  .confirm-button {
    @apply m-0 w-full;
  }
}
</style>
