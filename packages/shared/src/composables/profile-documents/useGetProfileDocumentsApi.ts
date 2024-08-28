import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed } from 'vue';

import { QUERY_KEYS } from '../../constants';
import { ProfileDocumentsRequests } from '../../requests';
import { UserDataService } from '../../services';
import { errorNotification } from '../../utils';

export const useGetProfileDocumentsApi = () => {
  const queryClient = useQueryClient();
  const queryKey = computed(() => [QUERY_KEYS.viewDocumentTypes, UserDataService.token]);
  const query = useQuery({
    queryKey,
    queryFn: ProfileDocumentsRequests.getProfileDocuments,
    refetchOnWindowFocus: false,
    select: ({ error, response }) => {
      if (error !== null) {
        errorNotification(error);
      }

      return response?.documents;
    },
  });

  const profileDocuments = computed(() => query.data?.value ?? []);

  const invalidateDocuments = () => {
    return queryClient.invalidateQueries({ queryKey });
  };

  return {
    ...query,
    profileDocuments,
    invalidateDocuments,
  };
};
