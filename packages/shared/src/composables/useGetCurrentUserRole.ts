import { computed } from 'vue';

import { Profile } from '../store/Profile';
import { useGetVuexModule } from './useGetVuexModule';

export const useGetCurrentUserRole = () => {
  const userProfileModule = useGetVuexModule(Profile);

  const currentUserRole = computed(() => userProfileModule.role);

  return { currentUserRole };
};
