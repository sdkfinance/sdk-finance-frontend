import { useToggle } from '@vueuse/core';
import { onBeforeUnmount, onMounted, readonly, ref } from 'vue';

import type { IBankCatalog } from '../requests';
import { CatalogsRequests } from '../requests';
import { errorNotification } from '../utils';

export const useFetchBankCatalog = (options?: { immediate?: boolean }) => {
  const catalogData = ref<IBankCatalog[] | null>(null);
  const [isLoading, toggleLoadingState] = useToggle(false);

  const fetchBankAccounts = async () => {
    toggleLoadingState();
    const { error, response } = await CatalogsRequests.getBankCatalog();
    toggleLoadingState();

    if (error !== null) {
      errorNotification(error);
      return;
    }

    catalogData.value = response.records;
  };

  onMounted(() => {
    if (!options?.immediate) {
      return;
    }

    fetchBankAccounts();
  });

  onBeforeUnmount(() => {
    catalogData.value = null;
  });

  return { isLoading: readonly(isLoading), catalogData: readonly(catalogData), fetchBankAccounts };
};
