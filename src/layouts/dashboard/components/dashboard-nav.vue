<template>
  <nav class="dashboard-menu__navigation">
    <router-link
      v-for="route in rootRoutes"
      :key="route.path"
      v-slot="{ href, navigate, isActive, isExactActive }"
      custom
      :to="{ path: route.path, query: getRouteQuery(route) }">
      <dashboard-nav-item
        :href="href"
        :navigate="navigate"
        :is-active="isActive"
        :is-exact-active="isExactActive"
        :route="route"/>
    </router-link>
  </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import DashboardNavItem from '@/layouts/dashboard/components/dashboard-nav-item.vue';
import { IRouteConfig } from '@/types/interfaces';

@Component({
  components: {
    DashboardNavItem,
  },
})

export default class DashboardNav extends Vue {

  @Prop({ type: Array, required: true }) readonly routes!: IRouteConfig[];

  protected get rootRoutes(): IRouteConfig[] {
    return this.routes.map((route) => {
      if (route.children) {
        route.children = route.children?.filter((r) => r.meta?.root);
      }
      return route;
    });
  }

  protected getRouteQuery(route: IRouteConfig): object {
    const { path } = route;
    if (path === this.$route.path) {
      return this.$route.query;
    }

    return {};
  }

}
</script>

<style lang="scss">
.dashboard-menu__navigation {
  @apply p-24 overflow-auto;

  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
