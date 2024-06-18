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
      {{ $t(tab?.meta?.translation ?? '') }}
      <app-badge
        v-if="tab?.meta?.badge"
        :status="tab.meta.badge.status" />
    </router-link>
    <app-select
      v-model="currentTab"
      :options="currentTabsList"
      class="tabs__select"
      option-value="name"
      is-dropdown-simple
      is-dropdown-secondary
      is-dropdown
      :option-label="({ meta }) => $t(meta.translation).toString()"
      full-width>
      <template #option="{ scope }">
        {{ $t(scope.meta.translation) }}
        <app-badge
          v-if="scope.meta.badge"
          :status="scope.meta.badge.status" />
      </template>
    </app-select>
  </div>
</template>

<script lang="ts">
import { checkPermission, checkUserProfilePermission } from '@sdk5/shared/middlewares';
import type { IRouteConfig } from '@sdk5/shared/types';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';

import { AppSelect } from '../../ui-framework/app-select';
import { AppBadge } from '../app-badge';

export default defineComponent({
  name: 'AppTabLinks',
  components: {
    AppSelect,
    AppBadge,
  },
  props: {
    tabs: { type: Array as PropType<IRouteConfig[]>, required: true },
    hideForSingle: { type: Boolean, default: true },
    secondary: { type: Boolean, default: false },
    size: {
      type: String,
      default: 'default',
      validator: (value: string) => {
        return ['medium', 'default'].includes(value);
      },
    },
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const allowedTabs = computed(() =>
      props.tabs.filter(
        (tab: IRouteConfig): boolean =>
          checkPermission(tab.meta?.permission) && checkUserProfilePermission(tab.meta?.userProfilePermission) && !tab.meta?.isHide,
      ),
    );
    const currentTabsList = computed(() => {
      const isCurrentRouteExistInTabsList = allowedTabs.value.findIndex((allowedTab) => allowedTab.name === route.name) >= 0;

      if (!isCurrentRouteExistInTabsList) {
        return [...allowedTabs.value, route];
      }

      return allowedTabs.value;
    });
    const isTabsVisible = computed(() => !(props.hideForSingle && allowedTabs.value.length === 1));
    const currentTab = computed({
      get() {
        return allowedTabs.value.find(({ name }) => name === route.name)?.name ?? route.name ?? '';
      },
      set(name: string) {
        router.replace({ name });
      },
    });
    const tabsClasses = computed(() => [props.secondary ? 'tabs--secondary' : '', `tabs--${props.size}`]);

    return {
      allowedTabs,
      isTabsVisible,
      currentTab,
      tabsClasses,
      currentTabsList,
    };
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/parts/tabs';
</style>
