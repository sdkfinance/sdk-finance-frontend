<template>
  <div class="app-breadcrumbs">
    <div
      v-for="breadcrumbItem of breadcrumbs"
      :key="breadcrumbItem.name"
      class="app-breadcrumbs__item">
      <slot :name="breadcrumbItem.name">
        <i
          v-if="breadcrumbItem.completed"
          class="icon icon-save" />
        <router-link
          :to="{ name: breadcrumbItem.routerLinkName ?? breadcrumbItem.name, params: breadcrumbItem.params }"
          tag="a">
          <slot :name="`${breadcrumbItem.name}__label`">
            {{ $t(breadcrumbItem.label) }}
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
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { RouteRecord } from 'vue-router/types/router';

import type { TAppBreadcrumb } from './types';

type IPlainObject = Record<string, any>;

export default defineComponent({
  name: 'AppBreadcrumbs',
  props: {
    currentPageLabel: { type: String, default: '' },
    breadcrumbsList: {
      type: Array as PropType<TAppBreadcrumb[]>,
      default: undefined,
    },
  },
  computed: {
    routes() {
      return this.$router.getRoutes() as RouteRecord[];
    },
    currentPageParent(): string {
      return this.$router.currentRoute?.meta?.layout?.breadcrumbs?.parent || '';
    },
    breadcrumbs(): TAppBreadcrumb[] {
      if (this.breadcrumbsList) {
        return this.breadcrumbsList;
      }

      return this.findParent(this.currentPageParent).map(
        (route) =>
          ({
            label: route.meta.translation,
            name: route.name,
            params: this.$route.params,
            routerLinkName: this.getRouteName(route),
            route,
          }) as TAppBreadcrumb,
      );
    },
  },
  methods: {
    findParent(parentName: string): RouteRecord[] {
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
    },
    getRouteName(route: IPlainObject): string {
      return route?.redirect?.name || route?.name;
    },
  },
});
</script>

<style lang="scss">
.app-breadcrumbs {
  @apply mb-16;

  &,
  &__item {
    @apply flex items-center gap-x-[0.25rem];
  }

  &__item {
    @apply text-blue-500 text-sm leading-[1.0625rem] font-medium;
    @apply after:content-["/"] after:inline-block;
    @apply last-of-type:text-blue-600 last-of-type:after:content-[""];

    i {
      @apply w-[0.75rem] h-[0.75rem] leading-[0.375rem];

      &::before {
        @apply text-[0.65rem];
      }
    }

    &:hover {
      a {
        @apply underline underline-offset-4;
      }

      &,
      & a {
        @apply text-blue-600;
      }
    }
  }
}
</style>
