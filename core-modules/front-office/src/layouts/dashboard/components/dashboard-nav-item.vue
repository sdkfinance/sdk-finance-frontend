<template>
  <div :class="menuItemClassNames">
    <div
      v-if="childItem"
      :class="stepperClassNames">
      <span class="child-stepper__dot" />
    </div>
    <a
      :href="href"
      :class="menuItemLinkClassNames"
      @click="linkClickHandler">
      <div class="menu-item-link__content">
        <i
          v-if="!childItem"
          :class="['menu-item-link__icon', linkIcon]" />
        <div class="menu-item-link__title">
          <span>{{ linkName }}</span>
        </div>
      </div>
      <div
        v-if="isToggleButtonVisible"
        role="button"
        class="menu-item__toggle">
        <i class="icon icon-select-arrow-down" />
      </div>
    </a>
  </div>
</template>

<script lang="ts">
import type { IRouteConfig } from '@sdk5/shared/types';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'dashboard-nav-item',
})
export default class DashboardNavItem extends Vue {
  @Prop({ type: String, required: true }) readonly href!: string;

  @Prop({ type: Boolean, required: true }) readonly isActive!: boolean;

  @Prop({ type: Boolean, required: true }) readonly isExactActive!: boolean;

  @Prop({ type: Boolean, default: false }) readonly childItem!: boolean;

  @Prop({ type: Number, required: true }) readonly linkIndex!: number;

  @Prop({ type: Number, default: 0 }) readonly childLinksCount!: number;

  @Prop({
    type: Object as PropType<IRouteConfig>,
    required: true,
  })
  readonly route!: IRouteConfig;

  $props!: {
    route: IRouteConfig;
    href: string;
    isActive: boolean;
    isExactActive: boolean;
    linkIndex: number;
    childLinksCount?: number;
    childItem?: boolean;
  };

  protected get stepperClassNames() {
    return [
      'child-stepper',
      this.linkIndex === 0 && 'child-stepper--first',
      this.linkIndex === this.childLinksCount - 1 && 'child-stepper--last',
      (this.isActive || this.isExactActive) && 'child-stepper--active',
    ];
  }

  protected get menuItemLinkClassNames() {
    return [
      'menu-item-link',
      this.childItem && 'menu-item-link--child',
      this.isActive && 'menu-item-link--active',
      (this.isExactActive || (this.isActive && !this.isChildRoutesExists)) && 'menu-item-link--exact-active',
    ];
  }

  protected get menuItemClassNames() {
    return ['menu-item', this.childItem && 'menu-item--child'];
  }

  protected get linkName() {
    if (!this.route?.meta?.translation) {
      return '';
    }

    return this.$t(this.route.meta.translation.toString()).toString();
  }

  protected get linkIcon() {
    return this.route?.meta?.icon ?? '';
  }

  protected get routeChildren() {
    return this.route.children ?? [];
  }

  protected get isToggleButtonVisible() {
    return !this.childItem && this.isChildRoutesExists;
  }

  protected get isChildRoutesExists() {
    return this.routeChildren.length > 0;
  }

  @Emit('link-click')
  protected emitLinkClickEvent(event: MouseEvent): any {
    return event;
  }

  protected linkClickHandler(event: MouseEvent) {
    this.emitLinkClickEvent(event);
  }
}
</script>

<style lang="scss" scoped>
.menu-item {
  &--child {
    @apply flex items-center gap-x-[1rem] pl-[0.875rem] w-full h-full;
  }

  &__toggle {
    @apply w-[1rem] h-[1rem] text-gray-500;

    &,
    i {
      @apply flex items-center justify-center;
    }

    i {
      @apply text-[1rem];

      &::before {
        @apply text-[0.4em];
      }
    }
  }

  &-link {
    @apply p-[0.5rem] rounded-[0.25rem] bg-transparent text-gray-500 justify-between w-full;

    &--child {
      @apply py-[0.25rem] pr-[0.25rem] pl-[0.5rem];
    }

    &--active {
      &,
      .menu-item-link__icon {
        @apply text-blue-700;
      }
    }

    &--exact-active {
      @apply bg-blue-700 text-gray-100;

      .menu-item__toggle,
      .menu-item-link__icon {
        @apply text-gray-100;
      }
    }

    &,
    &__content {
      @apply flex items-center;
    }

    &__content {
      @apply gap-x-[0.5rem] h-full;
    }

    &__icon {
      @apply w-[1rem] h-[1rem] text-blue-600;

      &::before {
        @apply text-[0.9em];
      }
    }

    &__title {
      @apply text-md leading-[1.25rem] font-medium;
    }
  }

  &__child-list {
    @apply grid grid-flow-row;
  }
}

.child-stepper {
  @apply relative h-full flex flex-col items-center justify-center before:top-0 after:bottom-0;

  &::before,
  &::after {
    @apply bg-blue-700 bg-opacity-20 w-[1px] h-1/2 absolute left-1/2 -translate-x-1/2 z-1;
  }

  &--first {
    @apply before:hidden;
  }

  &--last {
    @apply after:hidden;
  }

  &--active {
    &::before,
    &::after {
      @apply from-blue-700/[20%] to-blue-700 bg-opacity-0;
    }

    &::before {
      @apply bg-gradient-to-b;
    }

    &::after {
      @apply bg-gradient-to-t;
    }

    .child-stepper__dot {
      @apply before:bg-opacity-100;
    }
  }

  &__dot {
    @apply flex
      w-[0.25rem]
      h-[0.25rem]
      rounded-full
    bg-gray-100
      z-10
      relative
      before:absolute
    before:bg-blue-700
      before:bg-opacity-20
      before:left-0
      before:top-0
      before:w-full
      before:h-full
      before:rounded-full
      before:z-20;
  }
}
</style>
