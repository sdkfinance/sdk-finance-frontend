<template>
  <nav class="menu-navigation">
    <template v-for="(route, routeIndex) in rootRoutes">
      <router-link
        :key="route.path"
        v-slot="{ href, navigate, isActive, isExactActive }"
        custom
        :to="{ path: route.path, query: getRouteQuery(route) }">
        <div class="menu-navigation__item">
          <dashboard-nav-item
            :route="route"
            :href="href"
            :is-active="isActive"
            :is-exact-active="isExactActive"
            :link-index="routeIndex"
            @link-click="navigate" />

          <template v-if="route.children && route.children.length > 0 && (isActive || isExactActive)">
            <div class="menu-navigation__child-list">
              <router-link
                v-for="(child, childIndex) in route.children"
                :key="child.name"
                v-slot="{ href: childHref, navigate: childNavigate, isActive: childIsActive, isExactActive: childIsExactActive }"
                tag="div"
                custom
                :to="{ name: child.name, query: getRouteQuery(child) }">
                <div>
                  <dashboard-nav-item
                    child-item
                    :route="child"
                    :href="childHref"
                    :is-active="childIsActive"
                    :is-exact-active="childIsExactActive"
                    :link-index="childIndex"
                    :child-links-count="route.children.length"
                    @link-click="childNavigate" />
                </div>
              </router-link>
            </div>
          </template>
        </div>
      </router-link>
    </template>
  </nav>
</template>

<script lang="ts">
import type { IRouteConfig } from '@sdk5/shared/types';
import { cloneDeep } from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';

import DashboardNavItem from './dashboard-nav-item.vue';

const COMPONENTS = {
  DashboardNavItem,
} as const;

@Component({
  name: 'dashboard-nav',
  components: COMPONENTS,
})
export default class DashboardNav extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ type: Array, required: true }) readonly routes!: IRouteConfig[];

  $props!: {
    routes: IRouteConfig[];
  };

  protected get rootRoutes(): IRouteConfig[] {
    const routesCopy = cloneDeep(this.routes);
    return routesCopy.map((route) => {
      if (route.children) {
        route.children = route.children?.filter((r) => r.meta?.root);
      }

      return route;
    });
  }

  protected getRouteQuery(route: IRouteConfig): Record<string, string | (string | null)[]> {
    const { path } = route;

    if (path === this.$route.path) {
      return this.$route.query;
    }

    return {};
  }
}
</script>

<style lang="scss" scoped>
.menu-navigation {
  @apply overflow-auto;

  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &__item,
  &__child-list {
    @apply grid grid-flow-row;
  }
}
</style>
