import { useQuery } from '@tanstack/vue-query';
import { computed, type Ref } from 'vue';

import { QUERY_KEYS } from '../../constants';
import { UserInfoRequests } from '../../requests/profiles';
import { errorNotification } from '../../utils';

export const useGetUserProfileApi = (userId: Ref<string>) => {
  const query = useQuery({
    refetchOnMount: false,
    queryKey: [QUERY_KEYS.getUserProfile, userId],
    queryFn: () => UserInfoRequests.getUserProfile(userId.value),
    select: ({ response, error }) => {
      if (error !== null) {
        errorNotification(error);
      }

      return response?.profile ?? null;
    },
  });

  const userProfileData = computed(() => query.data?.value ?? null);
  const userProfilePerson = computed(() => userProfileData.value?.person ?? null);
  const identificationStatus = computed(() => userProfileData.value?.status ?? '');
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

  return {
    ...query,
    userProfileData,
    identificationStatus,
    role,
    type,
    userNameString,
  };
};
