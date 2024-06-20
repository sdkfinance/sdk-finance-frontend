import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { useLocalStorage } from '@vueuse/core';
import { computed } from 'vue';

import config from '../../config';
import { QUERY_KEYS } from '../../constants';
import { MEDIA_FILES_RESOURCES_PATH, ProfileRequests } from '../../requests';
import { LocalStorageService } from '../../services';
import { errorNotification } from '../../utils';

export const useGetCurrentUserProfileApi = () => {
  const queryClient = useQueryClient();
  const userToken = useLocalStorage<string | null>(`${config.StorageNamespace}token`, null);
  const queryKey = computed(() => [QUERY_KEYS.getCurrentUserProfile, userToken]);
  const query = useQuery({
    queryKey,
    queryFn: ProfileRequests.getProfile,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!userToken.value,
    select: ({ error, response }) => {
      if (error !== null) {
        errorNotification(error);
      }

      return response;
    },
  });

  const userProfileResponse = computed(() => query.data?.value ?? null);
  const userProfile = computed(() => userProfileResponse.value?.profile);
  const userMemberships = computed(() => userProfileResponse.value?.memberShips);
  const userProfileAdditional = computed(() => userProfile.value?.additional);
  const userSecurity = computed(() => userProfile.value?.security);
  const userAddress = computed(() => userProfile.value?.address);
  const userProfilePersonData = computed(() => userProfile.value?.person);
  const userContact = computed(() => userProfile.value?.contact);
  const userRole = computed(() => userMemberships.value?.at(0)?.roleName);
  const userEmail = computed(() => userContact.value?.email);
  const userPhone = computed(() => userContact.value?.phoneNumber);
  const userProfilePhotoReference = computed(() => userProfileAdditional.value?.referenceToProfilePhoto);
  const userProfilePhotoResourceName = computed(() => userProfilePhotoReference.value?.split(MEDIA_FILES_RESOURCES_PATH).at(-1));
  const userOrganizationId = computed(() => userMemberships.value?.at(0)?.organizationId);
  const userFullName = computed(() => {
    if (!userProfilePersonData.value) {
      return '';
    }

    const { namePlain } = userProfilePersonData.value;
    const { first, last, middle } = namePlain ?? {};
    let name = first;

    if (middle) {
      name = `${name} ${middle}`;
    }

    if (last) {
      name = `${name} ${last}`;
    }

    return name;
  });
  const personName = computed(() => {
    const { first } = userProfilePersonData.value?.namePlain || {};
    const userName = LocalStorageService.get('userName');

    return first || userName || '';
  });
  const userProfileStatus = computed(() => userProfile.value?.status);

  const invalidateCurrentUserCache = () => {
    return queryClient.invalidateQueries({ queryKey });
  };

  return {
    ...query,
    userProfileResponse,
    userProfile,
    userSecurity,
    userMemberships,
    userAddress,
    userRole,
    userContact,
    userEmail,
    userPhone,
    userFullName,
    userProfileAdditional,
    userOrganizationId,
    personName,
    userProfilePhotoReference,
    userProfilePhotoResourceName,
    userProfileStatus,
    invalidateCurrentUserCache,
  };
};
