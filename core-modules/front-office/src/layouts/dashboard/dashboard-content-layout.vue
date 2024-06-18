<template>
  <div class="dashboard-content">
    <div class="dashboard-content__header">
      <div class="dashboard-content__top">
        <div class="dashboard-content__title">
          <router-link
            v-if="currentBackName && !isBackHidden"
            class="dashboard-content__back"
            :to="{ name: currentBackName, params: { ...($route.params || {}) } }">
            <button class="icon-back-arrow" />
          </router-link>
          <slot name="title" />
        </div>
        <div
          v-if="isBreadcrumbsVisible"
          class="dashboard-content__breadcrumbs">
          <app-breadcrumbs :breadcrumbs-list="breadcrumbs" />
        </div>
      </div>
      <div class="dashboard-content__actions">
        <slot name="actions" />
      </div>
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import type { TAppBreadcrumb } from '@sdk5/ui-kit-front-office';
import { AppBreadcrumbs } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

const COMPONENTS = {
  AppBreadcrumbs,
} as const;

@Component({
  name: 'dashboard-content-layout',
  components: COMPONENTS,
})
export default class DashboardContentLayout extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ type: Boolean, default: false }) readonly isBackHidden!: boolean;

  @Prop({ type: String, default: '' }) readonly backName!: string;

  @Prop({ type: Array as PropType<TAppBreadcrumb[]>, default: () => [] }) readonly breadcrumbs!: TAppBreadcrumb[];

  $props!: {
    isBackHidden?: boolean;
    backName?: string;
    breadcrumbs?: TAppBreadcrumb[];
  };

  protected get backNameMeta() {
    return this.$route?.meta?.layout?.props?.backName as string | undefined;
  }

  protected get isBreadcrumbsVisible() {
    return this.breadcrumbs && this.breadcrumbs.length > 0;
  }

  protected get currentBackName() {
    return this.backName || this.backNameMeta;
  }
}
</script>

<style lang="scss">
.dashboard-content {
  @apply flex flex-col flex-grow pt-65 general-container--wide px-72 pb-20 box-content;

  &__top {
    @apply flex flex-col;
  }

  &__breadcrumbs {
    @apply mt-[1rem];

    .app-breadcrumbs {
      @apply mb-0;
    }
  }

  &__header {
    @apply flex items-center justify-between mb-16;
  }

  &__title {
    @apply text-gray-500 text-36 font-semibold flex items-center;
  }

  &__back {
    @apply flex items-center;

    button {
      @apply text-blue-600 text-[0.6875rem] mr-[1rem] leading-[normal];
    }
  }

  &__actions {
    .btn + .btn {
      @apply ml-16;
    }
  }
}
</style>
