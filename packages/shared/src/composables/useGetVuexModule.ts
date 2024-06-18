import { computed, getCurrentInstance } from 'vue';
import type { VuexModule } from 'vuex-module-decorators';
import { getModule } from 'vuex-module-decorators';

type ConstructorOf<C> = {
  new (...args: any[]): C;
};
export const useGetVuexModule = <M extends VuexModule>(moduleClass: ConstructorOf<M>) => {
  const instance = getCurrentInstance();
  const store = computed(() => instance?.proxy.$store);

  return getModule(moduleClass, store.value);
};
