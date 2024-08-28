import { UserDataService } from '@sdk5/shared';
import { errorNotification } from '@sdk5/shared/utils';
import { useRouter } from 'vue-router/composables';

export const useOpenDashboardRoute = () => {
  const router = useRouter();

  const openDashboardRoute = (roteName: string | null) => {
    if (!roteName) {
      UserDataService.resetUserData();
      errorNotification('notification.role_not_suitable_for_url');
      return;
    }

    router.push({ name: roteName });
  };

  return { openDashboardRoute };
};
