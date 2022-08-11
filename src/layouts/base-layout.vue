<template>
  <transition name="page">
    <component
      :is="routeLayout.componentName"
      v-bind="routeLayout.props"/>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { Profile } from '@/store/modules';
import { TRouteLayout } from '@/types/interfaces/RouteConfig.interface';

@Component({
  components: {
    DashboardLayout: () => import(/* webpackChunkName: 'dashboard-layout' */ '@/layouts/dashboard/dashboard-layout.vue'),
    SimpleLayout: () => import(/* webpackChunkName: 'dashboard-layout' */ '@/layouts/simple-layout.vue'),
    UserDashboardLayout: () => import(/* webpackChunkName: 'user-dashboard-layout' */ '@/modules/user-dashboard/layouts/user-dashboard-layout.vue'),
    BasePageLayout: () => import(/* webpackChunkName: 'base-page-layout' */ '@/layouts/base-page-layout.vue'),
  },
})
export default class BaseLayout extends Vue {

  @Prop({
    type: Object,
    default: () => ({
      componentName: 'DashboardLayout',
      props: {},
    }),
  }) readonly baseLayoutConfig!: TRouteLayout

  protected profileModule = getModule(Profile, this.$store);

  protected created(): void {
    this.profileModule.getProfile();
  }

  protected get routeLayout(): TRouteLayout {
    return {
      ...this.baseLayoutConfig,
      ...(this.$route?.meta?.layout || {}),
    };
  }

}
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
