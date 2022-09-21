<template>
  <div class="main-container">
    <HeaderBackLink class="main-container__header"/>

    <dashboard-menu :routes="availableRoutes"/>

    <transition name="page">
      <router-view/>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getAvailableDashboardRoutes } from '@/router/dashboard';
import HeaderBackLink from '@/layouts/components/header-back-link.vue';
import DashboardMenu from './components/dashboard-menu.vue';

@Component({
  components: {
    DashboardMenu,
    HeaderBackLink,
  },
})

export default class DashboardLayout extends Vue {

  protected get availableRoutes() {
    return getAvailableDashboardRoutes();
  }

}
</script>

<style lang="scss">
.main-container {
  min-height: 100vh;
  display: flex;

  &__header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
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
