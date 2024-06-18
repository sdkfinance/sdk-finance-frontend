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

<script lang="ts">
import { UserData } from '@sdk5/shared/store';
import type { IRouteConfig } from '@sdk5/shared/types';
import { AppTooltip } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import type { TFixedMenuAction, TFixedMenuLink } from '../types';
import DashboardMenuFixed from './dashboard-menu-fixed.vue';
import DashboardMenuHeader from './dashboard-menu-header.vue';
import DashboardNav from './dashboard-nav.vue';

const COMPONENTS = {
  DashboardMenuHeader,
  DashboardNav,
  AppTooltip,
  DashboardMenuFixed,
} as const;

@Component({
  name: 'dashboard-menu',
  components: COMPONENTS,
})
export default class DashboardMenu extends Vue {
  static components: typeof COMPONENTS;

  @Prop({
    type: Array as PropType<IRouteConfig[]>,
    required: true,
  })
  readonly routes!: IRouteConfig[];

  $props!: {
    routes: IRouteConfig[];
  };

  protected userDataModule = getModule(UserData, this.$store);

  protected menuCollapsed = false;

  protected fixedMenuLinks: TFixedMenuLink[] = [
    {
      to: '/front-office/dashboard',
      icon: 'icon-home-alt',
      tooltip: this.$t('sidebar.tooltip.main').toString(),
    },
    {
      to: '/front-office/profile',
      icon: 'icon-user-profile',
      tooltip: this.$t('sidebar.tooltip.profile').toString(),
    },
  ];

  protected get fixedMenuActions(): TFixedMenuAction[] {
    return [
      {
        icon: this.currentCollapseMenuButtonIcon,
        tooltip: 'Collapse',
        actionFn: this.toggleMenuCollapsed,
      },
      {
        icon: 'icon-logout-alt',
        tooltip: 'Logout',
        actionFn: this.logout,
      },
    ];
  }

  protected get isMenuFixedLogoVisible() {
    return this.menuCollapsed;
  }

  protected get dashboardMenuClassNames() {
    return ['dashboard-menu', this.menuCollapsed && 'dashboard-menu--collapsed'];
  }

  protected get currentCollapseMenuButtonIcon() {
    return this.menuCollapsed ? 'icon-menu-opened' : 'icon-menu-closed';
  }

  protected logout() {
    this.userDataModule.logout();
  }

  protected toggleMenuCollapsed() {
    this.menuCollapsed = !this.menuCollapsed;
  }
}
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
