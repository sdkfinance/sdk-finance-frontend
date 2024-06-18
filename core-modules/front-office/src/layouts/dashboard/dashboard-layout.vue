<template>
  <div class="main-container">
    <header-top-line class="main-container__header" />
    <div class="main-container__menu">
      <dashboard-menu :routes="availableRoutes" />
    </div>

    <transition name="page">
      <router-view />
    </transition>
  </div>
</template>

<script lang="ts">
import { getAvailableDashboardRoutes } from '@sdk5/shared/utils';
import { HeaderTopLine } from '@sdk5/ui-kit-front-office';
import { Component, Vue } from 'vue-property-decorator';

import { FRONT_OFFICE_DASHBOARD_CHILDREN } from '../../index';
import DashboardMenu from './components/dashboard-menu.vue';

const COMPONENTS = {
  DashboardMenu,
  HeaderTopLine,
} as const;

@Component({
  name: 'dashboard-layout',
  components: COMPONENTS,
})
export default class DashboardLayout extends Vue {
  static components: typeof COMPONENTS;

  protected get availableRoutes() {
    return getAvailableDashboardRoutes(FRONT_OFFICE_DASHBOARD_CHILDREN);
  }
}
</script>

<style lang="scss">
.main-container {
  --header-height: 2.75rem;

  @apply min-h-screen grid grid-cols-[auto,1fr];

  &__menu {
    @apply w-full h-full pt-[var(--header-height)];
  }

  &__header {
    @apply fixed top-0 left-0 w-full z-100;
  }
}

.main-wrapper {
  max-width: 1144px;
}

.main-section {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  padding: 32px;
  max-width: 1920px;
  margin-top: 44px;

  @media only screen and (max-width: 1366px) {
    max-width: 1280px;
  }

  @media only screen and (max-width: 767px) {
    width: 100%;
    margin: 0;
    padding-top: 100px;
  }

  &--unpadded {
    padding: 37px 0;
  }
}

.section-container {
  padding: 0 37px;
}
</style>
