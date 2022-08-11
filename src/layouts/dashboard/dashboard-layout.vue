<template>
  <div class="main-container">
    <dashboard-menu :routes="availableRoutes"/>

    <transition name="page">
      <router-view/>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getAvailableDashboardRoutes } from '@/router/dashboard';
import DashboardMenu from './components/dashboard-menu.vue';

@Component({
  components: {
    DashboardMenu,
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
