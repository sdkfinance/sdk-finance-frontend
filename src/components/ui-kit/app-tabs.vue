<template>
  <div
    v-if="isTabsVisible"
    class="tabs"
    :class="tabsClasses">
    <a
      v-for="tab in allowedTabs"
      :key="tab.name"
      :class="{'is-active': tab.value === currentTab, 'disabled': tab.disabled}"
      class="tabs__link"
      @click.prevent="currentTab = tab.value">
      <img
        v-if="tab.done"
        :src="require('@/assets/icons/icon-done.svg')"
        class="tabs__icon"
        alt="">
      {{ $t(tab.translation) }}
      <app-badge
        v-if="tab.badge"
        :status="tab.badge.status"/>
    </a>
    <app-select
      v-model="currentTab"
      :options="allowedTabs"
      class="tabs__select"
      option-value="value"
      is-dropdown-simple
      is-dropdown-secondary
      is-dropdown
      :option-label="({translation}) => $t(translation)"
      full-width>
      <template #option="{scope}">
        <app-select-custom-option>
          <template #image>
            <img
              v-if="scope.done"
              :src="require('@/assets/icons/icon-done.svg')"
              class="tabs__icon"
              alt="">
          </template>
          <template #title>
            {{ $t(scope.translation) }}
          </template>
          <template #additional>
            <app-badge
              v-if="scope.badge"
              :status="scope.badge.status"/>
          </template>
        </app-select-custom-option>
      </template>
    </app-select>
  </div>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Vue, Watch,
} from 'vue-property-decorator';
import { checkPermission, checkUserProfilePermission } from '@/router/middlewares/permissionGuard';
import AppBadge from '@/components/ui-kit/app-badge.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import { IMetaConfig } from '@/types/interfaces/RouteConfig.interface';
import AppSelectCustomOption from '@/components/ui-framework/app-select/app-select-custom-option.vue';

export interface ITab extends IMetaConfig{
  value: any;
  disabled?: boolean;
  done?: boolean;
}

@Component({
  components: {
    AppSelectCustomOption,
    AppBadge,
    AppSelect,
  },
})
export default class AppTabs extends Vue {

  @Prop({ type: String, default: '' }) readonly value!: string;

  @Prop({ type: Array, required: true }) readonly tabs!: ITab[];

  @Prop({ type: Boolean, default: true }) readonly hideForSingle!: boolean;

  @Prop({ type: Boolean, default: false }) readonly secondary!: boolean;

  @Prop({ type: String, default: '' }) readonly queryParam!: string;

  @Prop({
    type: String,
    default: 'default',
    validator(value: string): boolean {
      return ['medium', 'default'].includes(value);
    },
  }) readonly size!: boolean;

  protected get allowedTabs(): ITab[] {
    return this.tabs.filter((tab: ITab): boolean => (
      checkPermission(tab.permission)
        && checkUserProfilePermission(tab.userProfilePermission)
        && !tab.isHide
    ));
  }

  protected get isTabsVisible(): boolean {
    return !(this.hideForSingle && this.allowedTabs.length === 1);
  }

  protected get currentTab(): string {
    return this.value;
  }

  protected set currentTab(value: string) {
    this.updateValue(value);
    if (this.queryParam) {
      const { name, params, query } = this.$route;
      if (name && query[this.queryParam] !== value) {
        this.$router.replace({ name, params, query: { ...query, [this.queryParam]: value } });
      }
    }
  }

  protected get tabsClasses(): string[] {
    return [
      this.secondary ? 'tabs--secondary' : '',
      `tabs--${this.size}`,
    ];
  }

  @Watch('allowedTabs', { immediate: true })
  protected setCurrentTab(): void {
    if (!this.currentTab) {
      this.currentTab = this.getValueFromQuery() || this.allowedTabs[0]?.value;
    }
  }

  @Emit('input')
  protected updateValue<T>(value: T): T {
    return value;
  }

  protected getValueFromQuery(): string | undefined {
    const queryValue = this.$route?.query[this.queryParam];
    return this.allowedTabs.find(({ value }) => value === queryValue)?.value;
  }

  protected async beforeDestroy(): Promise<void> {
    const { name, params, query } = this.$route;
    if (name && this.queryParam && this.queryParam in query) {
      const transformQuery = { ...query };
      delete transformQuery[this.queryParam];

      await this.$router.replace({ name, params, query: transformQuery });
    }
  }

}

</script>

<style lang="scss">
@import "~@/assets/styles/parts/_tabs";
</style>
