<template>
  <transition name="page">
    <component
      :is="layoutComponentByName"
      v-bind="routeLayout.props" />
  </transition>
</template>

<script setup lang="ts">
import { useGetCurrentUserProfileApi, useGetVuexModule } from '@sdk5/shared/composables';
import { Profile, UserData } from '@sdk5/shared/store';
import type { TRouteLayout } from '@sdk5/shared/types';
import type { AsyncComponent } from 'vue';
import { computed, defineAsyncComponent, watch } from 'vue';
import { useRoute } from 'vue-router/composables';

const props = withDefaults(
  defineProps<{
    baseLayoutConfig?: Partial<TRouteLayout>;
  }>(),
  {
    baseLayoutConfig: () => ({
      componentName: 'DashboardLayout',
      props: {},
    }),
  },
);

const DashboardLayout = defineAsyncComponent(() => import('./dashboard/dashboard-layout.vue'));
const SimpleLayout = defineAsyncComponent(() => import('./simple-layout.vue'));
const BasePageLayout = defineAsyncComponent(() => import('./base-page-layout.vue'));
const UserDashboardLayout = defineAsyncComponent(() => import('../modules/user-dashboard/layouts/user-dashboard-layout.vue'));

const route = useRoute();
const { userProfileResponse, invalidateCurrentUserCache } = useGetCurrentUserProfileApi();

const profileModule = useGetVuexModule(Profile);
const userDataModule = useGetVuexModule(UserData);

const userData = computed(() => userDataModule.userData);
const routeLayout = computed<TRouteLayout>(() => ({
  ...props.baseLayoutConfig,
  ...(route?.meta?.layout || {}),
}));
const layoutComponentByName = computed(() => {
  const components: Record<string, AsyncComponent> = {
    DashboardLayout,
    SimpleLayout,
    BasePageLayout,
    UserDashboardLayout,
  };

  return components[routeLayout.value?.componentName ?? 'DashboardLayout'];
});

watch(
  userData,
  () => {
    invalidateCurrentUserCache();
  },
  { immediate: true },
);
watch(
  userProfileResponse,
  (profileData) => {
    if (profileData) {
      profileModule.setProfileData(profileData);
    }
  },
  { immediate: true },
);
</script>

<style lang="scss">
.page-enter-active,
.page-leave-active {
  @apply transition duration-1000;
}

.page-enter {
  @apply opacity-0;
}

.page-leave-to,
.page-leave-active {
  @apply hidden #{!important};
}
</style>
