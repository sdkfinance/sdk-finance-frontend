import { useQuery } from '@tanstack/vue-query';
import { computed, type Ref } from 'vue';

import { QUERY_KEYS } from '../../constants';
import type { IGetUsersOptions } from '../../requests';
import { UsersRequests } from '../../requests';
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

export const useGetSingleUserApi = (userId: Ref<string>) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.getUsers, userId],
    queryFn: () => {
      return UsersRequests.getUsers({
        filter: {
          ids: [userId.value],
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

  return {
    ...query,
    userData,
  };
};
