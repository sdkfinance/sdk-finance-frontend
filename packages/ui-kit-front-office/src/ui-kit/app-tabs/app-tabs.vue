<template>
  <div
    v-if="isTabsVisible"
    class="tabs"
    :class="tabsClasses">
    <a
      v-for="tab in allowedTabs"
      :key="tab.name"
      :class="{ 'is-active': tab.value === currentTab, disabled: tab.disabled }"
      class="tabs__link"
      @click.prevent="currentTab = tab.value">
      <img
        v-if="tab.done"
        :src="iconDone"
        class="tabs__icon"
        alt="" />
      {{ $t(tab.translation) }}
      <app-badge
        v-if="tab.badge"
        :status="tab.badge.status" />
    </a>
    <app-select
      v-model="currentTab"
      :options="allowedTabs"
      class="tabs__select"
      option-value="value"
      is-dropdown-simple
      is-dropdown-secondary
      is-dropdown
      :option-label="({ translation }) => $t(translation).toString()"
      full-width>
      <template #option="{ scope }">
        <app-select-custom-option>
          <template #image>
            <img
              v-if="scope.done"
              :src="iconDone"
              class="tabs__icon"
              alt="" />
          </template>
          <template #title>
            {{ $t(scope.translation) }}
          </template>
          <template #additional>
            <app-badge
              v-if="scope.badge"
              :status="scope.badge.status" />
          </template>
        </app-select-custom-option>
      </template>
    </app-select>
  </div>
</template>

<script lang="ts">
import { checkPermission, checkUserProfilePermission } from '@sdk5/shared/middlewares';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import iconDone from '../../assets/icons/icon-done.svg';
import { AppSelect, AppSelectCustomOption } from '../../ui-framework/app-select';
import { AppBadge } from '../app-badge';
import type { ITab } from './types';

export default defineComponent({
  name: 'AppTabs',
  components: {
    AppSelectCustomOption,
    AppBadge,
    AppSelect,
  },
  props: {
    value: { type: String, default: '' },
    tabs: { type: Array as PropType<ITab[]>, required: true },
    hideForSingle: { type: Boolean, default: true },
    secondary: { type: Boolean, default: false },
    queryParam: { type: String, default: '' },
    size: {
      type: String,
      default: 'default',
      validator: (value: string): boolean => {
        return ['medium', 'default'].includes(value);
      },
    },
  },
  data() {
    return {
      iconDone,
    };
  },
  computed: {
    allowedTabs(): ITab[] {
      return this.tabs.filter(
        (tab: ITab): boolean => checkPermission(tab.permission) && checkUserProfilePermission(tab.userProfilePermission) && !tab.isHide,
      );
    },
    isTabsVisible(): boolean {
      return !(this.hideForSingle && this.allowedTabs.length === 1);
    },
    currentTab: {
      get(): string {
        return this.value;
      },
      set(value: string) {
        this.updateValue(value);

        if (this.queryParam) {
          const { name, params, query } = this.$route;

          if (name && query[this.queryParam] !== value) {
            this.$router.replace({ name, params, query: { ...query, [this.queryParam]: value } });
          }
        }
      },
    },
    tabsClasses(): string[] {
      return [this.secondary ? 'tabs--secondary' : '', `tabs--${this.size}`];
    },
  },
  watch: {
    allowedTabs: [{ immediate: true, handler: 'setCurrentTab' }],
  },
  methods: {
    getValueFromQuery(): string | undefined {
      const queryValue = this.$route?.query[this.queryParam];
      return this.allowedTabs.find(({ value }) => value === queryValue)?.value;
    },
    async beforeDestroy(): Promise<void> {
      const { name, params, query } = this.$route;

      if (name && this.queryParam && this.queryParam in query) {
        const transformQuery = { ...query };
        delete transformQuery[this.queryParam];

        await this.$router.replace({ name, params, query: transformQuery });
      }
    },
    setCurrentTab(): void {
      if (!this.currentTab) {
        this.currentTab = this.getValueFromQuery() || this.allowedTabs[0]?.value;
      }
    },
    updateValue<T>(value: T) {
      this.$emit('input', value);
    },
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/parts/tabs';
</style>
