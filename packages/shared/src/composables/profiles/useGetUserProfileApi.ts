import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { refDefault } from '@vueuse/core';
import { computed, isRef, ref } from 'vue';

import { ORGANIZATION_STATUS_ENUM, QUERY_KEYS } from '../../constants';
import { UserInfoRequests } from '../../requests/profiles';
import type { MaybeRef } from '../../types';
import { errorNotification } from '../../utils';
import { useUserProfileData } from './useUserProfileData';

export const useGetUserProfileApi = (userId: MaybeRef<string>) => {
  const queryClient = useQueryClient();

  const userIdRef = isRef(userId) ? userId : refDefault(ref(userId), undefined);

  const queryKey = computed(() => [QUERY_KEYS.getUserProfile, userIdRef.value]);
  const isQueryEnabled = computed(() => !!userIdRef.value);

  const query = useQuery({
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey,
    enabled: isQueryEnabled,
    queryFn: () => UserInfoRequests.getUserProfile(userIdRef.value as string),
    select: ({ response, error }) => {
      if (error !== null) {
        errorNotification(error);
      }

      return response;
    },
  });

  const userProfileData = computed(() => query.data?.value?.profile ?? null);
  const userProfilePerson = computed(() => userProfileData.value?.person ?? null);
  const identificationStatus = computed(() => userProfileData.value?.status ?? ORGANIZATION_STATUS_ENUM.not_available);
  const role = computed(() => userProfileData.value?.role?.at(0)?.code ?? '');
  const type = computed(() => userProfileData.value?.type ?? '');
  const userNameString = computed(() => {
    if (!userProfilePerson.value) {
      return '';
    }

    const { namePlain } = userProfilePerson.value;

    if (!namePlain) {
      return '';
    }

    const { first, last } = namePlain;

    if (!first || !last) {
      return '';
    }

    return `${first} ${last}`;
  });

  const invalidateUserProfileQuery = () => queryClient.invalidateQueries({ queryKey });

  return {
    ...query,
    userProfileData,
    identificationStatus,
    role,
    type,
    userNameString,
    ...useUserProfileData(query),
    invalidateUserProfileQuery,
  };
};
