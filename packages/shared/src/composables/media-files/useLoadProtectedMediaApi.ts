import { useQuery } from '@tanstack/vue-query';
import { refDefault } from '@vueuse/core';
import { computed, isRef, ref } from 'vue';

import { QUERY_KEYS } from '../../constants';
import { MediaFilesRequests } from '../../requests';
import type { MaybeRef, TCommonUseApiOptions } from '../../types';
import { errorNotification } from '../../utils';
import { useBlobToObjectUrl } from '../useBlobToObjectUrl';

export type TUseLoadProtectedMediaApiOptions = Pick<TCommonUseApiOptions, 'showErrorNotification'>;

export const useLoadProtectedMediaApi = (mediaId: MaybeRef<string | null | undefined>, options: TUseLoadProtectedMediaApiOptions = {}) => {
  const mediaIdRef = isRef(mediaId) ? mediaId : refDefault(ref(mediaId), undefined);

  const queryKey = computed(() => [QUERY_KEYS.loadProtectedMedia, mediaIdRef.value]);
  const isQueryEnabled = computed(() => !!mediaIdRef.value);
  const query = useQuery({
    queryKey,
    enabled: isQueryEnabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () => MediaFilesRequests.downloadFile(mediaIdRef.value as string),
    select: (response) => {
      const { showErrorNotification } = options;

      if (response.error) {
        if (showErrorNotification !== false) {
          errorNotification(response.error);
        }
      }

      return response.data ? (response.data as Blob) : null;
    },
  });

  const queryResponse = computed(() => query.data?.value ?? null);
  const isFetching = computed(() => query.isFetching.value);

  const { objectUrl } = useBlobToObjectUrl(queryResponse);

  return {
    ...query,
    isFetching,
    imageString: objectUrl,
  };
};
