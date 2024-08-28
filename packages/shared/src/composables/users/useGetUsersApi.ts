import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { refDefault } from '@vueuse/core';
import { computed, isRef, type Ref, ref } from 'vue';

import { QUERY_KEYS } from '../../constants';
import type { IGetUsersOptions } from '../../requests';
import { UsersRequests } from '../../requests';
import type { MaybeRef } from '../../types';
import { errorNotification } from '../../utils';

export const useGetUsersApi = (options: Ref<IGetUsersOptions>) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.getUsers, options],
    queryFn: () => UsersRequests.getUsers(options.value),
    select: ({ response, error }) => {
      if (error !== null) {
        errorNotification(error);
      }

      return response;
    },
  });

  const usersRecords = computed(() => query.data?.value?.records ?? []);

  return {
    ...query,
    usersRecords,
  };
};

export const useGetSingleUserApi = (userId: MaybeRef<string>) => {
  const queryClient = useQueryClient();

  const userIdRef = isRef(userId) ? userId : refDefault(ref(userId), undefined);

  const queryKey = computed(() => [QUERY_KEYS.getUsers, userIdRef.value]);
  const isQueryEnabled = computed(() => !!userIdRef.value);

  const query = useQuery({
    queryKey,
    enabled: isQueryEnabled,
    refetchOnWindowFocus: false,
    queryFn: () => {
      return UsersRequests.getUsers({
        filter: {
          ids: [userIdRef.value as string],
        },
      });
    },
    select: ({ response, error }) => {
      if (error !== null) {
        errorNotification(error);
      }

      return response?.records?.at(0) ?? null;
    },
  });

  const userData = computed(() => query.data?.value ?? null);

  const invalidateGetSingleUserQuery = () => queryClient.invalidateQueries({ queryKey });

  return {
    ...query,
    userData,
    invalidateGetSingleUserQuery,
  };
};
