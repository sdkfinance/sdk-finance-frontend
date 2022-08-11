<template>
  <div>
    <a
      :href="href"
      class="dashboard-menu__link"
      :class="{'router-link-active': isActive, 'router-link-exact-active': isExactActive}"
      @click="navigate">
      <i :class="['dashboard-menu__link-icon', route.meta.icon]"/>
      <div
        class="dashboard-menu__link-title">
        <span>{{ $t(route.meta.translation) }}</span>

        <button
          v-if="hasChildren"
          class="dashboard-menu__link-collapse"
          :class="{'dashboard-menu__link-collapse--active': isSubVisible}"
          @click.prevent.stop="toggleSubMenu"/>
      </div>
    </a>
    <template v-if="hasChildren">
      <router-link
        v-for="(child) in route.children"
        v-show="isSubVisible"
        :key="child.name"
        class="dashboard-menu__link dashboard-menu__link--child"
        :to="{ name: child.name, query: getRouteQuery(child) }">
        {{ $t(child.meta.translation) }}
      </router-link>
    </template>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import { IRouteConfig } from '@/types/interfaces';

@Component
export default class DashboardNavItem extends Vue {

  @Prop({ type: String, required: true }) readonly href!: string;

  @Prop({ type: Function, required: true }) readonly navigate!: Function;

  @Prop({ type: Boolean, required: true }) readonly isActive!: boolean;

  @Prop({ type: Boolean, required: true }) readonly isExactActive!: boolean;

  @Prop({ type: Object, required: true }) readonly route!: IRouteConfig;

  protected isSubVisible: boolean = false;

  protected get hasChildren(): boolean {
    return !!this.route?.children?.length;
  }

  @Watch('isActive', { immediate: true })
  protected setSubVisible(value: boolean): void {
    this.isSubVisible = value;
  }

  protected toggleSubMenu(): void {
    this.isSubVisible = !this.isSubVisible;
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
.dashboard-menu__link {
  @apply flex items-center text-gray-500 text-base py-12 font-medium;

  &.router-link-active {
    @apply text-blue-accent;
  }

  &-icon {
    @apply mr-14 text-11 text-current;
  }

  &-collapse {
    @apply ml-auto w-11 h-11;

    &::before {
      content: '';

      @apply flex h-2 w-full rounded-lg bg-blue-600;
    }

    &::after {
      content: '';

      @apply flex h-2 w-full rounded-lg bg-blue-600 transform transition rotate-90 -translate-y-2;
    }

    &--active::after {
      @apply rotate-0;
    }
  }

  &-title {
    @apply flex items-center justify-between w-full;
  }

  &--child {
    @apply pl-34 font-normal;
  }
}
</style>
