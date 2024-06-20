<template>
  <div class="menu-fixed">
    <div class="menu-fixed__links">
      <div
        v-if="isMenuFixedLogoVisible"
        class="menu-fixed__logo">
        <img
          src="../../../assets/images/logo-minimized-black.svg"
          alt="SDK Finance" />
      </div>
      <div class="menu-fixed__list">
        <template v-for="link of links">
          <app-tooltip
            :key="link.to"
            :content="link.tooltip"
            placement="right">
            <router-link
              class="menu-fixed__item"
              active-class="menu-fixed__item--active"
              :to="link.to">
              <i :class="['icon', link.icon]" />
            </router-link>
          </app-tooltip>
        </template>
      </div>
    </div>
    <div class="menu-fixed__actions">
      <div class="menu-fixed__list">
        <template v-for="action of actions">
          <div
            :key="action.tooltip"
            role="button"
            class="menu-fixed__item"
            @click="actionButtonClickHandler(action.actionFn)">
            <i :class="['icon', action.icon]" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { AppTooltip } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

import type { TFixedMenuAction, TFixedMenuLink } from '../types';

const COMPONENTS = {
  AppTooltip,
} as const;
@Component({
  name: 'dashboard-menu-fixed',
  components: COMPONENTS,
})
export default class DashboardMenuFixed extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ type: Boolean, default: false }) readonly collapsed!: boolean;

  @Prop({ type: Array as PropType<TFixedMenuLink[]>, required: true }) readonly links!: TFixedMenuLink[];

  @Prop({ type: Array as PropType<TFixedMenuAction[]>, required: true }) readonly actions!: TFixedMenuAction[];

  $props!: {
    menuCollapsed?: boolean;
    links: TFixedMenuLink[];
    actions: TFixedMenuAction[];
  };

  protected get isMenuFixedLogoVisible() {
    return this.collapsed;
  }

  protected actionButtonClickHandler(actionFn: TFixedMenuAction['actionFn']) {
    if (!actionFn) {
      return;
    }

    actionFn();
  }
}
</script>

<style lang="scss" scoped>
.menu-fixed {
  @apply w-[var(--fixed-menu-width)]
    bg-blue-300
    pb-[1rem]
    flex
    flex-col
    justify-between
    items-center
    fixed
    top-0
    left-0;

  padding-top: calc(var(--header-height) + 1rem);
  height: 100dvh;

  &__links,
  &__actions {
    @apply w-full;
  }

  &__links {
    @apply gap-y-[1.5rem];
  }

  &__list {
    @apply gap-y-[0.25rem];
  }

  &__links,
  &__list {
    @apply grid grid-flow-row;
  }

  &__logo,
  &__item {
    @apply flex justify-center;
  }

  &__item {
    @apply w-full py-[0.5rem] items-center relative text-blue-600;

    &:hover,
    &--active {
      @apply text-primary;
    }

    &--active {
      @apply before:absolute
        before:left-0
        before:top-1/2
        before:-translate-y-1/2
        before:rounded-r-[0.125rem]
        before:rounded-br-[0.125rem]
        before:w-[0.125rem]
        before:h-[1rem]
        before:bg-primary;
    }

    i.icon {
      @apply leading-none;

      &::before {
        @apply text-[1rem];
      }
    }
  }
}
</style>
