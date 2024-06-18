import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { QUERY_KEYS } from '../../constants';
import { ProfileDocumentsRequests } from '../../requests';
import { errorNotification } from '../../utils';

export const useViewDocumentTypesApi = () => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.viewDocumentTypes],
    queryFn: ProfileDocumentsRequests.viewDocumentTypes,
    refetchOnWindowFocus: false,
    select: ({ error, response }) => {
      if (error !== null) {
        errorNotification(error);
      }

      return response?.documentTypes ?? [];
    },
  });

  const documentTypes = computed(() => query.data?.value ?? []);
  const requiredDocumentTypes = computed(() => documentTypes.value.filter((documentType) => !documentType.optional));
  const optionalDocumentTypes = computed(() => documentTypes.value.filter((documentType) => documentType.optional));

  return {
    ...query,
    documentTypes,
    requiredDocumentTypes,
    optionalDocumentTypes,
  };
};
