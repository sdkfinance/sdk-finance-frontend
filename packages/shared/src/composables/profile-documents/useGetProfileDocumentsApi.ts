import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed } from 'vue';

import { QUERY_KEYS } from '../../constants';
import { ProfileDocumentsRequests } from '../../requests';
import { UserData } from '../../store';
import { errorNotification } from '../../utils';
import { useGetVuexModule } from '../useGetVuexModule';

export const useGetProfileDocumentsApi = () => {
  const queryClient = useQueryClient();
  const userDataModule = useGetVuexModule(UserData);
  const userToken = computed(() => userDataModule.token);
  const queryKey = computed(() => [QUERY_KEYS.viewDocumentTypes, userToken.value]);
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
