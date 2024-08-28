<template>
  <aside :class="dashboardMenuClassNames">
    <dashboard-menu-fixed
      :actions="fixedMenuActions"
      :links="fixedMenuLinks"
      :menu-collapsed="menuCollapsed" />
    <div
      v-if="!menuCollapsed"
      class="dashboard-menu__box">
      <dashboard-menu-header />
      <dashboard-nav :routes="routes" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useI18n, UserDataService } from '@sdk5/shared';
import type { IRouteConfig } from '@sdk5/shared/types';
import { useToggle } from '@vueuse/core';
import { computed } from 'vue';

import type { TFixedMenuAction, TFixedMenuLink } from '../types';
import DashboardMenuFixed from './dashboard-menu-fixed.vue';
import DashboardMenuHeader from './dashboard-menu-header.vue';
import DashboardNav from './dashboard-nav.vue';

defineProps<{
  routes: IRouteConfig[];
}>();

const { t } = useI18n();

const [menuCollapsed, toggleMenuCollapsed] = useToggle(false);

const dashboardMenuClassNames = computed(() => ['dashboard-menu', menuCollapsed.value && 'dashboard-menu--collapsed']);
const currentCollapseMenuButtonIcon = computed(() => (menuCollapsed.value ? 'icon-menu-closed' : 'icon-menu-opened'));
const fixedMenuLinks = computed<TFixedMenuLink[]>(() => [
  {
    to: '/dashboard',
    icon: 'icon-home-alt',
    tooltip: t('sidebar.tooltip.main').toString(),
  },
  {
    to: '/profile',
    icon: 'icon-user-profile',
    tooltip: t('sidebar.tooltip.profile').toString(),
  },
]);
const fixedMenuActions = computed<TFixedMenuAction[]>(() => [
  {
    icon: currentCollapseMenuButtonIcon.value,
    tooltip: 'Collapse',
    actionFn: toggleMenuCollapsed,
  },
  {
    icon: 'icon-logout-alt',
    tooltip: 'Logout',
    actionFn: () => UserDataService.logout(),
  },
]);
</script>

<style lang="scss">
.dashboard-menu {
  --menu-width: 21rem;
  --fixed-menu-width: 3rem;

  @apply w-[var(--menu-width)] flex h-full flex-shrink-0 relative;

  &--collapsed {
    @apply w-[var(--fixed-menu-width)] grid-cols-[1fr];
  }

  &__box {
    @apply flex
    flex-col
    gap-y-[1.375rem]
    p-[1rem]
    w-full
    h-full
    overflow-hidden
    bg-white
    border-r-[2px]
    border-r-blue-300
    ml-[var(--fixed-menu-width)];
  }

  .el-loading-mask {
    @apply bg-white;
  }
}
</style>
