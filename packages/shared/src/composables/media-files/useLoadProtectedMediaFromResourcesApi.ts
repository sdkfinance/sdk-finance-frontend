import { useQuery } from '@tanstack/vue-query';
import { computed, isRef, ref } from 'vue';

import { QUERY_KEYS } from '../../constants';
import { MediaFilesRequests } from '../../requests';
import type { MaybeRef, TCommonUseApiOptions } from '../../types';
import { errorNotification } from '../../utils';
import { useBlobToObjectUrl } from '../useBlobToObjectUrl';

export type TUseLoadProtectedMediaFromResourcesApiOptions = Pick<TCommonUseApiOptions, 'showErrorNotification'>;

export const useLoadProtectedMediaFromResourcesApi = (
  fileName: MaybeRef<string | undefined | null>,
  options: TUseLoadProtectedMediaFromResourcesApiOptions = {},
) => {
  const fileNameRef = isRef(fileName) ? fileName : ref(fileName);
  const isQueryEnabled = computed(() => !!fileNameRef.value);
  const queryKey = computed(() => [QUERY_KEYS.getProtectedMediaFromResources, fileNameRef]);
  const query = useQuery({
    queryKey,
    enabled: isQueryEnabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () => MediaFilesRequests.downloadFileFromResources(fileNameRef.value as string),
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

  const queryResponse = computed(() => (!fileNameRef.value ? null : query.data?.value ?? null));
  const isFetching = computed(() => query.isFetching.value);

  const { objectUrl } = useBlobToObjectUrl(queryResponse);
  return {
    isFetching,
    imageString: objectUrl,
  };
};
