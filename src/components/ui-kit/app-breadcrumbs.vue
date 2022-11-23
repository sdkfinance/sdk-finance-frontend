<template>
  <div class="app-breadcrumbs">
    <div
      v-for="(route) in breadcrumbs"
      :key="route.path"
      class="app-breadcrumbs__item">
      <slot
        :name="route.name"
        :route="route">
        <router-link
          :to="{ name: getRouteName(route), params: $route.params }">
          <slot
            :name="`${route.name}__label`"
            :route="route">
            {{ $t(route.meta.translation) }}
          </slot>
        </router-link>
      </slot>
    </div>
    <div
      v-if="currentPageLabel"
      class="app-breadcrumbs__item">
      {{ $t(currentPageLabel) }}
    </div>
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';
import type { RouteRecord } from 'vue-router/types/router';

import { IPlainObject } from '@/types/interfaces';

@Component
export default class AppBreadcrumbs extends Vue {

  @Prop({ type: String, default: '' }) readonly currentPageLabel!: string;

  protected get routes(): any[] {
    return this.$router.getRoutes();
  }

  protected get currentPageParent(): string {
    return this.$router.currentRoute?.meta?.layout?.breadcrumbs?.parent || '';
  }

  protected get breadcrumbs(): any {
    return this.findParent(this.currentPageParent);
  }

  protected findParent(parentName: string): RouteRecord[] {
    return this.routes.reduce((acc, route) => {
      const parent = route.name;
      if (parent === parentName) {
        const nextParent = route.meta?.layout?.breadcrumbs?.parent;
        if (nextParent) {
          return [...this.findParent(nextParent), route, ...acc];
        }
        return [route, ...acc];
      }

      return acc;
    }, [] as RouteRecord[]);
  }

  protected getRouteName(route: IPlainObject): string {
    return route?.redirect?.name || route?.name;
  }

}
</script>

<style lang="scss">
.app-breadcrumbs {
  @apply flex text-blue-500 text-sm mb-16;

  &__item {
    &::after {
      content: "/";

      @apply inline-block ml-8 mr-8;
    }

    &:last-of-type {
      @apply text-blue-600;

      &::after {
        content: "";
      }
    }
  }
}
</style>
