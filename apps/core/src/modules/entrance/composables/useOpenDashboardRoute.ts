import { useGetVuexModule } from '@sdk5/shared/composables';
import { UserData } from '@sdk5/shared/store';
import { errorNotification } from '@sdk5/shared/utils';
import { useRouter } from 'vue-router/composables';

export const useOpenDashboardRoute = () => {
  const userDataModule = useGetVuexModule(UserData);
  const router = useRouter();

  const openDashboardRoute = (roteName: string | null) => {
    if (!roteName) {
      userDataModule.resetAuthData();
      errorNotification('notification.role_not_suitable_for_url');
      return;
    }

    router.push({ name: roteName });
  };

  return { openDashboardRoute };
};
