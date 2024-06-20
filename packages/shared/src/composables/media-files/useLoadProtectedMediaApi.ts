import { skipToken, useQuery } from '@tanstack/vue-query';
import { computed, isRef, ref } from 'vue';

import { QUERY_KEYS } from '../../constants';
import { MediaFilesRequests } from '../../requests';
import type { MaybeRef, TCommonUseApiOptions } from '../../types';
import { errorNotification } from '../../utils';
import { useBlobToObjectUrl } from '../useBlobToObjectUrl';

export type TUseLoadProtectedMediaApiOptions = Pick<TCommonUseApiOptions, 'showErrorNotification'>;

export const useLoadProtectedMediaApi = (mediaId: MaybeRef<string | undefined>, options: TUseLoadProtectedMediaApiOptions = {}) => {
  const mediaIdRef = isRef(mediaId) ? mediaId : ref(mediaId);

  const query = useQuery({
    queryKey: [QUERY_KEYS.loadProtectedMedia, mediaIdRef.value],
    enabled: !!mediaIdRef.value,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: mediaIdRef.value ? () => MediaFilesRequests.downloadFile(mediaIdRef.value as string) : skipToken,
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
    isFetching,
    imageString: objectUrl,
  };
};
