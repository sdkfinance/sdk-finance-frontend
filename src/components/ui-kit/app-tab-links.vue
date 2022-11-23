<template>
  <div
    v-if="isTabsVisible"
    class="tabs"
    :class="tabsClasses">
    <router-link
      v-for="tab in allowedTabs"
      :key="tab.name"
      class="tabs__link"
      :to="{ name: tab.name }">
      {{ $t(tab.meta.translation) }}
      <app-badge
        v-if="tab.meta.badge"
        :status="tab.meta.badge.status"/>
    </router-link>
    <app-select
      v-model="currentTab"
      :options="allowedTabs"
      class="tabs__select"
      option-value="name"
      is-dropdown-simple
      is-dropdown-secondary
      is-dropdown
      :option-label="({meta}) => $t(meta.translation)"
      full-width>
      <template #option="{scope}">
        {{ $t(scope.meta.translation) }}
        <app-badge
          v-if="scope.meta.badge"
          :status="scope.meta.badge.status"/>
      </template>
    </app-select>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppBadge from '@/components/ui-kit/app-badge.vue';
import { checkPermission, checkUserProfilePermission } from '@/router/middlewares/permissionGuard';
import { IRouteConfig } from '@/types/interfaces';

@Component({
  components: {
    AppSelect,
    AppBadge,
  },
})
export default class AppTabLinks extends Vue {

  @Prop({ type: Array, required: true }) readonly tabs!: IRouteConfig[];

  @Prop({ type: Boolean, default: true }) readonly hideForSingle!: boolean;

  @Prop({ type: Boolean, default: false }) readonly secondary!: boolean;

  @Prop({
    type: String,
    default: 'default',
    validator(value: string): boolean {
      return ['medium', 'default'].includes(value);
    },
  }) readonly size!: boolean;

  protected get allowedTabs(): IRouteConfig[] {
    return this.tabs.filter((tab: IRouteConfig): boolean => (
      checkPermission(tab.meta?.permission)
        && checkUserProfilePermission(tab.meta?.userProfilePermission)
        && !tab.meta?.isHide
    ));
  }

  protected get isTabsVisible(): boolean {
    return !(this.hideForSingle && this.allowedTabs.length === 1);
  }

  protected get currentTab(): string {
    return this.allowedTabs.find(({ name }) => name === this.$route.name)?.name || '';
  }

  protected set currentTab(name: string) {
    this.$router.replace({ name });
  }

  protected get tabsClasses(): string[] {
    return [
      this.secondary ? 'tabs--secondary' : '',
      `tabs--${this.size}`,
    ];
  }

}

</script>

<style lang="scss">
@import "~@/assets/styles/parts/tabs";
</style>
