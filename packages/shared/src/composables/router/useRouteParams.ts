import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

export const useRouteParams = (name: string) => {
  const route = useRoute();
  const value = computed(() => route.params[name]);

  return { value };
};
